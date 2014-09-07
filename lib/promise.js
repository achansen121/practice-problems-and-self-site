


var promise=function(loc,key){
  if(loc[key]!==undefined)
    return loc[key];
  var o={subscribe:function(fnc){
      if(!this.done)
        this.f_to_call.push(fnc);
      else
        fnc(this.error,this.result);
    },f_to_call:[],done:false,result:false,error:false,time_stamp:0,finish_time:0,
    finish:function(err,data,options){
      this.done=true;
      this.finish_time=(new Date()).getTime();
      this.result=data;
      this.error=err;
      for(fnc in this.f_to_call){
        this.f_to_call[fnc](err,data);
      };
      if(options&&options.dt)
        setTimeout(this.delete_self,options.dt);
      else
        this.delete_self();
    },
    delete_self:function(){
      if(loc[key]==this)
        delete loc[key];
    },
    ensure_terminate:function(fnc){
      if(this.will_terminate||this.done)
        return;
      else{
        this.will_terminate=true;
        fnc();}
    }
    ,
    will_terminate:false,loc:loc,key:key,
  };
  loc[key]=o;
  o.time_stamp=(new Date()).getTime();
  var same=o.time_stamp;

  setTimeout(function(){
    if(loc[key])
      if(same===loc[key].time_stamp&&!loc[key].done){
        console.log("Broken Promise");
        console.log(key);
        console.log(JSON.stringify(loc[key].done));
      }
  },5*1000);

  return o;
};

module.exports=promise;