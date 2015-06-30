exports.name = 'permission';

exports.authorization = true;

exports.show = function(req, res, next){
  var id = req.params.permission_id;
  console.log(id);
  res.render('permission', {
    section: 'permissions',
    permission_id: id
  });
};

exports.list = function(req, res){

  console.log("permissions.list");
  res.render('permissions', {
    section: 'permissions'
  });
};
