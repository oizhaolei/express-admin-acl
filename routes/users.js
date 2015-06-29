exports.name = 'user';

exports.show = function(req, res, next){
  var id = req.params.user_id;
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
