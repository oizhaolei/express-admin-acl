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
var importChannelRow = function(channel){
  var Channel = require('../models/channel');
  Channel.findOne({ 'mysql_id' :  channel.id }, function(err, channel_check) {
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

var importChannelTitleTranslateRow = function(channelTitleTranslate){
  var Channel = require('../models/channel');
      Channel.findOne({ 'mysql_id' :  channelTitleTranslate.channel_id }, function(err, channel) {
      // In case of any error, return using the done method
      if (err){
        console.dir(err);
        return;
      }
      var newChannelTitleTranslate = new Channel().title_children;
  
      newChannelTitleTranslate.mysql_id = channelTitleTranslate.id;
      newChannelTitleTranslate.lang = channelTitleTranslate.lang;
      newChannelTitleTranslate.title = channelTitleTranslate.title;
      newChannelTitleTranslate.create_date = channelTitleTranslate.create_date;
      // save the user
      Channel.update({mysql_id : channelTitleTranslate.channel_id}, { $push: { title_children : newChannelTitleTranslate } }, function(err) {
        if (err){
          logger.info('Error in Saving channel title translate: ' + err);
          throw err;
        }
        logger.info('ChannelTitleTranslate Registration succesful ' , (++counter), channelTitleTranslate);
      });
   });
};

var importChannelFollowerRow = function(channelFollower){
    var Channel = require('../models/channel');
        Channel.findOne({ 'mysql_id' :  channelFollower.channel_id }, function(err, channel) {
    // In case of any error, return using the done method
    if (err){
      console.dir(err);
      return;
    }
    var newChannelFollowere = new Channel().follower_children;

    newChannelFollowere.mysql_id = channelFollower.id;
    newChannelFollowere.user_id = channelFollower.user_id;
    newChannelFollowere.pic_url = channelFollower.pic_url;
    newChannelFollowere.fullname = channelFollower.fullname;
    newChannelFollowere.create_date = channelFollower.create_date;
    // save the user
    Channel.update({mysql_id : channelFollower.channel_id}, { $push: { follower_children : newChannelFollowere } }, function(err) {
      if (err){
        logger.info('Error in Saving channel title translate: ' + err);
        throw err;
      }
      logger.info('ChannelFollower Registration succesful ' , (++counter), channelFollower);
    });
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

//import channel_title_translate
var importChannelTitleTranslate = function(properties) {
  var sql = 'select * from tbl_channel_title_translate where id > ? order by id limit 100 ';
  var args = [ properties.channel_title_translate_id];

  logger.info(sql, args);
  pool.query(sql, args, function(err, data) {
    if (err) {
      console.dir(err);
    } else {
      var row;
      for(var i in data) {
        row = data[i];

        importChannelTitleTranslateRow(row);
      }
      properties.channel_title_translate_id = row.id;
      writeProperties(properties);
    }
  });
};

//import channel_follower
var importChannelFollower = function(properties) {
var sql = 'select a.*,b.fullname,b.pic_url from tbl_channel_follower a, tbl_user b where b.id = a.user_id and a.id > ? order by a.id limit 100 ';
var args = [ properties.channel_follower_id];

logger.info(sql, args);
pool.query(sql, args, function(err, data) {
  if (err) {
    console.dir(err);
  } else {
    var row;
    for(var i in data) {
      row = data[i];

      importChannelFollowerRow(row);
    }
    properties.channel_follower_id = row.id;
    writeProperties(properties);
  }
});
};


// var mysql = require('mysql');
// var pool = mysql.createPool(config.mysql.ttt);
var properties = {
    channel_id : 0,
    channel_title_translate_id : 0,
    channel_follower_id : 0
  };
try {
  var data = fs.readFileSync(config.properties.file);
  _.assign(properties, JSON.parse(data));
  logger.info(properties);

} catch (err) {
  logger.info(err);
}

// tbl_channel
//importChannel(properties);
// tbl_channel_title_translate
//importChannelTitleTranslate(properties);
// tbl_channel_follower
//importChannelFollower(properties);
