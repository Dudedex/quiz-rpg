const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const https = require('https');
const TYPE_CHECKBOX = 'CHECKBOX';
const TYPE_RADIO = 'RADIO';
const TYPE_IMAGESEARCH = 'IMAGE_SEARCH';
const TYPE_DRAG_AND_DROP = 'DRAG_AND_DROP';
const TYPE_AL_PACO_RACE = 'AL_PACO_RACE';

var app = express();
var port = 3000;
if (process.argv.length > 2) {
    port = parseInt(process.argv[2]);
}
var adminToken = '';

var games = {};
var questionIdToQuestionMap = {};
var rightAnswers = {};
var userTokens = {};


app.use(cors());
var tokenFilePath = path.join(__dirname, '.token');
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

app.post('/:gameId', bodyParser.json(), function (req, res) {
    const gameId = req.params.gameId;
    if (games[gameId] === undefined) {
        res.status(400).send();
        return;
    }
    const username = req.body.username;
    if (username) {
        games[gameId].lastTick[username] = Date.now();
    }
    var time = games[gameId].startTime;
    if (time < Date.now() - 5000) {
        time = 0;
    }
    if (time === 0) {
        res.send({
            timeUntilStartInMs: 0,
            players: games[gameId].players
        });
    } else {
        res.send({
            timeUntilStartInMs: (time - Date.now()),
            players: games[gameId].players
        });
    }

});

app.post('/:gameId/registerPlayer', bodyParser.json(), function (req, res) {
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
    const userToken = uuidv4();
    userTokens[userToken] = username;
    games[gameId].lastTick[username] = [];
    res.send({
        quiz: games[gameId].quiz,
        userToken
    });
});

app.post('/:gameId/checkAnswer', bodyParser.json(), function (req, res) {
    const gameId = req.params.gameId;
    const questionId = req.body.questionId;
    const userToken = req.body.userToken;
    const answerIds = req.body.answerIds;
    if (gameId === undefined
        || games[gameId] === undefined
        || questionId === undefined
        || userToken === undefined
        || userTokens[userToken] === undefined
        || questionIdToQuestionMap[gameId] === undefined
        || questionIdToQuestionMap[gameId][questionId] === undefined
        || !Array.isArray(answerIds)) {
        console.log('checkAnswer => precheck failed for game ' + gameId);
        console.log(userToken);
        console.log(userTokens[userToken]);
        res.status(400).send();
        return;
    }
    const question = questionIdToQuestionMap[gameId][questionId];
    if (question.type === TYPE_RADIO) {
        checkRadioQuestion(question, gameId, answerIds, userToken, res);
    }
    if (question.type === TYPE_CHECKBOX) {
        checkCheckboxQuestion(question, gameId, answerIds, userToken, res);
    }
    if (question.type === TYPE_DRAG_AND_DROP) {
        checkDragAndDrop(question, gameId, answerIds, userToken, res);
    }
    if (question.type === TYPE_AL_PACO_RACE) {
        checkNotFailableQuestion(question, gameId, userToken, res);
    }
    if (question.type === TYPE_IMAGESEARCH) {
        checkNotFailableQuestion(question, gameId, userToken, res);
    }
    res.status(400).send();
});

app.post('/:gameId/finished', bodyParser.json(), function (req, res) {
    const gameId = req.params.gameId;
    const userToken = req.body.userToken;
    if (gameId === undefined
        || games[gameId] === undefined
        || userToken === undefined
        || userTokens[userToken] === undefined) {
        res.status(400).send();
        return;
    }
    const username = userTokens[userToken];
    console.log('Player "' + username + '" finished the game in (' + (Date.now() - games[gameId].startTime) + ' ms)');
    var wrongAnswers = games[gameId].questionProgress[username].filter(q => !q.answeredCorrectly);
    games[gameId].gameStats.push({
        username,
        finishedTime: Date.now(),
        wrongAnswersCount: wrongAnswers.length
    });
    res.send();
});

