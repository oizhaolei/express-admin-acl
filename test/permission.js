"use strict";
var config = require('../config.json');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(config.mongodb.url);

var counter = 0;
var Permission = require('../models/permission');

var data = [
  'view',
  'edit',
  'delete'
];

for(var i in data) {
  var permission = data[i];
  var newPermission = new Permission();
  newPermission.permission = permission;

  // save the permission
  newPermission.save(function(err) {
    if (err){
      console.log('Error in Saving permission: '+err);
      throw err;
    }
    console.log('Permission Registration succesful ' + (++counter));
  });
}
