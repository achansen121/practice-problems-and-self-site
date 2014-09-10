var fs=require('fs');
var promise=require("promise.js");
var stat_times=require("stat_times.js");

var escapeRegExp=function(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

var index_controller=(function(){

  var i_promises={};

  var ctime=60*1000;
  var o=function(req,res){
    promise(i_promises,"file_reading")
    .ensure_terminate(function(p){
      fs.readFile("./template/index.html",function(err,data){
        if(err)
          return p.finish(err,data);
        console.log("reading index.html");
        p.finish(err,data.toString(),{dt:ctime});
      });
    })
    .subscribe(function(err,html_to_replace){
    if(err)
      return res.backup();

    promise(i_promises,"file_replacing")
    .ensure_terminate(function(p){
      o.gen_index_page(html_to_replace,function(err,data){
        if(err)
          return p.finish(err,"");
        p.finish(err,data,{dt:ctime});
      });
    })
    .subscribe(function(err,html_out){
    if(err)
      return res.backup();

    res.writeHead(200,{"Content-Type":"text/html"});
    res.write(html_out);
    res.end();
    /*                                                                          */});
    /*                                                                          */});
  };
  o.read_index=function(){
    return 
  };

  o.gen_index_page=function(index_html,callback){
    var static_root="/static/";
    sfl=[];

    var static_f_list={};
    for (var i = 0; i < sfl.length; i++) {
      static_f_list[sfl[i]]=true;
    };
    index_html=index_html.replace(/\s+/g," ");
    index_html=index_html.replace(/([\>|\}]) ([\<|\{])/g,"$1$2");

    var match=true;var without_st;
    var part=index_html.toString();
    while(match){
      match=/^.*?\{\{file_with_version\:\/(.*?)\}\}(.*)$/.exec(part);
      if(match){
        without_st=match[1];
        static_f_list[without_st]=true;
        part=match[2];}
    }

    stat_times.stat_files("",Object.keys(static_f_list))
    .subscribe(function(err,data) {
      if(err)
        return callback(err,"");
      var times=data.times;
      var part=index_html.toString();
      var final_html=index_html.toString();
      var match=true;var rr,f_path;
      while(match){
        match=/^.*?(\{\{file_with_version\:(.*?)\}\})(.*)$/.exec(part);
        if(match){
          rr=new RegExp("^(.*?)("+escapeRegExp(match[1])+")(.*)$");
          f_path=match[2]+"?v="+times[match[2]];

          var mm=rr.exec(final_html);
          if(mm)
            final_html=mm[1]+f_path+mm[3];

          part=match[3];}
      }
      if(/\{\{jsfilemtime\}\}/g.test(final_html)){
        stat_times.get_version()
        .subscribe(function(err,time){
          if(err)return callback(true,final_html);
          
          final_html=final_html.replace(/\{\{jsfilemtime\}\}/g,"<script type=text/javascript src=\"/stat_times.js?v="+time+"\"></script>");
          callback(false,final_html);
        });
      } else
        callback(false,final_html);
    /*                                                                          */});
  };

  return o;
})();

module.exports=index_controller;