app.post('/:gameId/endGameStats', bodyParser.json(), function (req, res) {
    const gameId = req.params.gameId;
    if (gameId === undefined
        || games[gameId] === undefined) {
        res.status(400).send();
        return;
    }
    res.send({
        gameStats: games[gameId].gameStats,
        gameDetailsForUser: games[gameId].questionProgress,
    });
});

app.post('/:gameId/admin/startGame', bodyParser.json(), function (req, res) {
    const gameId = req.params.gameId;
    if (gameId === undefined
        || games[gameId] === undefined
        || games[gameId].startTime !== 0) {
        console.log('invalid game');
        res.status(400).send();
        return;
    }
    if (!validateAdmin(req, res)) {
        return;
    }
    games[gameId].startTime = Date.now() + 5000;
    res.send();
});

app.post('/:gameId/admin/registerGame', bodyParser.json(), function (req, res) {
    const gameId = req.params.gameId;
    const fileName = req.body.quizFileName;
    if (gameId === undefined
        || gameId.length < 3
        || games[gameId] !== undefined) {
        console.log('invalid game');
        res.status(400).send();
        return;
    }
    if (!validateAdmin(req, res)) {
        return;
    }
    if (fileName === undefined) {
        addOrClearGame(gameId, 'quiz-1.json', false);
    } else {
        addOrClearGame(gameId, 'custom-quiz/' + fileName + '.json', false);
    }
    res.send();
});

app.post('/:gameId/admin/deleteGame', bodyParser.json(), function (req, res) {
    const gameId = req.params.gameId;
    if (gameId === undefined
        || gameId.length < 3
        || games[gameId] === undefined) {
        console.log('invalid game');
        res.status(400).send();
        return;
    }
    if (!validateAdmin(req, res)) {
        return;
    }
    delete games[gameId];
    delete rightAnswers[gameId];
    delete questionIdToQuestionMap[gameId];
    res.sendStatus(204);
});


app.post('/:gameId/admin/clearGame', bodyParser.json(), function (req, res) {
    const gameId = req.params.gameId;
    if (gameId === undefined
        || games[gameId] === undefined) {
        res.status(404).send();
        return;
    }
    if (!validateAdmin(req, res)) {
        return;
    }
    addOrClearGame(gameId, games[gameId].gameFileName, true);
    res.sendStatus(204);
});

app.get('/admin/games', bodyParser.json(), function (req, res) {
    if (!validateAdmin(req, res)) {
        return;
    }
    const gameObject = [];
    Object.keys(games).forEach(function (gameId, index) {
        const game = games[gameId];
        if (game) {
            gameObject.push({
                name: game.name,
                startTime: game.startTime,
                players: game.players,
                numOfQuestions: game.numOfQuestions,
                questionProgress: game.questionProgress,
                lastTick: game.lastTick,
                currentServerTime: Date.now(),
                gameStats: game.gameStats
            });
        }
    });
    res.send(gameObject);
});

app.post('/admin/quiz/createOrUpdate', bodyParser.json({limit: '50mb', parameterLimit:50000}), function (req, res) {
    if (!validateAdmin(req, res)) {
        return;
    }
    const customQuizzesBasePath = 'quizzes/custom-quiz/'
    const quiz = req.body;
    if (!quiz.isNew) {
        if (!fs.existsSync(customQuizzesBasePath + quiz.name + '.json')) {
            res.sendStatus(400);
            return;
        }
    } else  {
        if (fs.existsSync(customQuizzesBasePath + quiz.name + '.json')) {
            res.sendStatus(400);
            return;
        }
        quiz.id = uuidv4();
    }
    fs.writeFileSync(customQuizzesBasePath + quiz.name + '.json', JSON.stringify(quiz), {encoding: 'utf8'});
    res.sendStatus(204);
});

