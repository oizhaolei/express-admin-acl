exports.name = 'upload';

exports.authorization = true;

exports.index = function(req, res){
  console.log("upload");

  res.render('upload');
};
