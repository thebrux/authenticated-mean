var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var app = express();
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'color-fancy-session-secret', key: 'sid', cookie: { secure: false, maxAge: 365 * 24 * 60 * 60 * 1000 /* 1 year */ }}))
app.use(passport.initialize());
app.use(passport.session());

var mongoose = require('mongoose');
var database = require('./server/config/database');
mongoose.connect(database.url);

var Item = require('./server/models/item');
var User = require('./server/models/user');

// Auth
var authRouter = express.Router();
var auth = require('./server/auth/core')(passport, authRouter, User);
require('./server/auth/google')(passport, authRouter);
require('./server/auth/facebook')(passport, authRouter);
//require('./server/auth/twitter')(passport, authRouter);

// REST API
var restApiRouter = express.Router();
require('./server/api/loggedin')(restApiRouter);
require('./server/api/items')(restApiRouter, auth, Item);

app.use('/api', restApiRouter);
app.use('/auth', authRouter);
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080;
app.listen(port);
console.log('Server running on port ' + port);
