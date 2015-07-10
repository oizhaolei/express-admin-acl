"use strict";
/**
 * Module dependencies.
 */
var logger = require('log4js').getLogger('api/uploads.js');
var config = require('../config.json');

var fs = require("fs");
var formidable = require("formidable");

var oss = require('../lib/oss');
var md5 = require('MD5');

exports.name = 'upload';

exports.authorization = true;

exports.create = function(req, res, next){
  logger.info('uploads.create');
  var form = new formidable.IncomingForm();
  form.parse(req, function(error, fields, files) {
    logger.info(files.file.path);
    if (typeof (files.file) != "undefined" && typeof (files.file.path) != "undefined") {
      fs.readFile(files.file.path, function(err, buf) {
        var filename = md5(buf);
        oss.putObjectCallback(files.file.path, config.aliyun.oss.originalPrefix + filename, 'image/jpeg', 0);
        res.json({
            filename : filename
        });
      });
    }else{
      logger.error(error);
    }
  });
};
