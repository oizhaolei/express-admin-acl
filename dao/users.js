"use strict";
var config = require('../config.json');

var mysql = require('mysql');

function Users() {
  var pool = mysql.createPool(config.mysql.ttt);
  this.pool = pool;
}

Users.prototype = {
  list : function (callback) {
    console.log("list user...");
    var sql = 'select id, tel as name from tbl_user limit 30';
    var args = [ ];

    var query = this.pool.query(sql, args, function(err, data) {
      if (callback) callback(err, data);
    });

  }
};

exports = module.exports = Users;
