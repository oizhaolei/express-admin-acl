/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Role = require('../models/role');

exports.name = 'role';

exports.authorization = true;

exports.list = function(req, res, next){
  var offset = req.query.offset;
  var limit = req.query.limit;
  Role.find().limit(limit).skip(offset).exec(function(err, results) {
    Role.count().exec(function(err, count) {
      res.json( {
        data : results,
        count : count
      });
    });
  });
};

exports.update = function(req, res, next){
  //todo
  console.log('roles.create');
};

exports.del = function(req, res, next){
  var id = req.params.role_id;
  Role.remove({id : id}, function(err) {
    res.json({success : true});
  });
};

exports.show = function(req, res, next){
  var id = req.params.role_id;
  Role.findOne(mongoose.Types.ObjectId(id), function(err, role) {
    res.json( role );
  });
};
