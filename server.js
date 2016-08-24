
var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

//make express look in public directory for assets

app.use(express.static(__dirname + '/'));

// basic route
app.get('/', function(req, res) {
    res.sendFile('./index');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);