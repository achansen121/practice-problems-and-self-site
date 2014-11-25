var http = require('http');
var static_controller=require("./controller/static.js");
var error_controller=require("./controller/error.js");
var index_controller=require("./controller/index.js");
var go_controller=require("./controller/go.js");
var stat_controller=require("stat_times.js");

var err_ignore=function(req,res){return error_controller(req,res,{status:404,errtxt:"404 Not Found",suppress:true});};;
var err_show=function(req,res){return error_controller(req,res,{status:404,errtxt:"404 Not Found",suppress:false});};

var startup=(new Date().getTime());

var change_listener=function(req,res){
  if(startup+1000>(new Date().getTime())){
    res.write("reload");
    res.end();
  }
  req.on("data",function(data){
    var dobj={};
    data=JSON.parse(data.toString());
    var files=Object.keys(data);
    var nleft=files.length;
    var sent=false;
    var finishresponse=function(err,fname){
      nleft--;
      if(!sent&&!nleft&&err){
        sent=true;
        res.write("same");
        return res.end();
      }
      if(sent||err)
        return;
      sent=true;
      res.write("reload");
      res.end();
    };
    res.on("close",function(){
      sent=true;
    });
    res.on("finish",function(){
      sent=true;
    });
    for (var i = 0; i < files.length; i++) {
      files[i]=files[i].replace(/^\//,"");
      stat_controller.f_wait(files[i],finishresponse);
    };
  });
  return;
};

var rmap=[
  {
    match:/^\/static\/[\w|-|_|\/]+\.(js|css|txt|svg)(\?v=\d+)?/,
    control:static_controller
  },
  {
    match:/^\/$/,
    control:index_controller
  },
  {
    match:/^\/go$/,
    control:go_controller
  },
  {
    match:/^\/stat_times\.js\?v=\d+?$/,
    control:stat_controller
  },
  {
    match:/^\/favicon.ico$/,
    control:err_ignore
  },
  {
    match:/^\/listen$/,
    control:change_listener
  },
  {
    match:/.*/,
    control:err_show
  }
];



var route=function(url){
  for (var i = 0; i < rmap.length; i++) {
    if(rmap[i].match.test(url))
      return rmap[i].control;
  };
};

http.createServer(function (req, res) {
  res.backup=function(){
    error_controller(req,res,{errtxt:"Server Error"});
  };
  route(req.url)(req,res);
}).listen(1337);

console.log('Server running at http://*:1337/');