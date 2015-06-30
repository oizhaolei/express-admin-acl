"use strict";
var config = require('../config.json');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(config.mongodb.url);

var counter = 0;
var Role = require('../models/role');

var data = [
  'super admin',
  'store admin',
  'assistant store admin'
];

for(var i in data) {
  var role = data[i];
  var newRole = new Role();
  newRole.rolename = role;

  // save the role
  newRole.save(function(err) {
    if (err){
      console.log('Error in Saving role: '+err);
      throw err;
    }
    console.log('Role Registration succesful ' + (++counter));
  });
}
