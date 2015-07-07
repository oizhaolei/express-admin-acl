"use strict";

var logger = require('log4js').getLogger('test/popular-mysql2mongo.js');

var config = require('../config.json');
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect(config.mongodb.url);

var mysql = require('mysql');
var pool = mysql.createPool(config.mysql.ttt);

var counter = 0;

var importUserPhotoRow = function(user_photo){
  var UserPhoto = require('../models/user_photo');
  // find a user in Mongo with provided username
  UserPhoto.findOne({ 'old_id' :  user_photo.id }, function(err, userPhoto) {
    // In case of any error, return using the done method
    if (err){
      console.dir(err);
      return;
    }
    // already exists
    if (userPhoto) {
      logger.info('UserPhoto already exists with id: '+user_photo.id);
    } else {
      // if there is no user with that email
      // create the user
      var newUserPhoto = new UserPhoto();

      newUserPhoto.mysql_id = user_photo.id;
      newUserPhoto.parent_id = user_photo.parent_id;
      newUserPhoto.user_id = user_photo.userid;
      newUserPhoto.channel_id = user_photo.channel_id;
      newUserPhoto.pic_url = user_photo.pic_url;
      newUserPhoto.fullname = user_photo.fullname;
      newUserPhoto.user_pic = user_photo.user_pic;
      newUserPhoto.content = user_photo.content;
      newUserPhoto.lang = user_photo.lang;
      newUserPhoto.address = user_photo.address;
      newUserPhoto.late6 = user_photo.late6;
      newUserPhoto.lnge6 = user_photo.lnge6;
      newUserPhoto.width = user_photo.width;
      newUserPhoto.height = user_photo.height;
      newUserPhoto.category = user_photo.category;
      newUserPhoto.good = user_photo.good;
      newUserPhoto.present_count = user_photo.present_count;
      newUserPhoto.comment = user_photo.comment;
      newUserPhoto.chosen = user_photo.chosen;
      newUserPhoto.create_id = user_photo.create_id;
      newUserPhoto.create_date = user_photo.create_date;
      if (user_photo.parent_id > 0) {
        UserPhoto.update({mysql_id : user_photo.parent_id}, { $push: { children : newUserPhoto } }, function(err) {
          if (err){
            logger.info('Error in Saving user photo: ' + err);
            throw err;
          }
          logger.info('UserPhoto Registration succesful ' , (++counter), user_photo);
        });
      } else {
        // save the user
        newUserPhoto.save(function(err) {
          if (err){
            logger.info('Error in Saving user photo: '+err);
            throw err;
          }
          logger.info('UserPhoto Registration succesful ' , (++counter), user_photo);
        });
      }
    }
  });
};

//write properties
var writeProperties = function(properties) {
  var data = JSON.stringify(properties);
  fs.writeFile(config.properties.file, data, function (err) {
    if (err) {
      logger.info('There has been an error saving your configuration data.');
      logger.info(err.message);
      return;
    }
    logger.info('Configuration saved successfully.');
  });
};


// var mysql = require('mysql');
// var pool = mysql.createPool(config.mysql.ttt);
var properties;
try {
  var data = fs.readFileSync(config.properties.file);
  properties = JSON.parse(data);
  logger.info(properties);

} catch (err) {
  logger.info(err);
  properties = {
    user_photo_id : 0
  };
}

//import user_photo
var importUserPhoto = function(properties) {
  var sql = 'select up.*, u.fullname, u.pic_url user_pic from tbl_user_photo up left join tbl_user u on up.userid=u.id where up.id > ? order by up.id limit 100 ';
  var args = [ properties.user_photo_id];

  logger.info(sql, args);
  pool.query(sql, args, function(err, data) {
    if (err) {
      console.dir(err);
    } else {
      var row;
      for(var i in data) {
        row = data[i];

        importUserPhotoRow(row);
      }
      properties.user_photo_id = row.id;
      writeProperties(properties);
    }
  });

};


// tbl_user_photo
importUserPhoto(properties);
// tbl_user_story_like
// tbl_user_story_translate
// tbl_user_story_translate_like
// tbl_channel
// tbl_channel_title_translate
// tbl_channel_follower
