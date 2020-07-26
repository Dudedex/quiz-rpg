var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
var app = express();
var port = 3000;
if (process.argv.length > 2) {
    port = parseInt(process.argv[2]);
}
var games = {};
var requiredToken = '';
app.use(bodyParser.json());
app.use(cors());

var fs = require('fs');
var path = require('path');
var tokenFilePath = path.join(__dirname, '.token');

var https = require('https');
var options = undefined;
if (fs.existsSync(".cert-paths.txt")) {
    const certificateFilePath = JSON.parse(fs.readFileSync('.cert-paths.txt'));
    options = {
        key: fs.readFileSync(certificateFilePath.key, 'utf8'),
        cert: fs.readFileSync(certificateFilePath.cert, 'utf8'),
        ca: fs.readFileSync(certificateFilePath.ca, 'utf8'),
    };
}

// Create an HTTP service.
if (!options) {
    console.log('Creating http server');
    app.listen(port);
} else {
    console.log('Creating https server');
    https.createServer(options, app).listen(port);
}

app.get('/:gameId', function (req, res) {
    const gameId = req.params.gameId;
    if (games[gameId] === undefined) {
        res.status(400).send();
        return;
    }
    var time = games[gameId].startTime;
    if (time < Date.now()) {
        time = 0;
    }
    res.send({
        startTime: time,
        players: games[gameId].players
    });
});

app.post('/:gameId/registerPlayer', function (req, res) {
    const gameId = req.params.gameId;
    const username = req.body.username;
    if (gameId === undefined
        || games[gameId] === undefined
        || (games[gameId].startTime > 0 && games[gameId].startTime < Date.now())) {
        res.status(404).send();
        return;
    }
    if (username === undefined
        || username.trim().length < 3
        || games[gameId].players.indexOf(username) !== -1) {
        res.status(400).send();
        return;
    }
    console.log('Player "' + username + '" signed up for the game');
    games[gameId].players.push(username);
    res.send();
});

app.post('/:gameId/finished', function (req, res) {
    const gameId = req.params.gameId;
    const username = req.body.username;
    var penaltyTime = req.body.penaltyTimes;
    if (!penaltyTime) {
        penaltyTime = 0;
    }
    if (gameId === undefined
        || games[gameId] === undefined
        || username === undefined
        || games[gameId].players.indexOf(username) === -1) {
        res.status(400).send();
        return;
    }
    console.log('Player "' + username + '" finished the game in (' + (Date.now() - games[gameId].startTime) + ' ms)');
    games[gameId].gameStats.push({
        username,
        finishedTime: Date.now(),
        penaltyTime: penaltyTime
    });
    res.send();
});

app.post('/:gameId/stats', function (req, res) {
    const gameId = req.params.gameId;
    if (gameId === undefined
        || games[gameId] === undefined) {
        res.status(400).send();
        return;
    }
    res.send(games[gameId].gameStats);
});

app.post('/:gameId/admin/startGame', function (req, res) {
    const gameId = req.params.gameId;
    if (gameId === undefined
        || games[gameId] === undefined
        || games[gameId].startTime !== 0) {
        console.log('invalid game');
        res.status(400).send();
        return;
    }
    if(!validateAdmin(req, res)) {
        return;
    }
    games[gameId].startTime = Date.now() + 5000;
    res.send();
});

app.post('/:gameId/admin/registerGame', function (req, res) {
    const gameId = req.params.gameId;
    if (gameId === undefined
        || gameId.length < 3
        || games[gameId] !== undefined){
        console.log('invalid game');
        res.status(400).send();
        return;
    }
    if(!validateAdmin(req, res)) {
        return;
    }
    addOrClearGame(gameId, false);
    res.send();
});

app.post('/:gameId/admin/deleteGame', function (req, res) {
    const gameId = req.params.gameId;
    if (gameId === undefined
        || gameId.length < 3
        || games[gameId] === undefined){
        console.log('invalid game');
        res.status(400).send();
        return;
    }
    if(!validateAdmin(req, res)) {
        return;
    }
    delete games[gameId];
    games = JSON.parse(JSON.stringify(games));
    res.send();
});


app.post('/:gameId/admin/clearGame', function (req, res) {
    const gameId = req.params.gameId;
    if (gameId === undefined
        || games[gameId] === undefined) {
        res.status(404).send();
        return;
    }
    if(!validateAdmin(req, res)) {
        return;
    }
    addOrClearGame(gameId, true);
    res.send();
});

app.get('/admin/games', function (req, res) {
    if(!validateAdmin(req, res)) {
        return;
    }
    const gameObject = [];
    Object.keys(games).forEach(function(key,index) {
        gameObject.push(games[key]);
    });
    res.send(gameObject);
});

console.log('Dummy quiz-server listening on port ' +  port +'!');
requiredToken = fs.readFileSync(tokenFilePath, {encoding:'utf8'});
if (requiredToken) {
    requiredToken = requiredToken.trim();
}
addOrClearGame('show', false);

function validateAdmin(req, res) {
    const providedToken = req.headers ? req.headers['authorization']: '';
    if (requiredToken !== providedToken) {
        console.log('Invalid token skip throw 401');
        console.log('Provided Token was: ' + providedToken);
        res.status(401).send();
        return false;
    }
    return true;
}

function addOrClearGame(gameId, isClear) {
    if (games[gameId] !== undefined && !isClear) {
        return false;
    }
    games[gameId] = {};
    games[gameId].name = gameId;
    games[gameId].startTime = 0;
    games[gameId].players = [];
    games[gameId].gameStats = [];
    console.log('Game => ' + gameId + ' was registered');
}
