"use strict";
/**
 * Module dependencies.
 */
var logger = require('log4js').getLogger('app');

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var config = require('./config.json');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(config.mongodb.url);

var app = module.exports = express();

// settings
var flash = require('connect-flash');
app.use(flash());

// set views for error and 404 pages
app.set('views', __dirname + '/templates/views');

// set our default template engine to "jade"
// which prevents the need for extensions
app.set('view engine', 'jade');

// define a custom res.message() method
// which stores messages in the session
app.response.message = function(msg){
  // reference `req.session` via the `this.req` reference
  var sess = this.req.session;
  // simply add the msg to an array for later
  sess.messages = sess.messages || [];
  sess.messages.push(msg);
  return this;
};

// serve static files
app.use(express.static(__dirname + '/public'));

// session support
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'some secret here'
}));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());


// Initialize Passport
require('./passport/init')(passport);

// parse request bodies (req.body)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// allow overriding methods in query (?_method=put)
app.use(methodOverride('_method'));

// expose the "messages" local variable when views are rendered
app.use(function(req, res, next){
  var msgs = req.session.messages || [];
  delete req.session.messages;
  logger.info('msg.');

  // expose "messages" local variable
  res.locals.messages = msgs;

  // expose "hasMessages"
  res.locals.hasMessages = !! msgs.length;

  /* This is equivalent:
   res.locals({
     messages: msgs,
     hasMessages: !! msgs.length
   });
  */

  next();
  // empty or "flush" the messages so they
  // don't build up
  req.session.messages = [];
});

//nav
app.use(function(req, res, next){
  res.locals.navLinks = [
    { label: 'Home', key: 'home', href: '/' },
    { label: 'Users', key: 'users', href: '/users' },
    { label: 'Roles', key: 'roles', href: '/roles' },
    { label: 'Resources', key: 'resources', href: '/resources' },
    { label: 'Permissions', key: 'permissions', href: '/permissions' }
  ];
  next();
});

// load restful api
require('./mapping')(app, passport, { verbose: !module.parent });

app.use(function(err, req, res, next){
  // log it
  if (!module.parent) console.error(err.stack);

  // error page
  res.status(500).render('errors/500');
});

// assume 404 since no middleware responded
app.use(function(req, res, next){
  res.status(404).render('errors/404', { url: req.originalUrl });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  logger.info('Express started on port 3000');
}
