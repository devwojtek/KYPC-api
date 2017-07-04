global.rootRequire = function(filepath) {
    return require(__dirname + '/' + filepath);
};

// get the packages we need ============
// =======================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User = require('./models/user'); // get our mongoose model
var fileUpload = require('express-fileupload');
var eventController = require('./api/v1/controllers/event')
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
// mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

var db = require('./db/queries');
// use body parser so we can get info from POST and/or URL parameters
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(fileUpload());
// use morgan to log requests to the console
app.use(morgan('dev'));
// Add headers
// app.use(function (req, res, next) {

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

/*
 * Define APIs By Version
 */
var v1 = rootRequire('api/v1');
app.use('/api/v1', v1);

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('appear-event', function(message){
  	console.log('message = ', message);
    eventController.create_event(message, io) 
  });
});


// =======================
// start the server ======
// =======================
http.listen(port);
console.log('Magic happens at http://localhost:' + port);


