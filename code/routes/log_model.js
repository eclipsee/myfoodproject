var express = require('express');
var router = express.Router();
//var cookie = require('cookie');
//引入数据模块
var mongoose=require('./conn');

//建立日志模型
var logSchema = new mongoose.Schema({
    user:String,
    time:String,
    ip:String,
    action:String
});

var log_model = mongoose.model('log',logSchema,'log');

module.exports = log_model;
