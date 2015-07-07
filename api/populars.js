"use strict";
/**
 * Module dependencies.
 */
var logger = require('log4js').getLogger('api/populars.js');
var config = require('../config.json');

var mongoose = require('mongoose');
var User_Photo = require('../models/user_photo');

exports.name = 'popular';

exports.authorization = false;

exports.hot = function(req, res, next){
  var lastId = req.query.last_id;

  var query = User_Photo.find().limit(config.rows_per_page).sort({'_id': -1});
  if (lastId)
    query.where('_id').lt(lastId);
  query.exec(function(err, results) {
    User_Photo.count().exec(function(err, count) {
      res.json( {
        data : results,
        rows_per_page : config.rows_per_page,
        count : count
      });
    });
  });
};

exports.show = function(req, res, next){
  var popular_id = req.params.popular_id;
  User_Photo.findOne(mongoose.Types.ObjectId(popular_id), function(err, popular) {
    res.json( popular );
  });
};
