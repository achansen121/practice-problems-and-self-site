var fs=require('fs');
var url=require('url');
var path=require('path');
var mime = require('mime');
var promise=require("promise.js");
var stat_times=require("stat_times.js");

var static_controller=(function(){
  var s_timeout=10*1000;
  var o=function(req,res){
    var parsed_url=url.parse(req.url,true);
    var f_rel_path=decodeURI(parsed_url.pathname);

    //var fpath=path.resolve(path.join("."+f_rel_path));
    var fpath=f_rel_path.substring(1,f_rel_path.length);

    if(!/^static\/[\w|__|\/|-|\d]+\.\w{2,4}$/.test(fpath)||/\/\//.test(fpath)){
      res.backup();
      return;
    }
    
    var finfo={
      cinfo:o.cache[fpath],
      mtime:false
    };

    if(finfo.cinfo) {
      stat_times.stat_files("",[fpath])
      .subscribe(function(err,data){
        if(err)
          return res.backup();
        finfo.mtime=data.times["/"+fpath];
        o.display_file(res,fpath,finfo);
      })
      .ensure_terminate(function(p){
        fs.stat(p.key,function(err,stats){
          console.log("stat",err);
          p.finish(err,stats,{dt:s_timeout});
        });
      });
    }
    else
      o.display_file(res,fpath,finfo);

  };


  o.display_file=function(res,fpath,finfo){
    if(finfo.cinfo&&finfo.mtime>finfo.cinfo.time_stamp){
      delete o.cache[fpath];
      delete finfo.cinfo;
    }

    promise(o.f_promises,fpath+(new Date()).getTime())
    .subscribe(function(err,data){
      if(err)
        return res.backup();
      res.writeHead(200,{"Content-Type":mime.lookup(fpath),"Cache-Control":"public,max-age="+(60*60*24*7)});
      res.write(data);
      res.end();
    })
    .ensure_terminate(function(p){
      if(finfo.cinfo&&finfo.mtime<finfo.cinfo.time_stamp)
        p.finish(false,finfo.cinfo.text)
      else
        fs.readFile(fpath,function(err,data){
          console.log("reading "+fpath);
          o.cache[fpath]={text:data,time_stamp:(new Date()).getTime()};
          p.finish(err,data,{dt:60*1000*60});
        });  
    });
  };

  o.f_promises={};
  o.m_promises={};
  o.cache={};
  return o;
})();


module.exports=static_controller;