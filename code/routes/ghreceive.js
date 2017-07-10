var express = require('express');
var router = express.Router();
var http=require("http");
//var cookie = require('cookie');
var log_model = require('./log_model');
var cwreceive_model = require('./cwreceive_model');
//引入数据模块
var mongoose=require('./conn');
//数据库中的Schema，为数据库对象的集合，一个用户一般对应一个schema。
var ghreceiveSchema=new mongoose.Schema({
    renum:String,
    recode:String,
    reunit:String,
    rebuyunit:String,
    reamount:String
});
//建立查询用的模型
var ghreceive_model=mongoose.model('ghreceive',ghreceiveSchema,'ghreceive');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//得到入库信息列表
router.get('/getUsers', function(req, res, next) {
    ghreceive_model.find({},function(err,datas){
        if(!err){
            res.send(datas);
        }
    });
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

//送货单新增
router.post('/add', function(req, res, next) {

    var newLog = new log_model();
    newLog.user = req.cookies.username;
    //console.log("user",newLog.user);
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    //newLog.ip=req.ip;
    newLog.ip=req.socket.remoteAddress.substring(7);
    newLog.action='收款单新增';
    console.log(newLog.user, newLog.time, newLog.ip, newLog.action );

    newLog.save();


    //1.接收参数
    var renum = req.body.renum;
    var recode = req.body.recode;
    var reunit = req.body.reunit;
    var rebuyunit = req.body.rebuyunit;
    var reamount = req.body.reamount;

    //console.log(username);
    //2.处理请求
    var newReceive =  new ghreceive_model();
    newReceive.renum = renum;
    newReceive.recode = recode;
    newReceive.reunit = reunit;
    newReceive.rebuyunit = rebuyunit;
    newReceive.reamount = reamount;
    console.log(2222222222);
//3.保存并对处理结果进行返回
    newReceive.save(function(err){
        console.log(err);
        if(!err){
            //保存成功发送1
            res.send('1');
            //res.redirect("/userlist2.html");
        }else{
            res.send('0');
        }
    });
    console.log("333",recode,reunit,reamount);

    //收款单据
    var newCwreceive = new cwreceive_model();
    newCwreceive.recode= recode;
    //console.log("user",newLog.user);
    var d = new Date();
    newCwreceive.redate = d.toLocaleString(); // 2017/3/26 上午11:11:12
    //newLog.ip=req.ip;
    newCwreceive.resupplier = reunit;
    newCwreceive.reamount = reamount ;
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );

    newCwreceive.save();
});


//送货单删除
router.get('/del', function(req, res, next) {

    var newLog = new log_model();
    newLog.user = req.cookies.username;
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    newLog.ip=req.socket.remoteAddress.substring(7);
    newLog.action='收款单删除';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );
    newLog.save();

    //接收前端传来的数据
    var idarr = req.query.ids;
    console.log(idarr);
    //console.log(id);
    //find查找到的数据不管有多少条，都是数据集合的形式,删除时应该遍历逐条删除
    idarr.forEach(function(obj,i){
        //console.log("11",obj[i]);
        ghreceive_model.find({'_id':obj},function(err,datas){
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
router.get('/getone', function(req, res, next) {


    var newLog = new log_model();
    newLog.user = req.cookies.username;
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    newLog.ip=req.ip;
    newLog.action='送货单编辑';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );

    newLog.save();

    //获取参数
    var id = req.query.id;
    console.log(id);
    ghreceive_model.findById(id,function(err,data){
        if(!err){
            res.send(data);
            //console.log('data:',data);
        }
    });
});

//送货单编辑
router.post('/edit', function(req, res, next) {
    var newLog = new log_model();
    newLog.user = req.cookies.username;
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    newLog.ip=req.socket.remoteAddress.substring(7);
    newLog.action='送货单编辑';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );
    newLog.save();

    //1.接收参数
    var id=req.body.id;
    var renum = req.body.renum;
    var recode = req.body.recode;
    var reunit = req.body.reunit;
    var rebuyunit = req.body.rebuyunit;
    var reamount = req.body.reamount;

    //console.log("选中的id",id);
    //2.处理请求
    ghreceive_model.findById(id,function(err,datas){
        if(datas){
            datas._id=id;
            datas.renum = renum;
            datas.recode = recode;
            datas.reunit = reunit;
            datas.rebuyunit = rebuyunit;
            datas.reamount = reamount;
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
    ghreceive_model.find({},function(err, datas){
        //totalCount  数据总条数
        console.log(datas);
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
        ghreceive_model.find({},function(err, datas){

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

