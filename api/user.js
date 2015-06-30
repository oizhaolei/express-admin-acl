/**
 * Module dependencies.
 */

var User = require('../models/user');

exports.name = 'user';

exports.authorization = true;

exports.list = function(req, res, next){
  var offset = req.query.offset;
  var limit = req.query.limit;
console.log(offset);
console.log(limit);
  User.find().limit(limit).skip(offset).exec(function(err, results) {
    User.count().exec(function(err, count) {
      res.json( {
        data : results,
        count : count
      });
    });
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
