
var mongoose = require('mongoose');

module.exports = mongoose.model('Resource', {
  id: String,
  resource: String,
  text: String
});
