exports.name = 'user';

exports.authorization = true;

exports.show = function(req, res, next){
  var id = req.params.user_id;
  console.log(id);
  res.render('user', {
    section: 'users',
    user_id: id
  });
};

exports.list = function(req, res){

  console.log("users.list");
  res.render('users', {
    section: 'users'
  });
};
