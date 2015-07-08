exports.name = 'profile';

exports.authorization = true;

exports.index = function(req, res){
  console.log("profile");

  res.render('profile');
};
