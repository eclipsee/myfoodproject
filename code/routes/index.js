var express = require('express');
var router = express.Router();
var cookie = require('cookie');
//引入数据模块
var mongoose=require('./conn');
//数据库中的Schema，为数据库对象的集合，一个用户一般对应一个schema。
var adminSchema=new mongoose.Schema({
  _id:String,
  username:String,
  nickname:String,
  password:String
});
//建立查询用的模型
var admin_model=mongoose.model('admin',adminSchema,'admin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//Login页面   根据用户名和密码登录
// 1.接受 2.处理 3.返回
//*********注意方式为post*********
router.post('/Login', function(req, res, next) {
  //1.接收username password
    var username=req.body.username;
    var password=req.body.password;
    //var adminRole = req.body.adminRole;

  //console.log('username:',username, typeof username);
  //console.log('password:',password, typeof password);
  //console.log('adminRole:',adminRole, typeof adminRole);

//2.处理
  admin_model.find({'username':username,'password':password},function(err, datas){
    // 验证登录用户的唯一性
    if(datas && datas.length==1){
      // cookie(key，value)
      //console.log(adminRole);
      res.cookie("username",username);
      //var adminRole1=encodeURIComponent(adminRole);
      //console.log(adminRole1);
      //res.cookie("adminRole",adminRole.toString('base64'));
      //res.cookie("admi",username);
      res.send('1'); //  登录成功
    }else{
      res.send('0'); // 登录失败
    }
  });
});

//checkLogin 检查用户是否登录
//获取cookie中的用户信息，判断用户信息是否存在
router.get('/checkLogin',function(req,res,next){
  var cookies = req.cookies;   //获取cookie
  var username=cookies.username;  //获取cookie的username

  //如果具有username，说明用户已登录，这时不做任何处理，否则退出当前页面
  if(username){
    res.send('');
  }else{
    res.send('alert("对不起，你没有登录，请返回登录！！");' +
        'location.href = "/pages/login.html";')
  }
});

router.get('/logout',function(req,res,next){
  //清楚浏览器的username的cookie
  res.clearCookie("username");
  // 跳转到登录
  res.send("<script>var r = confirm('确定退出吗~~');if(r){location.href='/pages/login.html'}else{}</script>");
});


router.post('/editPassword',function(req,res,next){
  var cookies = req.cookies;   //获取cookie
  var username=cookies.username;  //获取cookie的username

  var password3=req.body.password3;
  console.log(username,password3);

  admin_model.find({'username':username},function(err,datas){
    console.log(datas);
    console.log(datas._id);
    //如果无误且查找到的数据集合长度大于0，则遍历执行删除
    if(datas){
      console.log(datas[0]._id);
      var id = datas[0]._id;
      var nickname = datas[0].nickname
      admin_model.findById(id,function(err,datas){
        if(datas){
          datas._id =id;
          datas.username = req.cookies.username;
          datas.nickname =nickname;
          datas.password = password3;
          datas.save(function(err,datas){
            if(!err){
              res.send("1");
            }else{
              res.send("0");
            }
          });
        }
      });

    }else{
      alert("请输入正确的旧密码！！")
    }
  });

  //idarr.forEach(function(obj,i){
  //  //console.log("11",obj[i]);
  //  admin_model.find({'password':"111"},function(err,datas){
  //    //console.log(datas);
  //    //如果无误且查找到的数据集合长度大于0，则遍历执行删除
  //    if(!err && datas.length>0){
  //      datas.forEach(function(obj,index){
  //        console.log(obj);
  //        obj.remove(function(err){
  //          //删除成功返回1
  //
  //        });
  //      });
  //    }
  //  });
  //});

  //var newpsw = new admin_model();
  //newpsw.username = req.cookies.username;
  ////console.log("user",newLog.user);
  //var d = new Date();
  //newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
  ////newLog.ip=req.ip;
  //newLog.ip=req.socket.remoteAddress.substring(7);
  //newLog.action='用户新增';
  ////console.log(newLog.user, newLog.time, newLog.ip, newLog.action );
  //
  //newLog.save();

});

module.exports = router;
