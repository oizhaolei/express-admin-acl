/**
 * Module dependencies.
 */

var express = require('express');
var fs = require('fs');

module.exports = function(parent, options){
  var verbose = options.verbose;

  //restful api
  fs.readdirSync(__dirname + '/../api').forEach(function(name){
    verbose && console.log('\n   %s:', name);
    var obj = require('./../api/' + name);
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
      if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
      // route exports
      switch (key) {
      case 'show':
        method = 'get';
        path = '/' + name + '/:' + name + '_id';
        break;
      case 'list':
        method = 'get';
        path = '/' + name + 's';
        break;
      case 'edit':
        method = 'get';
        path = '/' + name + '/:' + name + '_id/edit';
        break;
      case 'update':
        method = 'put';
        path = '/' + name + '/:' + name + '_id';
        break;
      case 'del':
        method = 'delete';
        path = '/' + name + '/:' + name + '_id';
        break;
      case 'create':
        method = 'post';
        path = '/' + name;
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

      // before middleware support
      if (obj.before) {
        app[method](path, obj.before, handler);
        verbose && console.log('     %s %s -> before -> %s', method.toUpperCase(), path, key);
      } else {
        app[method](path, handler);
        verbose && console.log('     %s %s -> %s', method.toUpperCase(), path, key);
      }
    }

    // mount the app
    parent.use('/api', app);
  });

  //web mapping
  fs.readdirSync(__dirname + '/../routes').forEach(function(name){
    verbose && console.log('\n   %s:', name);
    var obj = require('./../routes/' + name);
    name = obj.name || name;
    var app = express();
    var handler;
    var method;
    var path;

    app.set('views', __dirname + '/../templates/views');

    // generate routes based
    // on the exported methods
    for (var key in obj) {
      if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;

      // route exports
      switch (key) {
      case 'show':
        method = 'get';
        path = '/' + name + '/:' + name + '_id';
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
        path = '/' + name + '/' + key;
      }


      // setup
      handler = obj[key];

      console.log('     %s %s -> %s', method.toUpperCase(), path, key);
      app[method](path, handler);

    }

    // mount the app
    parent.use('/', app);
  });

};
