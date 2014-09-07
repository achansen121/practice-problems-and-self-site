var fs=require('fs');
var url=require('url');
var path=require('path');
var mime = require('mime');
var promise=require("../lib/promise.js");

var static_controller=(function(){
  var o=function(req,res){
    var parsed_url=url.parse(req.url,true);
    var f_rel_path=decodeURI(parsed_url.pathname);

    var fpath=path.resolve(path.join("/home/alex/nodest/"+f_rel_path));

    if(/\.\./.test(f_rel_path)||/\/\//.test(f_rel_path)){
      res.backup();
      return;
    }
    var finfo={
      cinfo:o.cache[fpath],
      mtime:false
    };

    if(finfo.cinfo) {
      var c_pm=promise(o.m_promises,fpath);
      c_pm.subscribe(function(err,data){
        if(err)
          return res.backup();
        finfo.mtime=data.mtime;
        o.display_file(res,fpath,finfo);
      });
      o.resolve_stat_promise(c_pm);
    }
    else
      o.display_file(res,fpath,finfo);

  };
  o.resolve_stat_promise=function(c_pm){
    if(c_pm.will_terminate)
      return true;
    c_pm.will_terminate=true;
    fs.stat(c_pm.key,function(err,stats){
      c_pm.finish(err,stats);
    });
  };

  o.display_file=function(res,fpath,finfo){
    var pf=promise(o.f_promises,fpath);

    if(finfo.cinfo&&finfo.mtime>finfo.cinfo.time_stamp)
      delete o.cache[fpath];
    
    pf.subscribe(function(err,data){
      res.writeHead(200,{"Content-Type":mime.lookup(fpath),"Cache-Control":"public,max-age="+(60*60*24*7)});
      res.write(data);
      res.end();
    });
    o.resolve_file_promise(pf,fpath,finfo);
  };

  o.resolve_file_promise=function(pf,fpath,finfo){
    if(pf.will_terminate)return true;

    pf.will_terminate=true;

    if(finfo.cinfo&&finfo.mtime<finfo.cinfo.time_stamp)
      pf.finish(false,o.cache[fpath])
    else
      fs.readFile(fpath,function(err,data){
        pf.finish(err,data,{dt:60*1000*60});
      });    
    return;
  };
  o.f_promises={};
  o.m_promises={};
  o.cache={};
  return o;
})();


module.exports=static_controller;