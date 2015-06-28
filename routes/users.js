exports.name = 'user';

exports.list = function(req, res){

  console.log("users.list");
  res.render('users', {
    section: 'users'
  });
};
