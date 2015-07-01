/**
 * Module dependencies.
 */
var config = require('../../config.json');

var logger = require('log4js').getLogger('user-roles');
var Role = require('../../models/role');
var Acl = require("acl");
var MongoClient = require('mongodb').MongoClient;

exports.name = 'role';
exports.prefix = '/users/:user_id';

exports.list = function(req, res, next){
  var id = req.params.user_id;
  logger.info('user-roles.list');
  MongoClient.connect(config.mongodb.url, function(err, db) {
    var backend = new Acl.mongodbBackend(db, "acl");
    var acl = new Acl(backend);
    acl.userRoles(id, function(err, myRoles) {
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
  //todo
  logger.info('user-roles.create');
};
