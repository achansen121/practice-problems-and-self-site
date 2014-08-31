(function(g){

var problems={};
var f=g.f;

problems.matrix=function(m,n){
  var r=m.rows;
  var c=m.cols;

  //utility s-stringify
  //flr floor
  var s=problems.matrix.s;
  var flr=problems.matrix.flr;

  //average
  //middlecoordinate
  var avg=this.matrix.avg;
  var middle=this.matrix.middle;

  var nexttotry=[];var trial;
  var default_bounds={mx:r,my:c,nx:0,ny:0};
  var x;
  var y;

  var c1,c2,c3,old;
  var b=f.clone(default_bounds);
  var add_unique_coor=problems.matrix.add_unique_coor;
  var toolong=10000;
  for (var i = 0; i < toolong; i++) {
    x=middle(b,"x");
    y=middle(b,"y");
    cval=m[s([x,y])];
   
    c1=f.clone(b);c2=f.clone(b);c3=f.clone(b);old=f.clone(b);
    
    if(cval===n){
      return {result:true,x:x,y:y};
    }else if(cval<n){
      c1.mx=x;c1.ny=y;
      c2.nx=x;c2.my=y;
      c3.nx=x;c3.ny=y;
    } else if(cval>n){
      c1.mx=x;c1.ny=y;
      c2.nx=x;c2.my=y;
      c3.mx=x;c3.my=y;
    } else
      throw f.trace_gen({toString:function(){"what"},cval:cval,x:x,y:y});
    add_unique_coor([c1,c2,c3],old,nexttotry);

    trial=nexttotry.pop();
    if(!trial)
      return false;
    b=f.clone(trial);
  };
  if(i===toolong)
    throw f.trace_gen({toString:function(){return "loopy";},todolist:nexttotry});
  return false;
};
problems.matrix.s=f.stringify;
problems.matrix.flr=function(n){
  return Math.floor(n);
};

problems.matrix.avg=function(i,j){
  return Math.floor((i+j)/2);
};

problems.matrix.middle=function(bnd,ctype){
  var avg=problems.matrix.avg;
  return avg(bnd["m"+ctype],bnd["n"+ctype]);
};
problems.matrix.add_unique_coor=function(bnd,old,addto){
  var s=problems.matrix.s;
  var seen={};
  seen[s(old)]=false;
  f.freach(bnd,function(b){
    var cs=s(b);
    if(!(cs in seen))
      seen[cs]=b;
  });
  f.keyvals(seen,function(k,v){
    if(v!==false)
      addto.push(v);
  });
};

problems.matrix.trial=function(){
  var m=problems.matrix(2);
  console.log(m);
  try{
    return problems.matrix(m,1);
  } catch(e){
    problems.matrix.lasterror=e;
    return e;
  }
};



problems.dijkstra=function(graph,src,end){
  var visited={};visited[graph[src].id]=0;
  var current=graph[src].id;
  var unvisited=[];
  f.freach(Object.keys(graph),function(i){
    if(i!=src)
      unvisited[i]="Infinity";
  });
  var infcompare=function(lv,rv){
    var iv="Infinity";
    if(lv===iv&&rv===iv)
      return 0;
    else if(lv===iv)
      return 1;
    else if(rv===iv)
      return -1;
    if(lv<rv)
      return -1;
    else if(lv==rv)
      return 0;
    else
      return 1;};

  f.data_structures.heap.fromlist(unvisited,infcompare)
};


problems.dijkstra.__gengraph=function(options){
  var o={weighted:true,nonnegative:false,num:5,connections:"half",range:8,weightintsonly:true};
  f.freach(Object.keys(options),function(k){
    if(o[k]===undefined){
      throw f.trace_gen("invalid option "+k);
    } else{
      o[k]=options[k];
    }
  });

  var nodes=[];var wc;
  for (var i = 0; i < o.num; i++) {
    nodes[i]={id:f.base_two_six(i),edges:[]};
    for (var j = 0; j < o.num; j++) {
      if(i==j)
        wc=0;
      else{
        if(o.connections==="half"&&Math.random()>.5)
          continue;
        wc=Math.floor(Math.random()*o.range)+1;}
      nodes[i].edges[j]=wc;
    };
  };
};







//Given numbers x and y

problems.print_rational=function(x,y,options){
  if(y===undefined&&options===undefined){
    options=x;x=undefined;
  }
  var o=f.__parseoptions({x:x,y:y,debug:false},options);
  f.freach(["x","y"],function(v){
    eval(v+"=o."+v+";");
  });
  x=parseInt(x);y=parseInt(y);
  if(isNaN(x)||isNaN(y))
    throw f.trace_gen("args x="+x.toString()+" or y="+y.toString()+" invalid");

  var digits=[],digit,leftover,pstart,seen={};

  digit=Math.floor(x/y);
  digits.push(digit);
  leftover=(x%y)*10;

  for (var i = 0; i < 1000; i++) {
    if(seen[leftover]!==undefined){
      pstart=seen[leftover]+1;
      break;
    }
    seen[leftover]=i;
    digit=Math.floor(leftover/y);
    digits.push(digit);
    leftover=(leftover%y)*10;
  };
  if(pstart===undefined)
    throw f.trace_gen("borked pstart undefined");
  if(i===1000)
    throw f.trace_gen("borked loopy");

  var s="";
  f.keyvals(digits,function(i,d){
    if(i==1)
      s+=".";
    if(i==pstart)
      s+="(";
    s+=d;
  });
  s+=")";
  if(!o.debug)
    return s;
  var rv={};
  f.freach(["digits","s","pstart"],function(o){
    eval("rv."+o+"="+o+";");
  });
  return rv;
};










//given a graph of files
//print the order to include them
//throw error for loops in dependencies

problems.dependencies=function(d){
  var dcmp=function(x,y){
    return (x.depn.length-y.depn.length);
  };
  var h=[];
  f.keyvals(d,function(k,v){
    f.data_structures.heap.push(h,v,dcmp);
  });
  var visited={};
  for (var i = 0; i < 1000; i++) {
    var obj=f.data_structures.heap.pop(h,dcmp);
    visited[obj.id]=obj;
    for (var j = 0; j < obj.depn.length; j++) {
      obj.depn[j];
    };
  };
  return h;
};

problems.dependencies.gentest=function(o){
  o=f.__parseoptions({n:10,depn:4},o);

  var fnames={};
  var genunique=function(){
    for (var totry="",i=0;((totry in fnames)||totry=="")&&i<100;i++) {
      totry=f.base_two_six(Math.floor(Math.random()*100000));
    };
    if(totry in fnames)
      throw f.trace_gen({msg:"why not unique yet",fnames:fnames,totry:totry});
    else{
      return totry;
    }
  };
  for (var i = 0; i < o.n; i++) {
     var nname=genunique();
     fnames[nname]={id:nname,depn:[]};
  };
  var ok=Object.keys(fnames);
  f.keyvals(fnames,function(k,v){
    var which;
    var used={};
    var randd=Math.floor(o.depn*Math.random());
    for (var i = 0; i < randd; i++) {
      for (var j = 0; j < 1000; j++) {
        which=Math.floor(Math.random()*ok.length);
        if(!(which in used))
          break;
      };
      if(j>=1000){
        throw f.trace_gen("timeout");}
      v.depn.push(ok[which]);
    };
  });
  return fnames;
};




problems.bst_range_count=function(o){
  eval(f.opt_eval_str("{bst:{},x:0,y:10,cmp:f.qsort.compare}"));

  if(bst==null)
    return 0;

  if(cmp(x,y)>0)
    throw f.trace_gen("invalid range");

  var cx=cmp(x,bst.value);
  var cy=cmp(y,bst.value);

  var clone_o=f.clone(o);
  var t=0;
  if(cx==0||cy==0)
    t=1;

  if(cx<=0&&cy<=0){
    clone_o.bst=bst.right;
    return t+f.bst.range_count(clone_o);
  } else if(cx>0&&cy>0){
    clone_o.bst=bst.left;
    return t+f.bst.range_count(clone_o);
  } else if(cx<=0&&cy>0){
    t=1;
    var clone_l=f.clone(o);

    clone_l.bst=bst.right;
    clone_l.y=bst.value;

    clone_o.bst=bst.left;
    clone_o.x=bst.value;
    var ln=f.bst.range_count(clone_l);
    var rn=f.bst.range_count(clone_o);
    return t+ln+rn;
  } else
    throw f.trace_gen("shouldn't be here");
};


})(window);