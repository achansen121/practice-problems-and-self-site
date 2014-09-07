var fs=require('fs');
var promise=require("../lib/promise.js");


var escapeRegExp=function(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

var index_controller=(function(){

  var i_promises={};

  var ctime=60*1000;
  var o=function(req,res){
    /*                                                                          */var i_pm=promise(i_promises,"file_reading");
    /*                                                                          */i_pm.ensure_terminate(function(){
    fs.readFile("./template/index.txt",function(err,data){
      /*html_to_replace=*/i_pm.finish(err,data.toString(),{dt:ctime});
    });
    /*                                                                          */});
    /*                                                                          */i_pm.subscribe(function(err,html_to_replace){
    if(err)
      return res.backup();
    /*                                                                          */var r_pm=promise(i_promises,"file_replacing");
    /*                                                                          */r_pm.ensure_terminate(function(){
    o.gen_index_page(html_to_replace,function(err,data){
      /*html_out=*/r_pm.finish(err,data,{dt:ctime});
    });
    /*                                                                          */});
    /*                                                                          */r_pm.subscribe(function(err,html_out){
    if(err)
      return res.backup();

    res.writeHead(200,{"Content-Type":"text/html"});
    res.write(html_out);
    res.end();
    /*                                                                          */});
    /*                                                                          */});
  };
  o.gen_index_page=function(index_html,callback){
    var static_root="static/";
    var sfl=["f.js","simple.js","lib/fix_object_keys.js","lib/sha1.js",
      "data_structures.js","algo.js","practice_problems.js","lib/core.js",
      "data/words-en.txt","actual_1.js","f.css"];
    var static_f_list={};
    for (var i = 0; i < sfl.length; i++) {
      static_f_list[sfl[i]]=true;
    };
    index_html=index_html.replace(/\s+/g," ");
    index_html=index_html.replace(/([\>|\}]) ([\<|\{])/g,"$1$2");

    var match=true;var without_st;
    var part=index_html.toString();
    while(match){
      match=/^.*?\{\{file_with_version\:(.*?)\}\}(.*)$/.exec(part);
      if(match){
        without_st=match[1];
        without_st=without_st.replace(/\/static\//,"");
        static_f_list[without_st]=true;
        part=match[2];}
    }

    /*                                                                          */var at_pm=promise(i_promises,"all_times");
    /*                                                                          */at_pm.ensure_terminate(function(){
    var f_iter=Object.keys(static_f_list);
    var all_times={gathered_n:0,times:{},max:f_iter.length};
    for (var i = 0; i < f_iter.length; i++) {
      var fname=static_root+f_iter[i];
      /*                                                                        */var np=promise(i_promises,"stat_promise for "+fname);
      /*                                                                        */np.ensure_terminate(function(){
      var associate_name=(function(p,nm){return function(err,stats){
          stats.fname=nm;
          p.finish(err,stats,{dt:ctime});
        };
      })(np,fname);
      fs.stat(fname,associate_name);
      /*                                                                        */});
      /*                                                                        */np.subscribe(function(err,data){
      if(err)
        return at_pm.finish(new Error("file read err"),"");
      all_times.times["/"+data.fname]=data.mtime.getTime();
      all_times.gathered_n+=1;
      if(all_times.max==all_times.gathered_n)
        at_pm.finish(false,all_times.times,{dt:ctime});
      /*                                                                        */});
    };
    /*                                                                          */});
    /*                                                                          */at_pm.subscribe(function(err,times) {
    if(err)
      callback(err,"");
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
    var jsfmt="<script type=text/javascript>window.jsfilemtime="+JSON.stringify(times)+";</script>";
    final_html=final_html.replace(/\{\{jsfilemtime\}\}/g,jsfmt);

    callback(false,final_html);
    /*                                                                          */});
  };

  return o;
})();

module.exports=index_controller;