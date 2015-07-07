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

var importUserStoryLikeRow = function(userStoryLike){
	var UserPhoto = require('../models/user_photo');
  var newUserStoryLike = new UserPhoto();

  newUserStoryLike.mysql_id = userStoryLike.id;
  newUserStoryLike.user_id = userStoryLike.friend_id;
  newUserStoryLike.pic_url = userStoryLike.pic_url;
  newUserStoryLike.fullname = userStoryLike.fullname;
  newUserStoryLike.create_date = userStoryLike.create_date;
  // save the user
  UserPhoto.update({mysql_id : userStoryLike.user_photo_id}, { $push: { like_children : newUserStoryLike } }, function(err) {
    if (err){
      logger.info('Error in Saving user story like: ' + err);
      throw err;
    }
    logger.info('UserStoryLike Registration succesful ' , (++counter), userStoryLike);
  });
};

var importChannelRow = function(channel){
  var Channel = require('../models/channel');
  Channel.findOne({ 'old_id' :  channel.id }, function(err, channel_check) {
    if (err){
      console.dir(err);
      return;
    }
    if (channel_check) {
      logger.info('Channel already exists with id: '+channel_check.id);
    } else {
      var newChannel = new Channel();

      newChannel.mysql_id = channel.id;
      newChannel.pic_url = channel.pic_url;
      newChannel.follower_count = channel.follower_count;
      newChannel.popular_count = channel.popular_count;
      newChannel.category = channel.category;
      newChannel.recommend = channel.recommend;
      newChannel.old_channel_id = channel.old_channel_id;
      newChannel.create_id = channel.create_id;
      newChannel.create_date = channel.create_date;
      // save the user
      newChannel.save(function(err) {
        if (err){
          logger.info('Error in Saving Channel: '+err);
          throw err;
        }
        logger.info('Channel Registration succesful ' , (++counter), channel);
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
    user_photo_id : 0,
    user_story_like_id : 0,
    channel_id : 0
  };
}

//import user_photo
var importUserPhoto = function(properties) {
  var sql = 'select up.*, u.fullname, u.pic_url user_pic from tbl_user_photo up left join tbl_user u on up.userid=u.id where up.id > ? order by up.id limit 100';
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

//import channel
var importChannel = function(properties) {
	var sql = 'select * from tbl_channel where id > ? order by id limit 100 ';
	var args = [ properties.channel_id];
	
	logger.info(sql, args);
	pool.query(sql, args, function(err, data) {
	  if (err) {
	    console.dir(err);
	  } else {
	    var row;
	    for(var i in data) {
	      row = data[i];
	
	      importChannelRow(row);
	    }
	    properties.channel_id = row.id;
	    writeProperties(properties);
	  }
	});
};

//import user_story_like
var importUserStoryLike = function(properties) {
var sql = 'select a.*,b.fullname,b.pic_url from tbl_user_story_like a, tbl_user b where b.id = a.friend_id and a.id > ? order by a.id limit 10 ';
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


// tbl_user_photo
//importUserPhoto(properties);
// tbl_user_story_like
importUserStoryLike(properties);
// tbl_user_story_translate
// tbl_user_story_translate_like
// tbl_channel
//importChannel(properties);
// tbl_channel_title_translate
// tbl_channel_follower
