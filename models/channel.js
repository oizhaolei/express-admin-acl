
var mongoose = require('mongoose');

var ChannelSchema = new mongoose.Schema ({
  mysql_id : Number,
  pic_url : String,
  follower_count : Number,
  popular_count : Number,
  category : String,
  recommend : Number,
  old_channel_id : Number,
  create_id : String,
  create_date : Date
});
module.exports = mongoose.model('Channel', ChannelSchema);
