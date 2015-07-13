
var mongoose = require('mongoose');

var UserPhotoCommentSchema = new mongoose.Schema ({
    mysql_id : Number,
    user_id : Number,
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
    create_date : Date,
    comment_translate_children : {
      mysql_id : Number,
      user_id : Number,
      pic_url : String,
      fullname : String,
      lang : String,
      content : String,
      create_date : Date
    }
});
exports.UserPhotoCommentSchema=UserPhotoCommentSchema;
mongoose.model('UserPhotoComment', UserPhotoCommentSchema);
