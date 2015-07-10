"use strict";
/**
 * Module dependencies.
 */
var logger = require('log4js').getLogger('api/user_photos.js');
var config = require('../config.json');

var fs = require("fs");
var formidable = require("formidable");

var mongoose = require('mongoose');
var User_Photo = require('../models/user_photo');
var oss = require('../lib/oss');
var md5 = require('MD5');

exports.name = 'user_photo';

exports.authorization = true;

exports.timeline = function(req, res, next){
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

exports.create = function(req, res, next){
  logger.info('user-photos.create');
  var form = new formidable.IncomingForm();
  form.parse(req, function(error, fields, files) {
    logger.info(files.file.path);
    if (typeof (files.file) != "undefined" && typeof (files.file.path) != "undefined") {
      fs.readFile(files.file.path, function(err, buf) {
        var filename = md5(buf);
        oss.putObjectCallback(files.file.path, config.aliyun.oss.originalPrefix + filename, 'image/jpeg', 0);
        res.json({
          files : [
            {name : 'http://file.tttalk.org/' + config.aliyun.oss.originalPrefix + filename}
          ]
        });
      });
    }else{
      logger.error(error);
    }
  });
};

// exports.update = function(req, res, next){
//   var user_photo_id = req.params.user_photo_id;
//   //todo
//   var conditions = { _id : mongoose.Types.ObjectId(user_photo_id)};
//   var update = {$set: req.body};

//   logger.info(conditions);
//   logger.info(update);
//   User_Photo.update(conditions, update, function(err, numAffected) {
//     logger.info(err, numAffected);

//     res.json({success : true});
//   });
// };

// exports.del = function(req, res, next){
//   var user_photo_id = req.params.user_photo_id;
//   User_Photo.remove({id : user_photo_id}, function(err) {
//     res.json({success : true});
//   });
// };

exports.show = function(req, res, next){
  var user_photo_id = req.params.user_photo_id;
  User_Photo.findOne(mongoose.Types.ObjectId(user_photo_id), function(err, user_photo) {
    res.json( user_photo );
  });
};
