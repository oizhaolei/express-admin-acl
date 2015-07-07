exports.name = 'user_photo';

exports.authorization = false;

exports.show = function(req, res, next){
  var id = req.params.user_photo_id;
  console.log(id);

  res.locals.user_photo_id = id;
  res.render('user_photo');
};

exports.list = function(req, res){

  console.log("user_photos.list");
  res.render('user_photos', {
    section: 'home'
  });
};
