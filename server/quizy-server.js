var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
var app = express();
var port = 3000;
if (process.argv.length > 2) {
    port = parseInt(process.argv[2]);
}

var games = {};

app.use(bodyParser.json());
app.use(cors());
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
        startTime: time
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
    var penaltyTimes = req.body.penaltyTimes;
    if (!penaltyTimes) {
        penaltyTimes = 0;
    }
    if (gameId === undefined
        || games[gameId] === undefined
        || username === undefined
        || games[gameId].players.indexOf(username) === -1) {
        res.status(400).send();
        return;
    }
    console.log('Player "' + username + '" finished the game in (' + Date.now() - games[gameId].startTime + ' ms)');
    games[gameId].gameStats.push({
        username,
        finishedTime: Date.now(),
        penaltyTimes
    });
    res.send();
});

app.get('/admin/:gameId/start', function (req, res) {
    const gameId = req.params.gameId;
    if (gameId === undefined
        || games[gameId] === undefined) {
        res.status(400).send();
        return;
    }
    games[gameId].startTime = Date.now() + 5000;
    res.send();
});

app.post('/admin/registerGame', function (req, res) {
    const gameId = req.body.gameId;
    if (gameId === undefined
        || games[gameId] !== undefined){
        res.status(400).send();
        return;
    }
    addGame(gameId);
    res.send();
});

app.post('/admin/clearGame', function (req, res) {
    //TODO

});

app.listen(port, function () {
    console.log('Dummy quiz-server listening on port ' +  port +'!');
    addGame('test');
});

function addGame(gameId) {
    if (games[gameId] !== undefined) {
        return false;
    }
    games[gameId] = {};
    games[gameId].startTime = 0;
    games[gameId].players = [];
    games[gameId].gameStats = [];
    console.log('Game => ' + gameId + ' was registered');
}
