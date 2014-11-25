
var promise=require("promise.js");
var stat_times=require("stat_times.js");
var jsdom=require("jsdom");

var genhtml=require("./lib/genhtml.js");
var header=require("./part/header.js");
var navbar=require("./part/navbar.js");

var index_controller=(function(){

  var i_promises={};

  var ctime=60*1000;

var o=function(req,res){
  promise(i_promises,"gen_all_index")
  .ensure_terminate(function(thepromise){

  jsdom.env("<html><head></head><body></body></html>",function(errors,window){
  var d=window.document;
  var b=d.body;
  var h=d.head;
  var m=d.createElement("div");m.id="everything";b.appendChild(m);

  var innertext=function(obj,txt){
    obj.innerHTML="";obj.appendChild(d.createTextNode(txt));
  };
  var div=function(opts){
    if(!opts)
      opts={};
    var nn= d.createElement("div");
    if(opts.parent)
      opts.parent.appendChild(nn);
    if(opts.id)
      nn.id=opts.id;
    return nn;
  };
  m.appendChild(genhtml(d,header));

  m.appendChild(genhtml(d,navbar));

  //var synopsis=div({parent:m,id:synopsis});
  //innertext(synopsis,"Whatever i do what i want");
  
  var add_stylesheet=function(fname){
    var c=d.createElement("link");c.href=fname;c.type="text/css";c.rel="stylesheet";h.appendChild(c);return c;
  };
  var add_script=function(fname){
    var s=d.createElement("script");s.src=fname;s.type="text/javascript";b.appendChild(s);return s;
  }
  var static_f_list=["static/f.css","static/f.js"];
  stat_times.stat_files(static_f_list)
  .subscribe(function(err,data) {
  if(err)
    throw err;
  for(fn in data.times){
    if(/\.css$/.test(fn))
      add_stylesheet(fn+"?v="+data.times[fn]);
    else if(/\.js$/.test(fn))
      add_script(fn+"?v="+data.times[fn]);
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

module.exports=index_controller;