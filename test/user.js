"use strict";

var config = require('../config.json');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(config.mongodb.url);

var counter = 0;
var User = require('../models/user');

var findOrCreateUser = function(old_id, username, password, email, firstname, lastname, portrait){
  // find a user in Mongo with provided username
  User.findOne({ 'username' :  username }, function(err, user) {
    // In case of any error, return using the done method
    if (err){
      console.dir(err);
      return;
    }
    // already exists
    if (user) {
      console.log('User already exists with username: '+username);
    } else {
      // if there is no user with that email
      // create the user
      var newUser = new User();

      // set the user's local credentials
      newUser.old_id = old_id;
      newUser.username = username;
      newUser.password = password;
      newUser.email = email;
      newUser.firstName = firstname;
      newUser.lastName = lastname;
      newUser.portrait = portrait;

      // save the user
      newUser.save(function(err) {
        if (err){
          console.log('Error in Saving user: '+err);
          throw err;
        }
        console.log('User Registration succesful ' + (++counter));
      });
    }
  });
};

var mysql = require('mysql');
var pool = mysql.createPool(config.mysql.ttt);
var sql = 'select * from tbl_user limit 200 offset 70000 ';
pool.query(sql, function(err, data) {
  if (err) {
    console.dir(err);
  } else {
    for(var i in data) {
      var row = data[i];

      findOrCreateUser(row.id, row.tel, row.password, '', '', row.fullname, row.pic_url);
    }
  }
  pool.end();
});
