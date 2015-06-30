exports.name = 'resource';

exports.authorization = true;

exports.show = function(req, res, next){
  var id = req.params.resource_id;
  console.log(id);
  res.render('resource', {
    section: 'resources',
    resource_id: id
  });
};

exports.list = function(req, res){

  console.log("resources.list");
  res.render('resources', {
    section: 'resources'
  });
};
