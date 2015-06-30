"use strict";
var config = require('../config.json');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(config.mongodb.url);

var counter = 0;
var Resource = require('../models/resource');

var data = [{"text" : "频道一览",
"resource" : "channel_list.php"},
{"text" : "礼物一览",
"resource" : "present_list.php"},
{"text" : "测试者一览",
"resource" : "exam_agent_emp_list.php"},
{"text" : "试题管理",
"resource" : "agent_exam_question_list.php"},
{"text" : "收支明细",
"resource" : "fee_recharge.php"},
{"text" : "收支日别统计",
"resource" : "fee_daily_balance.php"},
{"text" : "收支月别统计",
"resource" : "fee_monthly_balance.php"},
{"text" : "文本日别数量统计",
"resource" : "daily_message.php"},
{"text" : "文本数量统计Chart",
"resource" : "message_statistics.php"},
{"text" : "用户统计Chart",
"resource" : "user_statistics.php"},
{"text" : "翻译者一览",
"resource" : "agent_employee_list.php"},
{"text" : "日程一览",
"resource" : "agent_work_schedule.php"},
{"text" : "请款管理",
"resource" : "pay_list.php"},
{"text" : "纠错管理",
"resource" : "revise_message_list.php"},
{"text" : "兑换管理",
"resource" : "exchange_list.php"},
{"text" : "兑换履历",
"resource" : "exchange_history_list.php"},
{"text" : "公告",
"resource" : "translator_announcement.php"},
{"text" : "提问",
"resource" : "translator_qa.php"},
{"text" : "翻译者协议",
"resource" : "translator_agreement.php"},
{"text" : "翻译者积分排名",
"resource" : "translate_balance_rank.php"},
{"text" : "用户一览",
"resource" : "user_list.php"},
{"text" : "未回复用户一览",
"resource" : "no_reply_user_list.php"},
{"text" : "用户分析",
"resource" : "user_analysis.php"},
{"text" : "用户请求校验",
"resource" : "message_review.php"},
{"text" : "公告",
"resource" : "user_announcement.php"},
{"text" : "提问",
"resource" : "user_qa.php"},
{"text" : "用户协议",
"resource" : "user_agreement.php"},
{"text" : "贴图",
"resource" : "user_photo_list.php"}
];

for(var i in data) {
  var resource = data[i];
  var newResource = new Resource();
  newResource.resource = resource.resource;
  newResource.text = resource.text;

  // save the resource
  newResource.save(function(err) {
    if (err){
      console.log('Error in Saving resource: '+err);
      throw err;
    }
    console.log('Resource Registration succesful ' + (++counter));
  });
}
