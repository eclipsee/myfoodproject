var express = require('express');
var router = express.Router();
var log_model = require('./log_model');
var cookie = require('cookie');
//引入数据模块
var mongoose=require('./conn');
//数据库中的Schema，为数据库对象的集合，一个用户一般对应一个schema。
var foosclassSchema=new mongoose.Schema({
    typename:String,  //单位名称
    isuse:String,   //单位地址
    goodstype:String,  //联系人
    sortno:String,  //联系电话
});

//建立查询用的模型
var foodclass_model=mongoose.model('foodclass',foosclassSchema,'foodclass');


/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
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

//得到食物类型列表
router.get('/getClasses', function(req, res, next) {
    foodclass_model.find({},function(err,datas){
        if(!err){
            //console.log(datas);
            res.send(datas);
        }
    });
});

//食物类型新增
router.post('/class_add', function(req, res, next) {

    var newLog = new log_model();
    newLog.user = req.cookies.username;
    //console.log("user",newLog.user);
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    //newLog.ip=req.ip;
    newLog.ip=req.socket.remoteAddress.substring(7);
    newLog.action='食物种类新增';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );

    newLog.save();


    //1.接收参数
    var typename = req.body.typename;
    var isuse = parseInt(req.body.isuse);
    var goodstype = req.body.goodstype;
    var sortno = parseInt(req.body.sortno);
    //console.log("1",typename);
    //2.处理请求
    var newClass =  new foodclass_model();
    newClass.typename = typename;
    newClass.isuse = isuse;
    newClass.goodstype = goodstype;
    newClass.sortno = sortno;
//3.保存并对处理结果进行返回
    newClass.save(function(err){
        //console.log(err);
        if(!err){
            //保存成功发送1
            res.send('1');
            //res.redirect("/userlist2.html");
        }else{
            res.send('0');
        }
    });
});

//食物类型删除
router.get('/class_del', function(req, res, next) {

    var newLog = new log_model();
    newLog.user = req.cookies.username;
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    newLog.ip=req.socket.remoteAddress.substring(7);
    newLog.action='食物种类删除';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );
    newLog.save();

    //接收前端传来的数据
    var idarr = req.query.ids;
    console.log(idarr);
    //console.log(id);
    //find查找到的数据不管有多少条，都是数据集合的形式,删除时应该遍历逐条删除
    idarr.forEach(function(obj,i){
        //console.log("11",obj[i]);
        foodclass_model.find({'_id':obj},function(err,datas){
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


//食物类型编辑
router.get('/getoneclass', function(req, res, next) {
    var newLog = new log_model();
    newLog.user = req.cookies.username;
    //console.log("user",newLog.user);
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    //newLog.ip=req.ip;
    newLog.ip=req.socket.remoteAddress.substring(7);
    newLog.action='食物种类编辑';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );

    newLog.save();
    //获取参数
    var id = req.query.id;
    //console.log(id);
    foodclass_model.findById(id,function(err,data){
        if(!err){
            res.send(data);
            //console.log('data:',data);
        }
    });
});



//食物类型编辑
router.post('/class_edit', function(req, res, next) {
    //1.接收参数
    var id=req.body.id;
    var typename = req.body.typename;
    var isuse = parseInt(req.body.isuse);
    var goodstype = req.body.goodstype;
    var sortno = parseInt(req.body.sortno);
    //console.log('111111111112222333');
    //console.log(uname,bcode,uaddress,ucontact,uphone,usortno);
    //2.处理请求

    foodclass_model.findById(id,function(err,datas){
        if(datas){
            datas._id=id;
            datas.typename = typename;
            datas.isuse = isuse;
            datas.goodstype = goodstype;
            datas.sortno = sortno;
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
    foodclass_model.find({},function(err, datas){
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
        foodclass_model.find({},function(err, datas){

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
