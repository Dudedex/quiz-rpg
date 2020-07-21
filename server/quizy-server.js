var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'start.html');

app.use(bodyParser.json());
app.use(cors())
app.get('/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    const timeStr = fs.readFileSync('startTime.txt',{ encoding: 'utf8' });
    var time = parseInt(timeStr);
    if (time < new Date().getTime()) {
        time = 0;
    }
    res.send({
        startTime: time
    });
});

app.post('/finished', function (req, res) {
    console.log(req.body);
    console.log('-------------------------------------------');
    console.log(res.body);
    res.send();
});

app.get('/start', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    fs.writeFileSync('startTime.txt', new Date().getTime() + 5000)
    res.send();
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
