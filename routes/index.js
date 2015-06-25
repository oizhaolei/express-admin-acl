// Load Routes
var routes = {
  //api: importRoutes('./api'),
  download: {
    users : require('./download/users')
  },
  views: {
    index : require('./views/index'),
    blog : require('./views/blog'),
    post : require('./views/post'),
    gallery : require('./views/gallery'),
    contact : require('./views/contact')
  }
};


module.exports = function(app, options){
  var verbose = options.verbose;

    // Views
  app.get('/', routes.views.index);
  app.get('/blog/:category?', routes.views.blog);
  app.all('/blog/post/:post', routes.views.post);
  app.get('/gallery', routes.views.gallery);
  app.all('/contact', routes.views.contact);

  // Downloads
  app.get('/download/users', routes.download.users);
};
