exports.name = 'role';

exports.authorization = true;

exports.show = function(req, res, next){
  var id = req.params.role_id;
  console.log(id);
  res.render('role', {
    section: 'roles',
    role_id: id
  });
};

exports.list = function(req, res){

  console.log("roles.list");
  res.render('roles', {
    section: 'roles'
  });
};
