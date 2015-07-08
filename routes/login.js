exports.name = 'login';

exports.authorization = true;

exports.index = function(req, res){
  console.log("login");
    res.render('login', {
      message: req.flash('message'),
      url : req.query.url
    });
};
