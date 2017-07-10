var express = require('express');
var router = express.Router();
//var cookie = require('cookie');
//引入数据模块
var mongoose=require('./conn');

//建立日志模型
var cwreceiveSchema = new mongoose.Schema({
    recode :String,
    redate :String,
    resupplier :String,
    reamount :String
});

var cwreceive_model = mongoose.model('cwreceive',cwreceiveSchema,'cwreceive');

module.exports = cwreceive_model;
