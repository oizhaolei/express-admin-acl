/**
 * Module dependencies.
 */
var Users = require("../../dao/users.js");
var usersDao = new Users();

exports.name = 'pet';
exports.prefix = '/users/:user_id';


exports.create = function(req, res, next){
  var id = req.params.user_id;
  var user = usersDao.getUser(id);
  var body = req.body;
  if (!user) return next('route');
  var pet = { name: body.pet.name };

  usersDao.createPet(pet, function(err, id){
    user.pets.push(pet);
    res.message('Added pet ' + body.pet.name);
    res.redirect('/user/' + id);
  });
};
