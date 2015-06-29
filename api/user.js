/**
 * Module dependencies.
 */

var Users = require("../dao/users.js");
var usersDao = new Users();

exports.name = 'user';

exports.authorization = true;

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

exports.del = function(req, res, next){
  var id = req.params.user_id;
  usersDao.removeUser(id);

  res.json({success : true});
};

exports.show = function(req, res, next){
  var id = req.params.user_id;
  var user = usersDao.getUser(id);
  res.json( user );
};

exports.update = function(req, res, next){
  var id = req.params.user_id;
  var body = req.body;
  usersDao.updateUser(id, {
    body : body
  }, function (err) {
    var user = usersDao.getUser(id);
    res.json( user );
  });
};
