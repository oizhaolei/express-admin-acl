
var mongoose = require('mongoose');

module.exports = mongoose.model('Permission',{
  id: String,
  permission: String
});
