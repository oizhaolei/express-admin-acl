/**
 * Module dependencies.
 */
var config = require('../config.json');

var logger = require('log4js').getLogger('role-users.js');
var User = require('../models/user');
var Acl = require("acl");
var MongoClient = require('mongodb').MongoClient;

exports.name = 'user';
exports.prefix = '/roles/:role_id';

exports.list = function(req, res, next){
  var role_id = req.params.role_id;
  logger.info('role-users.list');
  MongoClient.connect(config.mongodb.url, function(err, db) {
    var backend = new Acl.mongodbBackend(db, "acl");
    var acl = new Acl(backend);
    acl.roleUsers(role_id, function(err, myUsers) {
      db.close();

      User.find({
        '_id': { $in: myUsers}
      }).exec(function(err, results) {
        var users = {
          data : results
        };
        logger.info(users);
        res.json(users);
      });
    });
  });
};


exports.del = function(req, res, next){
  var role_id = req.params.role_id;
  var user_id = req.params.user_id;
  logger.info('role-users.delete', role_id, user_id);
  MongoClient.connect(config.mongodb.url, function(err, db) {
    var backend = new Acl.mongodbBackend(db, "acl");
    var acl = new Acl(backend);
    acl.removeUserRoles(user_id, role_id, function(err) {
      db.close();
      res.json({success : true});
    });
  });
};

exports.create = function(req, res, next){
  var role_id = req.params.role_id;
  var user_id = req.body.user_id;
  logger.info('role-users.create', role_id, user_id);
  MongoClient.connect(config.mongodb.url, function(err, db) {
    var backend = new Acl.mongodbBackend(db, "acl");
    var acl = new Acl(backend);
    acl.addUserRoles(user_id, role_id, function(err) {
      db.close();
      res.json({success : true});
    });
  });
};
