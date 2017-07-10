var express = require('express');
var router = express.Router();
var http=require("http");
//var cookie = require('cookie');
var log_model = require('./log_model');
var cwpay_model = require('./cwpay_model');
//引入数据模块
var mongoose=require('./conn');
//数据库中的Schema，为数据库对象的集合，一个用户一般对应一个schema。
var stockplanSchema=new mongoose.Schema({
    docscode:String,
    docstime:String,
    docssum:String,
    docsremark:String
});

//建立查询用的模型
var stockplan_model=mongoose.model('stockplan',stockplanSchema,'stockplan');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//得到所有信息列表
router.get('/getPlans', function(req, res, next) {
    stockplan_model.find({},function(err,datas){
        if(!err){
            res.send(datas);
        }
    }).sort({"sortno":1});
});

//得到日志
router.get("/getAllLog",function(req,res){
    // 1、获取参数
    // 2、处理请求
    log_model.find({},function(err, datas){
        // 3、返回
        res.send(datas);
    });
});


//订单新增
router.post('/add', function(req, res, next) {

    var newLog = new log_model();
    newLog.user = req.cookies.username;
    //console.log("user",newLog.user);
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    //newLog.ip=req.ip;
    newLog.ip=req.socket.remoteAddress.substring(7);
    newLog.action='进货新增';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );

    newLog.save();

    //1.接收参数
    var docscode = req.body.docscode;
    var docstime =req.body.docstime;
    var docssum = req.body.docssum;
    var docsremark = req.body.docsremark;
    //console.log("1",typename);
    //2.处理请求
    var newPlan =  new stockplan_model();
    newPlan.docscode = docscode;
    newPlan.docstime = docstime;
    newPlan.docssum = docssum;
    newPlan.docsremark = docsremark;
    //3.保存并对处理结果进行返回
    newPlan.save(function(err){
        //console.log(err);
        if(!err){
            //保存成功发送1
            res.send('1');
            //res.redirect("/userlist2.html");
        }else{
            res.send('0');
        }
    });
    console.log("111",docscode,docstime,docssum);

    //付款单据
    var newPay = new cwpay_model();
    newPay.pcode= docscode;
    //console.log("user",newLog.user);
    var d = new Date();
    newPay.pdate= d.toLocaleString(); // 2017/3/26 上午11:11:12
    //newLog.ip=req.ip;
    newPay.punit= docstime;
    newPay.pamount= docssum;
    console.log(newPay.pcode,newPay.pdate,newPay.punit,newPay.pamount);

    newPay.save(function(err){
        console.log(err);
    });
});


//用户删除
router.get('/del', function(req, res, next) {

    var newLog = new log_model();
    newLog.user = req.cookies.username;
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    newLog.ip=req.socket.remoteAddress.substring(7);
    newLog.action='用户删除';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );
    newLog.save();

    //接收前端传来的数据
    var idarr = req.query.ids;
    //console.log(idarr);
    //console.log(id);
    //find查找到的数据不管有多少条，都是数据集合的形式,删除时应该遍历逐条删除
    idarr.forEach(function(obj,i){
        //console.log("11",obj[i]);
        stockplan_model.find({'_id':obj},function(err,datas){
            //console.log(datas);
            //如果无误且查找到的数据集合长度大于0，则遍历执行删除
            if(!err && datas.length>0){
                datas.forEach(function(obj,index){
                    console.log(obj);
                    obj.remove(function(err){
                        //删除成功返回1

                    });
                });
            }
        });
    });
    res.send('1');
});

//得到一条用户信息
router.get('/getoneuser', function(req, res, next) {


    var newLog = new log_model();
    newLog.user = req.cookies.username;
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    newLog.ip=req.ip;
    newLog.action='用户编辑';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );

    newLog.save();

    //获取参数
    var id = req.query.id;
    console.log(id);
    stockplan_model.findById(id,function(err,data){
        if(!err){
            res.send(data);
            //console.log('data:',data);
        }
    });
});

//用户编辑
router.post('/edit', function(req, res, next) {
    var newLog = new log_model();
    newLog.user = req.cookies.username;
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    newLog.ip=req.socket.remoteAddress.substring(7);
    newLog.action='用户删除';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );
    newLog.save();

    //1.接收参数
    var id=req.body.id;
    var docscode = req.body.docscode;
    var docstime = req.body.docstime;
    var docssum = req.body.docssum;
    var docsremark = req.body.docsremark;

    //console.log("选中的id",id);
    //2.处理请求
    stockplan_model.findById(id,function(err,datas){
        if(datas){
            datas._id=id;
            datas.docscode = docscode;
            datas.docstime = docstime;
            datas.docssum = docssum;
            datas.docsremark = docsremark;
            datas.save(function(err,datas){
                if(!err){
                    res.send("1");
                }else{
                    res.send("0");
                }
            });
        }
    });

});

//分页展示数据
router.get("/getdepart",function(req,res){
    // 1、获取
    //pageSize 每页显示的数据
    var pageSize = 5;
    //currentPage  获取当前页码
    var currentPage = req.query.currentPage?parseInt(req.query.currentPage) : 1;
    // 2、处理
    stockplan_model.find({},function(err, datas){
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
        stockplan_model.find({},function(err, datas){

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

