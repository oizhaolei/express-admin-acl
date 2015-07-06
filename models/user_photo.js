
var mongoose = require('mongoose');

module.exports = mongoose.model('UserPhoto',{
 mysql_id : Number,
 parent_id : Number,
 user_id : Number,
 channel_id : Number,
 pic_url : String,
 content : String,
 lang : String,
 address : String,
 late6 : Number,
 lnge6 : Number,
 width : Number,
 height : Number,
 category : String,
 good : Number,
 present_count : Number,
 comment : Number,
 chosen : Number,
 create_id : String,
 create_date : Date
});
