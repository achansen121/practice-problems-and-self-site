(function(g){

var data_structures={};

if(g.f===undefined)
  throw new Error("eff");
else
  g.f.data_structures=data_structures;



data_structures.genmatrix=function(n){
  if(n===undefined)n=10;
  var s=this.genmatrix.s;

  var unique={};

  var a={rows:n,cols:n};
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      var above=0,left=0,min=0,newval=false;

      if(i>0)above=a[s([i-1,j])];
      if(j>0)left=a[s([i,j-1])];

      min=Math.max(above,left);
      var timedout=1000;
      for (var k = 0; k < timedout; k++) {
        newval=min+k+Math.floor(Math.random()*100);
        if(!(newval in unique))
          break;
      };
      if(k===timedout)
        throw f.trace_gen({toString:function(){return "timedout";},unique:unique});
      unique[newval]=true;
      a[s([i,j])]=newval;
    };
  };
  return a;
};





data_structures.hashset={};
data_structures.hashset.genfromlist=function(arr,prexisting){
  if(prexisting!=undefined)
    var s=prexisting;
  else
    var s={isdone:false,data:{},collisions:[]};
  var addobj=function(obj){
    var h=f.sha.hash(obj.toString());
    if(typeof h == "function"){
      return false;
    } else{
      if(s.data[h]==undefined)
        s.data[h]=obj;
      else if(Array.isArray(s.data[h])){
        var collision=false;
        f.freach(s.data[h],function(o){
          if(obj==o)
            collision=true;
        });
        console.log(collision,obj);
        if(!collision)
          s.data[h].push(obj);
        else{
          s.collisions.push(obj);
          throw f.trace_gen({toString:function(){return "Set Collision";},which:s,obj:obj});}
      } else{
        if(s.data[h]==obj){
          s.collisions.push(obj);
          throw f.trace_gen({toString:function(){return "Set Collision";},which:s,obj:obj});}
        else
          s.data[h]=[s.data[h],obj];
      }
      return true;
    }
  };
  for (var i = 0; i < arr.length; i++) {
    var errd=addobj(arr[i]);
    if(!errd){
      window.setTimeout(function(){
        f.hashset.genfromlist(arr,s);
      },1);
      return s;
    } else{
      arr.shift();
    }
  };
  s.isdone=true;
  return s;
};







data_structures.heap={};

data_structures.heap.percolateup=function(hh,cmp,i){
  if(i>=hh.length)
    throw f.trace_gen("not in heap");
  var ival=hh[i];
  if(i==0)
    return true;
  var pindex=Math.floor((i-1)/2);
  var pval=hh[pindex];
  var ilist=[pindex*2+1,pindex*2+2];
  if(cmp(ival,pval)<0){
    f.qsort.swap(hh,pindex,i);
    f.freach(ilist,function(obj){
      if(isNaN(i))
        throw f.trace_gen("what is this");
      if(i!=obj&&obj<hh.length)
        data_structures.heap.percolateup(hh,cmp,obj);
    });
    data_structures.heap.percolateup(hh,cmp,pindex);
  }
};
data_structures.heap.percolatedn=function(hh,cmp,i){
  var ilist=[i*2+1,i*2+2];
  f.freach(ilist,function(obj){
    if(obj>=hh.length)
      return true;
    var cval=hh[obj];
    var ival=hh[i];
    if(cmp(cval,ival)<0){
      f.qsort.swap(hh,obj,i);
      data_structures.heap.percolatedn(hh,cmp,obj);
    }
  });
};
data_structures.heap.push=function(h,item,compare){
  if(compare==undefined)
    compare=f.qsort.compare;

  h.push(item);
  data_structures.heap.percolateup(h,compare,h.length-1);
};
data_structures.heap.fromlist=function(arr,compare){
  if(compare==undefined)
    compare=f.qsort.compare;
  var h=[];

  while(arr.length){
    var nitem=arr.shift();
    h.push(nitem);
    data_structures.heap.percolateup(h,compare,h.length-1);
  }
  return h;
};
data_structures.heap.pop=function(hh,compare){
  if(compare==undefined)
    compare=f.qsort.compare;
  if(hh.length<1)
    throw f.trace_gen("empty");
  f.qsort.swap(hh,0,hh.length-1);
  var obj=hh.pop();
  data_structures.heap.percolatedn(hh,compare,0);
  return obj;
};


































data_structures.bst={};
data_structures.bst.make=function(o){
  if(f.is_array(o))o={emts:o};
  eval(f.opt_eval_str("{emts:[],cmp:f.qsort.compare,bst:{}}"));

  for(e in emts){
    data_structures.bst.add({e:emts[e],bst:bst,cmp:cmp});
  };
  return bst;
};
data_structures.bst.add=function(o){
  eval(f.opt_eval_str("{e:undefined,bst:undefined,cmp:undefined}"));

  if(typeof bst!="object")
    throw f.trace_gen({msg:"not obj",bst:bst});

  if(Object.keys(bst).length==0){
    bst.value=e;
    bst.left=null;
    bst.right=null;
    bst.below_left=0;
    bst.below_right=0
    bst.parent=null;
    return;
  } else{
    if(cmp(bst.value,e)<=0){
      if(bst.left===null)
        bst.left=data_structures.bst.__gen_node__(e);
      else
        data_structures.bst.add({e:e,bst:bst.left,cmp:cmp});
      bst.below_left+=1;
      bst.left.parent=bst;
    } else{
      if(bst.right===null)
        bst.right=data_structures.bst.__gen_node__(e);
      else
        data_structures.bst.add({e:e,bst:bst.right,cmp:cmp});
      bst.below_right+=1;
      bst.right.parent=bst;
    }
    if(Math.abs(bst.below_left-bst.below_right)>2&&bst.below_right>3&&bst.below_left>3){
      data_structures.bst.__rebalance(bst);
    }
    return;
  }
};
data_structures.bst.__rebalance__=function(bst){
  var prev_data={};
  prev_data.left_left=bst.left.left;
  prev_data.left_right=bst.left.right;
  prev_data.right_left=bst.right.left;
  prev_data.right_right=bst.right.right;
  prev_data.left=bst.left;
  prev_data.right=bst.right;

  var torotate=data_structures.bst.__gen_node__(bst.value);

  var dir,opp;
  if(bst.below_right>bst.below_left){
    dir="right";
    opp="left";}
  else if(bst.below_left<bst.below_right){
    dir="left";
    opp="right";
  } else{
    throw f.trace_gen("why here");
  }


  bst[dir]=prev_data[dir+"_"+dir];

  bst["below_"+dir]=prev_data[dir]["below_"+dir]+dir["below_"+opp]+1;

  bst[opp]=torotate;
  torotate[opp]=prev_data[dir_+"opp"];
  torotate["below_"+opp]=prev_data[dir]["below_"+opp];

  torotate[dir]=prev_data[opp];
  torotate["below_"+dir]=prev_data[opp]["below_"+opp]+prev_data[opp]["below_"+dir]+1;

  bst["below_"+opp]=torotate["below_"+dir]+torotate["below_"+opp]+1;
  bst.value=prev_data[dir].value;

  if(bst.parent!=null)
    data_structures.bst.__rebalance__(bst.parent);
};

data_structures.bst.__gen_node__=function(e){
  return {left:null,right:null,value:e,below_right:0,below_left:0,parent:null};
};

})(window);