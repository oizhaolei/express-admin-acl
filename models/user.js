
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
  id: String,
  old_id: String,
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String,
  portrait: String
});
