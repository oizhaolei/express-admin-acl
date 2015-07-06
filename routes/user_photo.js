exports.name = 'user_photo';

exports.authorization = true;

exports.show = function(req, res, next){
  var id = req.params.user_photo_id;
  console.log(id);
  res.render('user_photo', {
    section: 'user_photos',
    user_photo_id: id
  });
};

exports.list = function(req, res){

  console.log("user_photos.list");
  res.render('user_photos', {
    section: 'home'
  });
};
