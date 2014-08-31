(function(g){


var f={};
f.g=g;
var opt_eval_str=function(d){return ("\
o=f.__parseoptions("+d+",o);\
  for(k in o){\
    eval(`var `+k+`=o.`+k+`;`);}\
".replace(/`/g,"\""));
};
var load_script=function(o){
  eval(opt_eval_str("{callback:function(){},url:undefined}"));

  var d=f.g.document;

  var head= d.getElementsByTagName('head')[0];
  s= d.createElement('script');
  s.type= 'text/javascript';

  var ver_url=url+"?v=";
  if(f.has_property_chain(f.g,["jsfilemtime",url])&&f.g.jsfilemtime[url])
    ver_url+=f.g.jsfilemtime[url];

  s.src=ver_url;
  head.appendChild(s);

  callback();
};


f.opt_eval_str=function(d){return ("\
o=f.__parseoptions("+d+",o);\
  for(k in o){\
    eval(`var `+k+`=o.`+k+`;`);}\
".replace(/`/g,"\""));
};

window.f=f;
window.r=function(){
  window.location.reload();
};

var fix_built_in=function(){
  var d=f.g.document,s;

  if(f.g.JSON!=undefined&&f.g.JSON.parse!=undefined)
    f.jsonparse=f.g.JSON.parse;
  if(f.g.history.pushState==undefined)
    f.g.history.pushState=function(state,name,where){
      f.g.location=where;
    };
  if (!Object.keys) {
    load_script("/static/lib/fix_object_keys.js");
  } 
  if((f.jsonparse===undefined||f.dqs===undefined)&&!f.has_property_chain(f.g,["$","fn","jquery"])) {
    f.g.setTimeout(function(){
      load_script('//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js');
    },1);
    if(f.dqs===undefined)
      f.dqs=function(input){
        var out = f.g.$(input)[0];
        return out;
      };
    if(f.jsonparse===undefined)
      f.jsonparse=function(input){
        var out=false;
        try{
          out = f.g.$.parseJSON(input);}
        catch(e){
          if(f.has_property_chain(f.g,["$","parseJSON"]))
            return {deferred:true};
          out=false;
        }
        if(out!=false)
          return out;
        var temp=false;
        if(!/[;|=]/.test(input)){
          try{
            eval("var temp="+input+";");
            return temp;}
          catch(e){
            return false;
          }}
        return temp;
      };
  }
};



f.algo={};
f.algo.load=function(o){
  eval(opt_eval_str("{callback:function(){}}"));

  o.url="/static/algo.js";
  f.g.setTimeout(function(){
    load_script(o);
  },1);
};

f.data_structures={};
f.data_structures.load=function(o){
  eval(opt_eval_str("{callback:function(){}}"));

  o.url="/static/data_structures.js";
  f.g.setTimeout(function(){
    load_script(o);
  },1);
};









f.nou=function(obj){
  return (obj===null||obj===undefined);
}
f.try_until_not_deferred=function(options){
  if(options)
    var fnc=options.fnc,callback=options.callback,delay=options.delay,multiplier=options.multiplier,max=options.max;
  if(!fnc||!callback)
    throw f.trace_gen("wrong options");
  if(!delay)delay=1000;
  if(!multiplier)multiplier=2;
  if(!max)max=10000;
  var g=this.g;
  var runtry=fnc();


  if(runtry.deferred===true){
    var newfnc=runtry.fnc;
    var newdelay=delay*multiplier;
    if(newdelay>max){
      throw f.trace_gen("max delay reached");
      callback(false);
      return false;
    } else
      g.setTimeout(function(){
        f.try_until_not_deferred(newfnc,newdelay,multiplier,max);
      });
  } else
    callback(runtry);
};
f.ac=function(obj,child){
  if(obj.appendChild==undefined)
    throw f.trace_gen("need appendChild");
  obj.appendChild(child);
};
f.gebi=function(input){
  var d=f.g.document;
  return d.getElementById(input);
};
f.dqs=function(qs){
  var d=f.g.document;
  return d.querySelector(qs);
};
f.rm=function(obj){
  if(obj.remove!=undefined)
    obj.remove();
  else
    obj.parentNode.removeChild(obj);
};
f.ael=function(obj,evt,ofnc){
  var fnc=function(event){
    if(event!=null&&event!=undefined)
      event={fakeevent:true,returnValue:true,preventDefault:function(){this.returnValue=false;}};
    ofnc(event);
    if(event.fakeevent===true)
      return event.returnValue;
  };
  var altevent=null;
  if(obj==window&&evt=="load"){
    altevent="DOMContentLoaded";
  }
  if(obj.addEventListener!=undefined){
    if(altevent==null)
      obj.addEventListener(evt,fnc,false);
    else
      obj.addEventListener(altevent,fnc,false);
  } else if(obj.attachEvent!=undefined){
    obj.attachEvent("on"+evt,fnc);
  } else if(obj["on"+evt]==null){
    obj["on"+evt]=fnc;
  } else if(obj["on"+evt]!=null){
    var oldfnc=obj["on"+evt];
    obj["on"+evt]=function(event){
      oldfnc(event);
      fnc(event);
    }
  }
};
f.preventDefault=function(evt){
  if(evt)
  if(evt.preventDefault!=undefined)
    evt.preventDefault();
  else
    evt.returnValue=false;
};
f.itall=function(input,fstack){
  if(fstack.length>0){
    var ff=fstack.shift();
    input.callback=function(output){
      f.itall(output,fstack);
    };
    ff(input);
  }
};
f.swap=function(obj,kone,ktwo){
  var temp=obj[kone];
  obj[kone]=obj[ktwo];
  obj[ktwo]=temp;
};


f.freach=function(a,fn,options){
  if(options!=undefined){
    var withindex=options.withindex;
    var cancelonfalse=options.cancelonfalse;
  }
  for (var i = 0; i < a.length; i++) {
    if(withindex===true)
      var out=fn(a[i],i);
    else
      var out=fn(a[i]);
    if(out===false&&cancelonfalse!==false)
      return false;
  };
};
f.keyvals=function(obj,fn,opt){
  if((typeof obj).toLowerCase()!="object"){
    console.trace();
    throw {toString:function(){return "not an object";},obj:obj,fn:fn,opt:opt};}
  var keys=Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    try{
      var out=fn(keys[i],obj[keys[i]]);}
    catch(e){
      if(!("onkey" in e))
        e.onkey=keys[i];
      if(!("onval" in e))
        e.onval=obj[keys[i]];
      throw f.trace_gen(e);
    }
    if(out===false||out==="break")
      return out;
  };
};

f.has_property_chain=function(obj,plist){
  var allexist=true;
  var temp=obj;
  for (var i = 0; i < plist.length; i++) {
    if(!(plist[i] in temp)||temp[plist[i]]===undefined||temp[plist[i]]===null)
      return false;
    else
      temp=temp[plist[i]];
  };
  return (temp!==undefined&&temp!==null);
};

f.sha={};
f.sha.hash=function(str){
  if(window.CryptoJS===undefined){
    f.sha.getcrypto();
    return function(){
      return f.sha.hash(str);
    };
  }
  return CryptoJS.SHA1(str);
};
f.sha.getcrypto=function(){
  var d=f.g.document;
  if(window.CryptoJS===undefined){
    var s=[];
    var alls=d.getElementsByTagName("script");
    var alreadyloaded=false;
    f.freach(alls,function(obj){
      if(obj.src=="/static/lib/core.js")
        alreadyloaded=true;
    });
    if(alreadyloaded===true)
      return true;
    s.push(d.createElement("script"));
    s.push(d.createElement("script"));
    s[0].src="/static/lib/core.js";
    s[1].src="/static/lib/sha1.js";
    var head= d.getElementsByTagName('head')[0];
    f.freach(s,function(o){
      o.type="text/javascript";
      head.appendChild(o);
    });
    return s;
  }
};

f.avg=function(i,j){
  return Math.floor((i+j)/2);
};

f.to_base=function(num,to_base){
  to_base=parseInt(to_base);
  num=parseInt(num);
  if(isNaN(to_base)||to_base<2||isNaN(num))
    throw f.trace_gen("not a base");
  var a=[];
  for (;num;) {
    a.unshift(num%to_base)
    num=Math.floor(num/to_base);
  };
  return a;
};

f.functify=function(inf){
  var obj=null;
  if(inf.obj_to_call!=undefined)
    obj=inf.obj_to_call;
  if(inf.call_to_make!=undefined)
    inf=inf.call_to_make;
  return function(input){
    var out=undefined;
    var estr="out=";
    if(obj!=null&&obj!=undefined)
      estr+="obj[inf](";
    else
      estr+="inf(";

    for (var i = 0; i < input.args.length; i++) {
      estr+="input.args["+i+"],";
    };
    estr=estr.substring(0,estr.length-1)+");";
    eval(estr);
    if(input.callback!=undefined)
      input.callback(out);
  };
};



f.n_check_seq=function(obj,plist){
  var o=obj;
  for (var i = 0; i < plist.length; i++) {
    if(o==null)
      return false;
    o=o[plist[i]];
  };
  return true;
};

f.base_two_six=function(num){
  num=parseInt(num);
  if(isNaN(num)){
    throw f.trace_gen({msg:"is nan",num:num});
  }
  var s="";

  for (var i = 0; i < 1000; i++) {
    var r=num%26;
    s=String.fromCharCode(r+65)+s;
    num=Math.floor(num/26);
    if(num==0)break;
  };
  if(i===1000)
    throw f.trace_gen({msg:"timeout",num:num});
  else
    return s;
};



f.clone=function(o){
  var no={};
  f.keyvals(o,function(k,v){
    no[k]=v;
  });
  return no;
};

f.__parseoptions=function(defaults,options){
  var newopts=f.clone(defaults);
  if(options===undefined)
    return newopts;
  if(typeof options!="object")
    throw f.trace_gen({msg:"not obj",options:options});
  f.freach(Object.keys(options),function(k){
    if(!newopts.hasOwnProperty(k)){
      throw f.trace_gen("invalid option "+k);
    } else{
      newopts[k]=options[k];
    }
  });
  f.keyvals(newopts,function(k,v){
    if(v===undefined)
      throw f.trace_gen("required option "+k+" not set");
  });
  return newopts;
};


f.stringify=function(inobj){
  return JSON.stringify(inobj);
};


f.require_properties=function(obj,list){
  if(f.is_array(list)){
    for(i in list){
      if(!(list[i] in obj))
        throw f.trace_gen("missing property");
    }
  } else if(typeof obj=="object"){
    for(p in list){
      if(!(p in obj))
        throw f.trace_gen("missing property");
      if(typeof obj[p]!==list[p])
        throw f.trace_gen("wrong type");
    }
  } else
    throw f.trace_gen("what is this list");
};


f.create_divs = function (ntoadd) {
  var mknode=function(o){
    var tg="div";
    if("tn" in o)
      tg=o.tn;
    var tn=document.createElement(tg);
    if("innert" in o)
      tn.innerText=o.innert;
    if("id" in o)
      tn.id=o.id;
    var cn;
    if("ch" in o){
      for(c in o.ch){
        cn=mknode(o.ch[c]);
        tn.appendChild(cn);
      }    
    }
    return tn;
  };
  for(nn in ntoadd){
    console.log(ntoadd[nn]);
    var tn=mknode(ntoadd[nn]);
    document.body.appendChild(tn);
  }
};

f.trace_gen=function(e){
  if(f.g.console!==undefined&&typeof f.g.console.trace=="function")
    f.g.console.trace();
  if(typeof e==="string"){
    var ne=new Error(e);
    return ne;
  } else{
    if(!("msg" in e))
      e.msg="Error";
    var ne=new Error(e.msg);console.log(e);
    f.keyvals(e,function(k,v){
      if(k!="msg"&&k!="toString")
        ne[k]=v;
    });
    return e;}
};

f.is_array=function(a){
  for(k in a){
    if(isNaN(k)||parseInt(k)!==Math.floor(parseInt(k)))
      return false;
  };
  return true;
};


f.ael(window,"load",function(){
  fix_built_in();
  f.algo.load({callback:function(){
    f.g.setTimeout(function(){
      //f.algo.msort.benchmark();
    },500);
  }});
});

})(window);