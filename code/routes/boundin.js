var express = require('express');
var router = express.Router();
var http=require("http");
//var cookie = require('cookie');
var log_model = require('./log_model');
//引入数据模块
var mongoose=require('./conn');
//数据库中的Schema，为数据库对象的集合，一个用户一般对应一个schema。
var boundinSchema=new mongoose.Schema({
    unitname:String,
    snumber:String,
    sperson:String,
    yperson:String,
    bperson:String,
    sremark:String
});
//建立查询用的模型
var boundin_model=mongoose.model('storage',boundinSchema,'storage');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//得到入库信息列表
router.get('/getUsers', function(req, res, next) {
    boundin_model.find({},function(err,datas){
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

//入库信息新增
router.post('/add', function(req, res, next) {

    var newLog = new log_model();
    newLog.user = req.cookies.username;
    //console.log("user",newLog.user);
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    //newLog.ip=req.ip;
    newLog.ip=req.socket.remoteAddress.substring(7);
    newLog.action='用户新增';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );

    newLog.save();


    //1.接收参数
    var unitname = req.body.unitname;
    var snumber = req.body.snumber;
    var sperson = req.body.sperson;
    var yperson = req.body.yperson;
    var bperson = req.body.bperson;
    var sremark = req.body.sremark;

    //console.log(username);
    //2.处理请求
    var newStorage =  new boundin_model();
    newStorage.unitname = unitname;
    newStorage.snumber = snumber;
    newStorage.sperson = sperson;
    newStorage.yperson = yperson;
    newStorage.bperson = bperson;
    newStorage.sremark = sremark;
    //console.log(2222222222);
//3.保存并对处理结果进行返回
    newStorage.save(function(err){
        console.log(err);
        if(!err){
            //保存成功发送1
            res.send('1');
            //res.redirect("/userlist2.html");
        }else{
            res.send('0');
        }
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
    console.log(idarr);
    //console.log(id);
    //find查找到的数据不管有多少条，都是数据集合的形式,删除时应该遍历逐条删除
    idarr.forEach(function(obj,i){
        //console.log("11",obj[i]);
        boundin_model.find({'_id':obj},function(err,datas){
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
    newLog.action='用户编辑';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );

    newLog.save();

    //获取参数
    var id = req.query.id;
    console.log(id);
    boundin_model.findById(id,function(err,data){
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
    var unitname = req.body.unitname;
    var snumber = req.body.snumber;
    var sperson = req.body.sperson;
    var yperson = req.body.yperson;
    var bperson = req.body.bperson;
    var sremark = req.body.sremark;

    console.log("选中的id",id);
    //2.处理请求
    boundin_model.findById(id,function(err,datas){
        if(datas){
            datas._id=id;
            datas.unitname = unitname;
            datas.snumber = snumber;
            datas.sperson = sperson;
            datas.yperson = yperson;
            datas.bperson = bperson;
            datas.sremark = sremark;
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
    boundin_model.find({},function(err, datas){
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
        boundin_model.find({},function(err, datas){

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

