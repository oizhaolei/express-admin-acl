/**
 * Module dependencies.
 */

var db = require('../db');
var Users = require("../dao/users.js");
var usersDao = new Users();

exports.name = 'user';

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
  var statuses = req.query.statuses;
  if(statuses){
    statuses = JSON.parse(unescape(statuses));
  } else {
    statuses = [];
  }
  usersDao.jplist(statuses, function (json) {
    res.json( json );
  });
};

exports.edit = function(req, res, next){
  res.json( req.user );
};

exports.del = function(req, res, next){
  var id = req.params.user_id;
  if (id && id < db.users.length) {
    db.users.splice(id, 1);
  }

  res.json({success : true});
};

exports.show = function(req, res, next){
  res.json( req.user );
};

exports.update = function(req, res, next){
  var body = req.body;
  req.user.name = body.user.name;
  res.json( req.user );
};
