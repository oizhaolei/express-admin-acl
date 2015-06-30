/**
 * Module dependencies.
 */

var express = require('express');
var fs = require('fs');

var isAuthenticated = function (req, res, next) {
  console.log('authenticated check.');

  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
};

module.exports = function(parent, passport, options){
  var verbose = options.verbose;

  //restful api
  var api_path = '/api';
  fs.readdirSync(__dirname + '/api').forEach(function(name){
    verbose && console.log('\n   %s:', name);
    var obj = require('./api/' + name);
    name = obj.name || name;
    var prefix = obj.prefix || '';
    var app = express();
    var handler;
    var method;
    var path;

    // generate routes based
    // on the exported methods
    for (var key in obj) {
      // "reserved" exports
      if (~['name', 'prefix', 'engine', 'authorization'].indexOf(key)) continue;
      // route exports
      switch (key) {
      case 'show':
        method = 'get';
        path = '/' + name + 's/:' + name + '_id';
        break;
      case 'list':
        method = 'get';
        path = '/' + name + 's';
        break;
      case 'edit':
        method = 'get';
        path = '/' + name + 's/:' + name + '_id/edit';
        break;
      case 'update':
        method = 'put';
        path = '/' + name + 's/:' + name + '_id';
        break;
      case 'del':
        method = 'delete';
        path = '/' + name + 's/:' + name + '_id';
        break;
      case 'create':
        method = 'post';
        path = '/' + name + 's';
        break;
      case 'index':
        method = 'get';
        path = '/';
        break;
      default:
        /* istanbul ignore next */
        throw new Error('unrecognized route: ' + name + '.' + key);
      }

      // setup
      handler = obj[key];
      path = prefix + path;

      // authorization middleware support
      if (obj.authorization) {
        app[method](path, isAuthenticated, handler);
        verbose && console.log('     %s %s%s -> authorization -> %s', method.toUpperCase(), api_path, path, key);
      } else {
        app[method](path, handler);
        verbose && console.log('     %s %s%s -> %s', method.toUpperCase(), api_path, path, key);
      }
    }

    // mount the app
    parent.use(api_path, app);
  });

  //web mapping
  fs.readdirSync(__dirname + '/routes').forEach(function(name){
    verbose && console.log('\n   %s:', name);
    var obj = require('./routes/' + name);
    name = obj.name || name;
    var app = express();
    var handler;
    var method;
    var path;

    app.set('views', __dirname + '/templates/views');

    // generate routes based
    // on the exported methods
    for (var key in obj) {
      if (~['name', 'prefix', 'engine', 'authorization'].indexOf(key)) continue;

      // route exports
      switch (key) {
      case 'show':
        method = 'get';
        path = '/' + name + 's/:' + name + '_id';
        break;
      case 'list':
        method = 'get';
        path = '/' + name + 's';
        break;
      case 'index':
        method = 'get';
        path = '/';
        break;
      default:
        method = 'get';
        path = '/' + name + 's/' + key;
      }


      // setup
      handler = obj[key];

      // authorization middleware support
      if (obj.authorization) {
        app[method](path, isAuthenticated, handler);
        verbose && console.log('     %s %s -> authorization -> %s', method.toUpperCase(), path, key);
      } else {
        app[method](path, handler);
        verbose && console.log('     %s %s -> %s', method.toUpperCase(), path, key);
      }

    }

    // mount the app
    parent.use(app);
  });

  //customize
  parent.get('/', function(req, res) {
    res.render('index', { user: req.user } );
  });

  /* Handle Login POST */
  parent.get('/login',function(req, res){
    res.render('login', { message: req.flash('message')});
  });

  parent.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash : true
  }));

  /* GET Registration Page */
  parent.get('/signup', function(req, res){
    res.render('register', { message: req.flash('message')});
  });

  /* Handle Registration POST */
  parent.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash : true
  }));


  /* Handle Logout */
  parent.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};
