
var mongoose = require('mongoose');

module.exports = mongoose.model('Role',{
  id: String,
  rolename: String
});
