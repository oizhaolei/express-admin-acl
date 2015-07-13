
var mongoose = require('mongoose');
var UserPhotoComment = require('./user_photo_comment');

var UserPhotoSchema = new mongoose.Schema ({
  mysql_id : Number,
  user_id : Number,
  channel_id : Number,
  pic_url : String,
  fullname : String,
  user_pic : String,
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
  create_date : Date,
  children : [UserPhotoComment.UserPhotoCommentSchema],
  like_children : {
    mysql_id : Number,
    user_id : Number,
    pic_url : String,
    fullname : String,
    create_date : Date
  },
  translate_children : {
    mysql_id : Number,
    user_id : Number,
    pic_url : String,
    fullname : String,
    lang : String,
    content : String
});
module.exports = mongoose.model('UserPhoto', UserPhotoSchema);
