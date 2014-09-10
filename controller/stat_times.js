var fs=require('fs');
var promise=require("promise.js");
var path=require("path");


var stat_promises={};

  var sfl=["f.js","simple.js","lib/fix_object_keys.js","lib/sha1.js",
  "data_structures.js","algo.js","practice_problems.js","lib/core.js",
  "data/words-en.txt","actual_1.js","f.css"];

var stat_controller=function(req,res){
  var sp=stat_controller.stat_files("static/",sfl);
  sp.subscribe(function(err,fmap){
    if(err)
      return res.backup();
    res.writeHead(200,{"Content-Type":"application/javascript","Cache-Control":"public,max-age="+(60*60*24*7)});
    res.write("window.jsfilemtime="+JSON.stringify(fmap.times)+";");
    res.end();
  });
};
var ptime=60*1000;
stat_controller.stat_files=function(root,file_list){

  var fstr=JSON.stringify(file_list);


  var stat_all=promise(stat_promises,"stat_fl]"+root.length+"]"+root+fstr.length+"]"+fstr);
  var gathered={times:{},num:0,max:file_list.length};
  gathered.newest=0;
  stat_all.ensure_terminate(function(){

    for (var i = 0; i < file_list.length; i++) {
      var full_name=path.join("."+root+file_list[i]);

      var stat_indiv=promise(stat_promises,"stat_single "+full_name);
      stat_indiv.ensure_terminate(function(){
        var associate_name=(function(p,nm){return function(err,stats){
          console.log("stat "+nm);
          stats.fname=nm;
          p.finish(err,stats,{dt:ptime});
        };})(stat_indiv,full_name);
        fs.stat(full_name,associate_name);
      });
      stat_indiv.subscribe(function(err,data){
        if(err)
          return stat_all.finish(new Error("file read err"),{});
        var ct=data.mtime.getTime();
        if("newest" in gathered && ct>gathered.newest)
          gathered.newest=ct;
        gathered.times["/"+data.fname]=ct;
        gathered.num++;
        if(gathered.num>=gathered.max)
          stat_all.finish(false,gathered,{dt:ptime});
      });
    };
  });
  return stat_all;
};

stat_controller.get_version=function(){
  var stat_vpm=promise(stat_promises,"stat_version");
  stat_vpm.ensure_terminate(function(){
    var sp=stat_controller.stat_files("static/",sfl);
    sp.subscribe(function(err,data){
      stat_vpm.finish(err,data.newest,{dt:ptime});
    });
  });
  return stat_vpm;
};

module.exports=stat_controller;