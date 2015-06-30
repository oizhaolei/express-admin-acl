/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Permission = require('../models/permission');

exports.name = 'permission';

exports.authorization = true;

exports.list = function(req, res, next){
  var offset = req.query.offset;
  var limit = req.query.limit;
  Permission.find().limit(limit).skip(offset).exec(function(err, results) {
    Permission.count().exec(function(err, count) {
      res.json( {
        data : results,
        count : count
      });
    });
  });
};

exports.del = function(req, res, next){
  var id = req.params.permission_id;
  Permission.remove({id : id}, function(err) {
    res.json({success : true});
  });
};

exports.show = function(req, res, next){
  var id = req.params.permission_id;
  Permission.findOne(mongoose.Types.ObjectId(id), function(err, permission) {
    res.json( permission );
  });
};
