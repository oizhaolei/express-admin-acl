/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Resource = require('../models/resource');

exports.name = 'resource';

exports.authorization = true;

exports.list = function(req, res, next){
  var offset = req.query.offset;
  var limit = req.query.limit;
  Resource.find().limit(limit).skip(offset).exec(function(err, results) {
    Resource.count().exec(function(err, count) {
      res.json( {
        data : results,
        count : count
      });
    });
  });
};

exports.del = function(req, res, next){
  var id = req.params.resource_id;
  Resource.remove({id : id}, function(err) {
    res.json({success : true});
  });
};

exports.show = function(req, res, next){
  var id = req.params.resource_id;
  Resource.findOne(mongoose.Types.ObjectId(id), function(err, resource) {
    res.json( resource );
  });
};
