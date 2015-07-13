"use strict";

var logger = require('log4js').getLogger('test/popular-mysql2mongo.js');
var _ = require('lodash');

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
    if (userPhoto) {
      logger.info('UserPhoto already exists with id: '+user_photo.id);
    } else {
      if (user_photo.parent_id > 0) {
        var newUserPhotoComment  = {
            mysql_id : user_photo.id,
            user_id : user_photo.userid,
            pic_url : user_photo.pic_url,
            fullname : user_photo.fullname,
            user_pic : user_photo.user_pic,
            content : user_photo.content,
            lang : user_photo.lang,
            address : user_photo.address,
            late6 : user_photo.late6,
            lnge6 : user_photo.lnge6,
            width : user_photo.width,
            height : user_photo.height,
            create_date : user_photo.create_date
          };
        UserPhoto.update({mysql_id : user_photo.parent_id}, { $push: { children : newUserPhotoComment } }, function(err) {
          if (err){
            logger.info('Error in Saving user photo: ' + err);
            throw err;
          }
          logger.info('UserPhoto Registration succesful ' , (++counter), user_photo);
        });
      } else {
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

var importUserStoryLikeRow = function(userStoryLike){
    var UserPhoto = require('../models/user_photo');
     UserPhoto.findOne({ 'mysql_id' :  userStoryLike.user_photo_id }, function(err, userPhoto) {
        // In case of any error, return using the done method
        if (err || userPhoto == null){
          console.dir(err);
          return;
        }
        var newUserStoryLike = {
            mysql_id : userStoryLike.id,
            user_id : userStoryLike.friend_id,
            pic_url : userStoryLike.pic_url,
            fullname : userStoryLike.fullname,
            create_data : userStoryLike.create_date
        };
        // save the user
        UserPhoto.update({mysql_id : userStoryLike.user_photo_id}, { $push: { like_children : newUserStoryLike } }, function(err) {
          if (err){
            logger.info('Error in Saving user story like: ' + err);
            throw err;
          }
          logger.info('UserStoryLike Registration succesful ' , (++counter), userStoryLike);
        });
     });
};


var importUserStoryTranslateRow = function(userStoryTranslate){
  var UserPhoto = require('../models/user_photo');
  UserPhoto.findOne({ 'mysql_id' :  userStoryTranslate.user_photo_id }, function(err, userPhoto) {
     // In case of any error, return using the done method
     if (err){
       console.dir(err);
       return;
     }
     var newUserStoryTranslate = {         
         mysql_id : userStoryTranslate.id,
         lang : userStoryTranslate.lang,
         content : userStoryTranslate.to_content,
         user_id : userStoryTranslate.user_id,
         pic_url : userStoryTranslate.pic_url,
         fullname : userStoryTranslate.fullname,
         create_date : userStoryTranslate.create_date
     }
     if(userPhoto != null){
         // save the user
         UserPhoto.update({mysql_id : userStoryTranslate.user_photo_id}, { $push: { translate_children : newUserStoryTranslate } }, function(err) {
           if (err){
             logger.info('Error in Saving user story translate: ' + err);
             throw err;
           }
           logger.info('UserStoryTranslate Registration succesful ' , (++counter), userStoryTranslate);
         });
      } else {
        UserPhoto.findOne({ 'children.mysql_id' :  userStoryTranslate.user_photo_id }, function(err, userPhoto) {
            if (err || userPhoto == null){
            console.dir(err);
            return;
          }
          UserPhoto.update({'children.mysql_id' : userStoryTranslate.user_photo_id}, { $push: { 'children.$.comment_translate_children' : newUserStoryTranslate } }, function(err) {
             if (err){
               logger.info('Error in Saving user story translate: ' + err);
               throw err;
             }
             logger.info('UserStoryTranslate Registration succesful '+userPhoto.mysql_id + ':' + userStoryTranslate.user_photo_id , (++counter), userStoryTranslate);
           });
        });
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


//import user_photo
var importUserPhoto = function(properties) {
  var sql = 'select up.*, u.fullname, u.pic_url user_pic from tbl_user_photo up left join tbl_user u on up.userid=u.id where up.id > ? order by up.id desc limit 200';
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

//import user_story_like
var importUserStoryLike = function(properties) {
      var sql = 'select a.*,b.fullname,b.pic_url from tbl_user_story_like a, tbl_user b where b.id = a.friend_id and a.id > ? order by a.id desc limit 200 ';
      var args = [ properties.user_story_like_id];

      logger.info(sql, args);
      pool.query(sql, args, function(err, data) {
        if (err) {
          console.dir(err);
        } else {
          var row;
          for(var i in data) {
            row = data[i];

            importUserStoryLikeRow(row);
          }
          properties.user_story_like_id = row.id;
          writeProperties(properties);
        }
      });
};

//import user_story_translate
var importUserStoryTranslate = function(properties) {
      var sql = 'select a.*,b.fullname,b.pic_url from tbl_user_story_translate a left join tbl_user b on b.id = a.user_id where a.id > ? order by a.id desc limit 200 ';
      var args = [ properties.user_story_translate_id];

      logger.info(sql, args);
      pool.query(sql, args, function(err, data) {
        if (err) {
          console.dir(err);
        } else {
          var row;
          for(var i in data) {
            row = data[i];

            importUserStoryTranslateRow(row);
          }
          properties.user_story_translate_id = row.id;
          writeProperties(properties);
        }
      });
};

// var mysql = require('mysql');
// var pool = mysql.createPool(config.mysql.ttt);
var properties = {
  user_photo_id : 0,
  user_story_like_id : 0,
  user_story_translate_id : 0
};
try {
  var data = fs.readFileSync(config.properties.file);
  _.assign(properties, JSON.parse(data));
  logger.info(properties);

} catch (err) {
  logger.info(err);
}

// tbl_user_photo
//importUserPhoto(properties);
//tbl_user_story_like
//importUserStoryLike(properties);
// tbl_user_story_translate
//importUserStoryTranslate(properties);
