var http = require('http');
var static_controller=require("./controller/static.js");
var error_controller=require("./controller/error.js");
var index_controller=require("./controller/index.js");
var stat_controller=require("stat_times.js");


var route=function(url){
  // console.log("request "+url);
  if(/^\/static\/[\w|-|_|\/]+\.(js|css|txt|svg)(\?v=\d+)?/.test(url)){
    return static_controller;
  } else if(/^\/$/.test(url)){
    return index_controller;
  }else if(/^\/stat_times\.js\?v=\d+?$/.test(url)){
    return stat_controller;
  } else if(/^\/favicon.ico$/.test(url)){
    return function(req,res){return error_controller(req,res,{status:404,errtxt:"404 Not Found",suppress:true});};
  }else{
    return function(req,res){return error_controller(req,res,{status:404,errtxt:"404 Not Found",suppress:false});};
  }
};

http.createServer(function (req, res) {
  res.backup=function(){
    error_controller(req,res,{errtxt:"Server Error"});
  };
  route(req.url)(req,res);
}).listen(1337);

console.log('Server running at http://*:1337/');