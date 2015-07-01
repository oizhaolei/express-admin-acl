/**
 * Module dependencies.
 */
var logger = require('log4js').getLogger('user-roles');

exports.name = 'role';
exports.prefix = '/users/:user_id';

exports.list = function(req, res, next){
  var id = req.params.user_id;
  logger.info('user-roles.list');
  res.json({
    selected : ["55922cb7419d122072c14cb7"],
    roles : [{"_id":"55922cb7419d122072c14cb9","rolename":"assistant store admin","__v":0},{"_id":"55922cb7419d122072c14cb7","rolename":"super admin","__v":0},{"_id":"55922cb7419d122072c14cb8","rolename":"store admin","__v":0}]
  });
};

exports.create = function(req, res, next){
  //todo
  logger.info('user-roles.create');
};
