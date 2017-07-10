var express = require('express');
var router = express.Router();
var http=require("http");
//var cookie = require('cookie');
var log_model = require('./log_model');
var cwreceive_model = require('./cwreceive_model');
var cwpay_model = require('./cwpay_model');
//引入数据模块
var mongoose=require('./conn');
//数据库中的Schema，为数据库对象的集合，一个用户一般对应一个schema。
var adminSchema=new mongoose.Schema({
  username:String,
  truename:String,
  role:String,
  department:String,
  sortno:Number,
  isActive:Number,
  status:Number
});
//建立查询用的模型
var user_model=mongoose.model('user',adminSchema,'user');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//得到用户列表
router.get('/getUsers', function(req, res, next) {
  user_model.find({},function(err,datas){
      if(!err){
        res.send(datas);
      }
  }).sort({"sortno":1});
});

//得到收款列表
router.get("/getAllRe",function(req,res){
  // 1、获取参数
  // 2、处理请求
  cwreceive_model.find({},function(err, datas){
    // 3、返回
    res.send(datas);
  });
});

//得到收款列表
router.get("/getAllPay",function(req,res){
  // 1、获取参数
  // 2、处理请求
  cwpay_model.find({},function(err, datas){
    // 3、返回
    res.send(datas);
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


//用户新增
router.post('/user_add', function(req, res, next) {

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
  var username = req.body.username;
  var truename = req.body.truename;
  var role = req.body.role;
  var department = req.body.department;
  var sortno = parseInt(req.body.sortno);
  var isActive = parseInt(req.body.isActive);
  var status = parseInt(req.body.status);
  //console.log('111111111112222333');
  console.log(username);
  //2.处理请求
  var newUser =  new user_model();
  newUser.username = username;
  newUser.truename = truename;
  newUser.role = role;
  newUser.department = department;
  newUser.sortno = sortno;
  newUser.isActive = isActive;
  newUser.status = status;
  //console.log(2222222222);
//3.保存并对处理结果进行返回
  newUser.save(function(err){
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
router.get('/user_del', function(req, res, next) {

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
    user_model.find({'_id':obj},function(err,datas){
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
  user_model.findById(id,function(err,data){
    if(!err){
      res.send(data);
      //console.log('data:',data);
    }
  });
});

//用户编辑
router.post('/user_edit', function(req, res, next) {
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
  var username = req.body.username;
  var truename = req.body.truename;
  var role = req.body.role;
  var department = req.body.department;
  var sortno = parseInt(req.body.sortno);
  var isActive = parseInt(req.body.isActive);
  var status = parseInt(req.body.status);

  console.log("选中的id",id);
  //2.处理请求
  user_model.findById(id,function(err,datas){
      if(datas){
        datas._id=id;
        datas.username = username;
        datas.truename = truename;
        datas.role = role;
        datas.department = department;
        datas.sortno = sortno;
        datas.isActive = isActive;
        datas.status = status;
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

//用户查询 user_search  department,role,username
router.post('/user_search', function(req, res, next) {
  //1.接收前端传送的参数
  var username = req.body.username;
  var department = req.body.department;
  var role = req.body.role;
  //多个条件查询时，可以将这些条件的参数封装在一个对象中
  //判断查询条件的输入框为空时，查询无效
  var param = {};
  if(username != ""){
    param.username = new RegExp(username);
  }
  if(department != "" && department != '全部'){
    param.department = department;
  }
  if(role != "" && role != '全部'){
    param.role = role;
  }
  user_model.find(param,function(err,datas){
    if(!err){
      res.send(datas);
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
  user_model.find({},function(err, datas){
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
    user_model.find({},function(err, datas){

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

