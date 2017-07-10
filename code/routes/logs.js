var express = require('express');
var router = express.Router();
var http=require("http");
//var cookie = require('cookie');
var log_model = require('./log_model');
//引入数据模块
var mongoose=require('./conn');
//数据库中的Schema，为数据库对象的集合，一个用户一般对应一个schema。

router.get('/', function(req, res, next) {
    res.render('logs', { title: 'Express' });
});

//得到日志
router.get("/getAllLog",function(req,res){
    // 1、获取
    // 2、处理
    log_model.find({},function(err, datas){
        // 3、返回
        res.send(datas);
    });
});

router.get("/getLogs",function(req,res){
    // 1、获取
    //pageSize 每页显示的数据
    var pageSize = 10;
    //currentPage  获取当前页码
    var currentPage = req.query.currentPage?parseInt(req.query.currentPage) : 1;
    // 2、处理
    log_model.find({},function(err, datas){
        //totalCount  数据总条数
        var totalCount = datas.length;
        // totalPage  总页数 向上取整
        var totalPage = Math.ceil(totalCount/pageSize);
        //start 查询数据时跳过查询的起始位置
        /*
         *   start    (currentPage-1)*5
         *
         *     第一页 ： 0    (1-1)*5
         *     第二页 :  5    (2-1)*5
         *    第三页 :  10   (3-1)*5
         *    第四页 :  15   (4-1)*5
         * */
        var start = (currentPage-1) * pageSize;
        log_model.find({},function(err, datas){

            // 封装结果数据
            var result = {
                'list' :datas,
                'start' : start+1,
                'end' : Math.min(start + pageSize,totalCount),
                'totalCount':totalCount,
                'totalPage':totalPage,
                'currentPage':currentPage
            }

            // 3、返回
            res.send(result);
        }).limit(pageSize).skip(start);
    })
});
module.exports = router;


