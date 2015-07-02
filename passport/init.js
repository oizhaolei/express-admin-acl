var logger = require('log4js').getLogger('passport/init.js');

var login = require('./login');
var signup = require('./signup');
var User = require('../models/user');

module.exports = function(passport){

  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    logger.info('serializing user: ');
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      logger.info('deserializing user:', id);
      done(err, user);
    });
  });

  // Setting up Passport Strategies for Login and SignUp/Registration
  login(passport);
  signup(passport);

};
