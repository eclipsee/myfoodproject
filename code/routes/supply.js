var express = require('express');
var router = express.Router();
var log_model = require('./log_model');
//var cookie = require('cookie');
//引入数据模块
var mongoose=require('./conn');
//数据库中的Schema，为数据库对象的集合，一个用户一般对应一个schema。
var supplySchema=new mongoose.Schema({
    tbunitname:String,  //单位名称
    tbaddress:String,   //单位地址
    tbcontact:String,  //联系人
    tbtel:Number,  //联系电话
    tbtype:String,  //供货品类
    tbusername:String, //结算户名
    tbbank:String,  //结算银行
    tbbanknum:Number   //结算账号
});
//建立查询用的模型
var supply_model=mongoose.model('supply',supplySchema,'supply');


/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


//得到用户列表
router.get('/getSuppliers', function(req, res, next) {
    supply_model.find({},function(err,datas){
        if(!err){
            res.send(datas);
        }
    });
});



//供应商新增
router.post('/supply_add', function(req, res, next) {
    var newLog = new log_model();
    newLog.user = req.cookies.username;
    var d = new Date();
    newLog.time= d.toLocaleString(); // 2017/3/26 上午11:11:12
    //newLog.ip=req.ip;
    newLog.ip=req.socket.remoteAddress.substring(7);
    console.log(newLog.ip);
    newLog.action='供应商新增';
    //console.log(newLog.user, newLog.time, newLog.ip, newLog.action );

    newLog.save();


    //1.接收参数
    var tbunitname = req.body.tbunitname;
    var tbaddress = req.body.tbaddress;
    var tbcontact = req.body.tbcontact;
    var tbtel = req.body.tbtel;
    var tbtype = req.body.tbtype;
    var tbusername = req.body.tbusername;
    var tbbank = req.body.tbbank;
    var tbbanknum = req.body.tbbanknum;
    //console.log('tbunitname');
    //console.log(username);
    //2.处理请求
    var newSupply =  new supply_model();
    newSupply.tbunitname = tbunitname;
    newSupply.tbaddress = tbaddress;
    newSupply.tbcontact = tbcontact;
    newSupply.tbtel = tbtel;
    newSupply.tbtype = tbtype;
    newSupply.tbusername = tbusername;
    newSupply.tbbank = tbbank;
    newSupply.tbbanknum = tbbanknum;
    //console.log(2222222222);
//3.保存并对处理结果进行返回
    newSupply.save(function(err){
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


//供应商删除
router.get('/supply_del', function(req, res, next) {

    //接收前端传来的数据
    var id = req.query.id;
    //console.log(id);
    //find查找到的数据不管有多少条，都是数据集合的形式,删除时应该遍历逐条删除
    supply_model.find({'_id':id},function(err,datas){
        //console.log(datas);
        //如果无误且查找到的数据集合长度大于0，则遍历执行删除
        if(!err && datas.length>0){
            datas.forEach(function(obj,index){
                obj.remove(function(err){
                    //删除成功返回1
                    res.send('1');
                });
            });
        }
    });
});

//供应商编辑
router.get('/getonesupply', function(req, res, next) {

    //获取参数
    var id = req.query.id;
    //console.log(id);
    supply_model.findById(id,function(err,data){
        if(!err){
            res.send(data);
            //console.log('data:',data);
        }
    });
});


//供应商编辑
router.post('/supply_edit', function(req, res, next) {
    //1.接收参数
    var id=req.body.id;
    var tbunitname = req.body.tbunitname;
    var tbaddress = req.body.tbaddress;
    var tbcontact = req.body.tbcontact;
    var tbtel = req.body.tbtel;
    var tbtype = req.body.tbtype;
    var tbusername = req.body.tbusername;
    var tbbank = req.body.tbbank;
    var tbbanknum = req.body.tbbanknum;
    //console.log('111111111112222333');
    //2.处理请求
    supply_model.findById(id,function(err,datas){
        if(datas){
            datas._id=id;
            datas.tbunitname = tbunitname;
            datas.tbaddress = tbaddress;
            datas.tbcontact = tbcontact;
            datas.tbtel = tbtel;
            datas.tbtype = tbtype;
            datas.tbusername = tbusername;
            datas.tbbank = tbbank;
            datas.tbbanknum = tbbanknum;
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
    supply_model.find({},function(err, datas){
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
        supply_model.find({},function(err, datas){

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
