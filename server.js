var http = require('http');
var fs=require('fs');
var url=require('url');
var path=require('path');
var mime = require('mime');

var index_page="";
fs.readFile("./index.txt",function(err,data){
  var out=data.toString();
  if(err)
    throw err;
  else{
    index_page=out;}
});

var j_str_prop=function(input,properties){
  var out="";var p;
  var keys=Object.keys(input);

  for (i in properties) {
    p=properties[parseInt(i)];
    out+=p+":"+JSON.stringify(input[p]);
    out+="\n\n"
  };
  return out;
};

var error_controller=function(req,res,misc){
  var status=misc.status,errtxt=misc.errtxt;suppress=misc.suppress;
  if(!status)
    status=500;
  if(!errtxt)
    errtxt="Error";
  if(!suppress)
    suppress=false;
  try{
    res.writeHead(status,{"Content-Type":"text/plain"});}
  catch(e){
    console.error([req,res]);
  }

  if(!suppress)
    console.trace();

  res.write(j_str_prop(req,["url","method","headers"]));
  res.write(errtxt);
  res.end();
};

var static_controller=function(req,res,tries){
  var parsed_url=url.parse(req.url,true);
  var f_rel_path=decodeURI(parsed_url.pathname);
  var f_since=parseInt(parsed_url.query.v);
  var fpath=path.resolve(path.join("/home/alex/nodest/"+f_rel_path));
  if(!tries)tries=1;else tries+=1;

  if(/\.\./.test(f_rel_path)||/\/\//.test(f_rel_path)){
    error_controller(req,res,{status:403,errtxt:"Forbidden"});
    return;
  }
  var from_cache=static_controller.cache[fpath];

  if(f_since&&!isNaN(f_since)){
    if((new Date()).getTime()<f_since){
      f_since=false;
    } else if(from_cache&&!static_controller.stating[fpath]&&
              from_cache.time_stamp!==f_since&&tries<3)
    {
      static_controller.stating[fpath]=true;
      fs.stat(fpath,function(err,stats){
        delete static_controller.stating[fpath];
        if(err)
          throw err;

        var after_from_cache=static_controller.cache[fpath];
        if(after_from_cache&&stats.mtime.getTime()>after_from_cache.time_stamp)
          delete static_controller.cache[fpath];
        
        static_controller(req,res,tries);
      });
      return;
    }
  } else
    f_since=false;

  if(from_cache){
    res.writeHead(200,{"Content-Type":mime.lookup(fpath),"Cache-Control":"public,max-age="+(60*60*24*7)});
    res.write(from_cache.text)
    res.end();
  } else{
    fs.readFile(fpath,function(err,data){
      if(err)
        throw err;
      var out=data.toString();
      res.writeHead(200,{"Content-Type":mime.lookup(fpath)});
      static_controller.cache[fpath]={text:out,time_stamp:(new Date()).getTime()};
      res.write(out);
      res.end();
      setTimeout(function(){
        delete static_controller.cache[fpath];
      },1000*60*60);
    });
    return;
  }
};
static_controller.cache={};
static_controller.stating={};

var index_controller=function(req,res,tries){
  if(tries&&tries>100){
    error_controller(req,res,{status:500,errtxt:"Tried 100 times"});
    res.end();
  }

  if(index_page!==""){
    res.writeHead(200,{"Content-Type":"text/html"});

    var static_root="static/";
    var static_f_list=["f.js","lib/fix_object_keys.js","lib/sha1.js","data_structures.js","algo.js","practice_problems.js","lib/core.js"];

    var index_html=index_page.toString();

    var match=true;var without_st;
    var part=index_html.toString();
    while(match){
      match=/^.*?\{\{file_with_version\:(.*?)\}\}(.*)$/.exec(part);
      if(match){
        without_st=match[1];
        without_st=without_st.replace(/\/static\//,"");
        static_f_list.push(without_st);
        part=match[2];}
    }

    index_controller.gen_jsmtime(index_html.toString(),static_root,static_f_list,req,res,{});
  }
  else{
    if(!tries)tries=1;
    else tries+=1;

    setTimeout(function(){
      index_controller(req,res,tries);
    },100);
  };
};

var escapeRegExp=function(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

index_controller.gen_jsmtime=function(index_html,root,flist,req,res,prev_times){
  if(flist.length>0){
    var fl,f_cached_time;
    for (var i = 0; i < 1000; i++) {
      if(flist.length==0)
        break;
      fl=flist.pop();
      f_cached_time=index_controller.gen_jsmtime.cache;
      if(f_cached_time&&f_cached_time.recorded_time-10000<(new Date()).getTime()){
        prev_times["/"+root+fl]=f_cached_time.time_stamp;
      } else{
        fs.stat(root+fl,function(err,stats){
          if(err)
            throw err;
          index_controller.gen_jsmtime.cache[root+fl]={recorded_time:(new Date()).getTime(),time_stamp:stats.mtime.getTime()};
          prev_times["/"+root+fl]=stats.mtime.getTime();
          index_controller.gen_jsmtime(index_html,root,flist,req,res,prev_times);
        });
        return;
      }
    };
  }
  var part=index_html.toString();
  var final_html=index_html.toString();
  var match=true;var rr,f_path;
  while(match){
    match=/^.*?(\{\{file_with_version\:(.*?)\}\})(.*)$/.exec(part);
    if(match){
      rr=new RegExp("^(.*?)("+escapeRegExp(match[1])+")(.*)$");
      f_path=match[2]+"?v="+prev_times[match[2]];

      var mm=rr.exec(final_html);
      if(mm)
        final_html=mm[1]+f_path+mm[3];

      part=match[3];}
  }
  var jsfmt="<script type=text/javascript>window.jsfilemtime="+JSON.stringify(prev_times)+";</script>";
  final_html=final_html.replace(/\{\{jsfilemtime\}\}/g,jsfmt);
  res.write(final_html);
  res.end();
};

index_controller.gen_jsmtime.cache={};
index_controller.gen_jsmtime.stating={};

var route=function(url){
  console.log("request "+url);
  if(/^\/static\/.*\.(j|cs)s(\?v=\d+)?/.test(url)){
    return static_controller;
  } else if(/^\/$/.test(url)){
    return index_controller;
  } else if(/^favicon.ico$/.test(url)){
    return function(req,res){return error_controller(req,res,{status:404,errtxt:"404 Not Found",suppress:true});};
  }else{
    return function(req,res){return error_controller(req,res,{status:404,errtxt:"404 Not Found"});};
  }
};

http.createServer(function (req, res) {

  var which=route(req.url);
  which(req,res);
}).listen(1337);

console.log('Server running at http://*:1337/');


