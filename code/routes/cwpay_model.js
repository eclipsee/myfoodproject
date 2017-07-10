var express = require('express');
var router = express.Router();
//var cookie = require('cookie');
//引入数据模块
var mongoose=require('./conn');

//建立日志模型
var cwpaySchema = new mongoose.Schema({
    pcode:String,
    pdate:String,
    punit:String,
    pamount:String
});

var cwpay_model = mongoose.model('cwpay',cwpaySchema,'cwpay');

module.exports = cwpay_model;
