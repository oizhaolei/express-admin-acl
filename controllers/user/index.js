/**
 * Module dependencies.
 */

var db = require('../../db');
var Users = require("../../dao/users.js");
var usersDao = new Users();

exports.before = function(req, res, next){
  var id = req.params.user_id;
  if (!id) return next();
  // pretend to query a database...
  process.nextTick(function(){
    req.user = db.users[id];
    // cant find that user
    if (!req.user) return next('route');
    // found it, move on to the routes
    next();
  });
};

exports.list = function(req, res, next){
  usersDao.list(function (err, data) {
    if (err) {
    } else {
      res.render('list', { users: data });
    }
  });
};

exports.edit = function(req, res, next){
  res.render('edit', { user: req.user });
};

exports.del = function(req, res, next){
  var id = req.params.user_id;
  if (id && id < db.users.length) {
    db.users.splice(id, 1);
  }

  res.redirect('/users');
};

exports.show = function(req, res, next){
  res.render('show', { user: req.user });
};

exports.update = function(req, res, next){
  var body = req.body;
  req.user.name = body.user.name;
  res.message('Information updated!');
  res.redirect('/user/' + req.user.id);
};
