/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = require('../models/user');

exports.name = 'user';

exports.authorization = true;

exports.list = function(req, res, next){
  var offset = req.query.offset;
  var limit = req.query.limit;
  User.find().limit(limit).skip(offset).exec(function(err, results) {
    User.count().exec(function(err, count) {
      res.json( {
        data : results,
        count : count
      });
    });
  });
};

exports.update = function(req, res, next){
  //todo
  console.log('users.create');
};

exports.del = function(req, res, next){
  var id = req.params.user_id;
  User.remove({id : id}, function(err) {
    res.json({success : true});
  });
};

exports.show = function(req, res, next){
  var id = req.params.user_id;
  User.findOne(mongoose.Types.ObjectId(id), function(err, user) {
    res.json( user );
  });
};
