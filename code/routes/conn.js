// 数据库配置
var mongoose=require('mongoose');

/*
*   配置数据库连接
*     协议：//主机:端口/数据库名称
* */
mongoose.connect('mongodb://127.0.0.1:27017/pss',function(err){
  if(err){
    throw err;
  }else{
    console.log('成功连接到 MongoDB数据库');
  }
});

module.exports = mongoose;