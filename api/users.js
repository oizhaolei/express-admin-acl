"use strict";
/**
 * Module dependencies.
 */
var logger = require('log4js').getLogger('api/users.js');

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
  var user_id = req.params.user_id;
  //todo
  var conditions = { _id : mongoose.Types.ObjectId(user_id)};
  var update = {$set: req.body};

  logger.info(conditions);
  logger.info(update);
  User.update(conditions, update, function(err, numAffected) {
    logger.info(err, numAffected);

    res.json({success : true});
  });
};

exports.del = function(req, res, next){
  var user_id = req.params.user_id;
  User.remove({id : user_id}, function(err) {
    res.json({success : true});
  });
};

exports.show = function(req, res, next){
  var user_id = req.params.user_id;
  User.findOne(mongoose.Types.ObjectId(user_id), function(err, user) {
    res.json( user );
  });
};
