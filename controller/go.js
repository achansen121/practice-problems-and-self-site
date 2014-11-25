
var promise=require("promise.js");
var stat_times=require("stat_times.js");
var jsdom=require("jsdom");

var genhtml=require("./lib/genhtml.js");
var header=require("./part/header.js");
var navbar=require("./part/navbar.js");

var go_controller=(function(){

var i_promises={};
var ctime=60*1000;

var gorow={
  "tag":"div",
  "cn":[]
};
for (var i = 0; i < 16; i++) {
  gorow.cn.push({"tag":"div","cn":[{"tag":"div","className":"vert"},{"tag":"div","className":"hori"}]})
};

var gorows={
  "tag":"div",
  "className":"gorows",
  "cn":[]
};

for (var i = 0; i < 16; i++) {
  gorows.cn.push(gorow);
};

var goboard={
  "tag":"div",
  "style":{"display":"block","text-align":"center","margin":"2em",},
  "cn":[{
    "tag":"div",
    "id":"goboard",
    "cn":[gorows]
  }]
};


var o=function(req,res){
  promise(i_promises,"gen_all_index")
  .ensure_terminate(function(thepromise){

  jsdom.env("<html><head></head><body></body></html>",function(errors,window){
  var d=window.document;
  var b=d.body;
  var h=d.head;
  var m=d.createElement("div");m.id="everything";b.appendChild(m);
  
  m.appendChild(genhtml(d,header));
  m.appendChild(genhtml(d,navbar));
  m.appendChild(genhtml(d,goboard));
  m.appendChild(genhtml(d,{tag:"div",cn:[{tag:"img",src:"/static/img/gowhite.svg"},{tag:"img",src:"/static/img/goblack.svg"}]}))


  var add_stylesheet=function(fname){
    var c=d.createElement("link");c.href=fname;c.type="text/css";c.rel="stylesheet";h.appendChild(c);return c;
  };
  var add_script=function(fname){
    var s=d.createElement("script");s.src=fname;s.type="text/javascript";b.appendChild(s);return s;
  }
  var static_f_list=["static/f.css","static/f.js","static/go.css","static/img/gowhite.svg","static/img/goblack.svg","static/go.js"];
  stat_times.stat_files(static_f_list)
  .subscribe(function(err,data) {
  if(err)
    throw err;
  for(fn in data.times){
    if(/\.css$/.test(fn))
      add_stylesheet(fn+"?v="+data.times[fn]);
    else if(/\.js$/.test(fn))
      add_script(fn+"?v="+data.times[fn]);
    else if(/\.svg$/.test(fn)){
      var allimg=d.querySelectorAll("img[src=\""+fn+"\"]");
      for (var i = 0; i < allimg.length; i++) {
        allimg[i].src=fn+"?v="+data.times[fn];
      };
    }
  };
  add_script(data.stat_version_file);

  thepromise.finish(false,d,{dt:ctime});
  /*                                                                          */});
  /*                                                                          */});
  /*                                                                          */})
  .subscribe(function(err,data){
  res.write("<!doctype html>"+data.documentElement.outerHTML);
  res.end();
  /*                                                                          */});
};

  return o;
})();

module.exports=go_controller;