console.log('Dummy quiz-server listening on port ' + port + '!');
if (fs.existsSync(tokenFilePath)) {
    adminToken = fs.readFileSync(tokenFilePath, {encoding: 'utf8'});
    if (adminToken) {
        adminToken = adminToken.trim();
    }
}

addOrClearGame('show', 'quiz-1.json', false);

function validateAdmin(req, res) {
    const providedToken = req.headers ? req.headers['authorization'] : '';
    if (adminToken !== providedToken) {
        console.log('Invalid token skip throw 401');
        console.log('Provided Token was: ' + providedToken);
        res.status(401).send();
        return false;
    }
    return true;
}

function addOrClearGame(gameId, quizFileName, isClear) {
    if (games[gameId] !== undefined && !isClear) {
        return false;
    }
    games[gameId] = {};
    games[gameId].name = gameId;
    games[gameId].startTime = 0;
    games[gameId].players = [];
    games[gameId].questionProgress = {};
    games[gameId].lastTick = {};
    games[gameId].gameStats = [];
    games[gameId].gameFileName = quizFileName;
    games[gameId].quiz = JSON.parse(fs.readFileSync(path.join(__dirname, '/quizzes/' + quizFileName)));
    rightAnswers[gameId] = {};
    questionIdToQuestionMap[gameId] = {};
    games[gameId].quiz.questions.forEach((q) => {
        q.uuid = uuidv4();
        rightAnswers[gameId][q.uuid] = [];
        questionIdToQuestionMap[gameId][q.uuid] = q;
        q.options.forEach((o) => {
            o.uuid = uuidv4();
            if (o.correct || q.type === TYPE_DRAG_AND_DROP) {
                rightAnswers[gameId][q.uuid].push(o.uuid);
            }
            delete o.correct;
        });
    });
    games[gameId].numOfQuestions = games[gameId].quiz.questions.length;
    console.log('Game => ' + gameId + ' was registered');
}

function checkRadioQuestion(question, gameId, answerIds, userToken, res) {
    if (answerIds.length > 1) {
        res.status(400).send();
        return;
    }
    const answeredCorrectly = rightAnswers[gameId][question.uuid].indexOf(answerIds[0]) > -1;
    trackProgress(gameId, userToken, question, answeredCorrectly);
    res.send({
        correct: answeredCorrectly
    });
}

function checkCheckboxQuestion(question, gameId, answerIds, userToken, res) {
    for (var i = 0; i < question.options.length; i++) {
        const answerOptionCorrect = rightAnswers[gameId][question.uuid].indexOf(question.options[i].uuid) !== -1;
        const answerSelected = answerIds.indexOf(question.options[i].uuid) !== -1;
        if ((answerOptionCorrect && !answerSelected) || (!answerOptionCorrect && answerSelected)) {
            trackProgress(gameId, userToken, question, false);
            res.send({
                correct: false
            });
            return;
        }
    }
    trackProgress(gameId, userToken, question, true);
    res.send({
        correct: true
    });
    return;
}

function checkDragAndDrop(question, gameId, answerIds, userToken, res) {
    for (var i = 0; i < question.options.length; i++) {
        if (rightAnswers[gameId][question.uuid][i] !== answerIds[i]) {
            trackProgress(gameId, userToken, question, false);
            res.send({
                correct: false
            });
            return;
        }
    }
    trackProgress(gameId, userToken, question, true);
    res.send({
        correct: true
    });
}

function checkNotFailableQuestion(question, gameId, userToken, res) {
    trackProgress(gameId, userToken, question, true);
    res.send({
        correct: true
    });
}

function trackProgress(gameId, userToken, question, answeredCorrectly) {
    const username = userTokens[userToken];
    if (!games[gameId].questionProgress[username]) {
        games[gameId].questionProgress[username] = [];
    }
    games[gameId].questionProgress[username].push({
        questionId: question.uuid,
        time: Date.now(),
        answeredCorrectly
    })
}

