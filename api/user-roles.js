/**
 * Module dependencies.
 */
var config = require('../config.json');

var logger = require('log4js').getLogger('user-roles.js');
var Role = require('../models/role');
var Acl = require("acl");
var MongoClient = require('mongodb').MongoClient;

exports.name = 'role';
exports.prefix = '/users/:user_id';

exports.list = function(req, res, next){
  var user_id = req.params.user_id;
  logger.info('user-roles.list');
  MongoClient.connect(config.mongodb.url, function(err, db) {
    var backend = new Acl.mongodbBackend(db, "acl");
    var acl = new Acl(backend);
    acl.userRoles(user_id, function(err, myRoles) {
      db.close();

      Role.find().exec(function(err, results) {
        var roles = {
          selected : myRoles,
          roles : results
        };
        logger.info(roles);
        res.json(roles);
      });
    });
  });
};

exports.create = function(req, res, next){
  logger.info('user-roles.create', req.body.roles);
  var user_id = req.params.user_id;
  MongoClient.connect(config.mongodb.url, function(err, db) {
    var backend = new Acl.mongodbBackend(db, "acl");
    var acl = new Acl(backend);
    acl.userRoles(user_id, function(err, myRoles) {
      acl.removeUserRoles(user_id, myRoles, function(err) {
        acl.addUserRoles(user_id, req.body.roles, function(err) {
          db.close();
          res.json({success : true});
        });
      });

    });
  });
};
