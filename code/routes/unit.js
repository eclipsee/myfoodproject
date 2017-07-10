var express = require('express');
var router = express.Router();
var log_model = require('./log_model');
//var cookie = require('cookie');
//引入数据模块
var mongoose=require('./conn');
//数据库中的Schema，为数据库对象的集合，一个用户一般对应一个schema。
var unitSchema=new mongoose.Schema({
    uname:String,  //单位名称
    bcode:String,   //单位地址
    uaddress:String,  //联系人
    ucontact:String,  //联系电话
    uphone:String,  //供货品类
    usortno:Number, //结算户名
});
//建立查询用的模型
var unit_model=mongoose.model('unit',unitSchema,'unit');


/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


//得到用户列表
router.get('/getUnits', function(req, res, next) {
    unit_model.find({},function(err,datas){
        if(!err){
            //console.log(datas);
            res.send(datas);
        }
    });
});

//单位新增
router.post('/unit_add', function(req, res, next) {

    //1.接收参数
    var uname = req.body.uname;
    var bcode = req.body.bcode;
    var uaddress = req.body.uaddress;
    var ucontact = req.body.ucontact;
    var uphone = req.body.uphone;
    var usortno = req.body.usortno;
    //console.log('tbunitname');
    //console.log(username);
    //console.log(uname,bcode,uaddress,ucontact,uphone,usortno);
    //2.处理请求

    var newUnit =  new unit_model();
    newUnit.uname = uname;
    newUnit.bcode = bcode;
    newUnit.uaddress = uaddress;
    newUnit.ucontact = ucontact;
    newUnit.uphone = uphone;
    newUnit.usortno = usortno;
    //console.log(2222222222);
//3.保存并对处理结果进行返回
    newUnit.save(function(err){
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


//单位删除
router.get('/unit_del', function(req, res, next) {
    //接收前端传来的数据
    var idarr = req.query.ids;
    console.log(idarr);
    //console.log(id);
    //find查找到的数据不管有多少条，都是数据集合的形式,删除时应该遍历逐条删除
    idarr.forEach(function(obj,i){
        console.log("11",obj[i]);
        unit_model.find({'_id':obj},function(err,datas){
            console.log(datas);
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

//单位编辑
router.get('/getoneunit', function(req, res, next) {

    //获取参数
    var id = req.query.id;
    //console.log(id);
    unit_model.findById(id,function(err,data){
        if(!err){
            res.send(data);
            //console.log('data:',data);
        }
    });
});


//单位编辑
router.post('/unit_edit', function(req, res, next) {
    //1.接收参数
    var id=req.body.id;
    var uname = req.body.uname;
    var bcode = req.body.bcode;
    var uaddress = req.body.uaddress;
    var ucontact = req.body.ucontact;
    var uphone = req.body.uphone;
    var usortno = req.body.usortno;
    //console.log('111111111112222333');
    //console.log(uname,bcode,uaddress,ucontact,uphone,usortno);
    //2.处理请求

    unit_model.findById(id,function(err,datas){
        if(datas){
            datas._id=id;
            datas.uname = uname;
            datas.bcode = bcode;
            datas.uaddress = uaddress;
            datas.ucontact = ucontact;
            datas.uphone = uphone;
            datas.usortno = usortno;
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

//分页
router.get('/getdepart',function(req,res){
    //确定每页显示的数据，从前台获取当前页码
    var pageSize = 5;
    //如果获取到页码即用当前页码，如果页码不存在则默认为1
    var currentPage = req.query.currentPage?(req.query.currentPage) : 1;
    unit_model.find({},function(err,datas){
        //数据总条数
        var totalCount = datas.length;
        //总页数 向上取整
        var totalPage = Math.ceil(totalCount/pageSize);
        //查询数据时跳过查询的起始位置
        var start = (currentPage - 1) * pageSize;
        unit_model.find({},function(err,datas){
            var result = {
                'list':datas,
                'start':start+1,
                'end' : Math.min(start + pageSize,totalCount),
                'totalCount':totalCount,
                'totalPage':totalPage,
                'currentPage':currentPage
            }
            res.send(result);
        }).limit(pageSize).skip(start);

    })

});
module.exports = router;
