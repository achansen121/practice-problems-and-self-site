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







var btree={};

//at most m children
//non-leaf nodes have at least m/2 children
//root has two children if not leaf node
//non leaf node with k children contains k-1 keys
//all leaves same level

btree.gen=function(o){
  eval(opt_eval_str("{data:[],max_child:3,cmp:btree.default_compare}"));

  var order=max_child;
  var item_min=Math.floor(max_child/2);
  var item_max=item_min*2;
  var min_children=Math.ceil(max_child/2);

  var root=btree.__gen_node__();
  root.is_root=true;
  root.order=order;

  for (var i = 0; i < 1000; i++) {
    d1=data.shift();
    btree.add_element(root,d1);
  };

};

btree.add_element=function(root,d1){
  var d1,pos,new_items,f_items;
  var focused_node,current_data;

  focused_node=root;
  f_items=focused_node.items;

  pos=btree.__find_pos(f_items,d1);
  if(pos==="is a copy")
    throw f.trace_gen(pos);

  if(focused_node.is_leaf&&f_items.length<item_max){
    focused_node.items=btree.__insert_value_at_pos(f_items,pos,d1);
    return;
  } else if(focused_node.is_leaf&&f_items.length==item_max){
    focused_node.items=btree.__insert_value_at_pos(f_items,pos,d1);
    btree.__fix_excess__(focused_node,root.order);
  }
};

btree.__fix_excess__=function(nd,order){
  if(nd.is_root!==true){
    var mid=Math.floor(nd.items.length/2);
    var v_to_up=nd.items.unshift(min);

    var v_left=nd.items.slice(0,mid);
    var v_right=nd.items.slice(mid,nd.items.length-1);

    var new_left=btree.__gen_node__();
    var new_right=btree.__gen_node__();

    throw f.trace_gen("TODO");
    //btree.__put_in_i_array__(nd.parent.items,)
  }
  else{
    var new_root=btree.__gen_node__();
    new_root.is_leaf=false;
    delete root.is_root;
    root.parent=new_root;
    new_root.is_root=true;
    new_root.order=root.order;
    delete root.order;
    new_root.children.push(root);
    btree.__fix_excess__(root,v_to_up,root.order);
  }
};

btree.__gen_node__=function(){
  return {is_leaf:true,children:[],items:[]};;
}

btree.__branch_node=function(nd,v,order){
  var c_ranges=[],ind;
  var min_c=Math.ceil(order/2);
  var v_retain=[];
  var split_loc;
  for (var i = 0; i < min_c; i++) {
    ind=i*Math.floor(nd.items.length/min_c);

    split_loc=ind+nd.items.length/min_c;

    c_ranges.push(nd.items.slice(ind,split_loc-2));
    v_retain.push(nd.items.slice(ind+split_loc-1,ind+split_loc));
  };

  var first_and_last=function(arr){
    return [arr[0],arr[arr.length-1]];
  };

  var clisting;
  nd.items=[];
  nd.children=[];
  for (var i = 0; i < c_ranges.length; i++) {
    clisting={node:btree.__gen_node__(nd.level+1),range:v_retain[i]};
    clisting.node.items=c_ranges[i].slice();
    nd.children.push(clisting);
  };

};

btree.default_compare=function(a,b){
  if(typeof b==typeof 1)
    return (b-a);
  else if(typeof b==typeof "")
    return b.toLowerCase().charAt()-a.toLowerCase().charAt();
  else if(value in b && value in a)
    return btree.default_compare(b.value,a.value);
  else
    throw f.trace_gen("compare not implemented");
};

btree.__put_in_i_array__=function(items,new_item){
  var pos=__find_pos(items,new_item);

  return btree.__insert_value_at_pos(items,pos,new_item);
};

btree.__find_pos=function(items,new_item){
  for (var j = 0; j < items.length; j++) {
    if(cmp(new_item,items[j]))
      return "is a copy";
    if(cmp(new_item,items[j])<0){
      break;
    }
  };
  return j;
}
btree.__insert_value_at_pos=function(f_items,pos,d1){
  new_items=f_items.slice(0,pos).push(d1);
  new_items=new_items.concat(f_items.slice(pos,f_items.length));
  focused_node.items=new_items;
}

data_structures.btree=btree;
























data_structures.bst={};
data_structures.bst.make=function(o){
  if(f.is_array(o))o={emts:o};
  eval(f.opt_eval_str("{emts:[],cmp:f.qsort.compare,bst:{}}"));

  for(e in emts){
    data_structures.bst.add({e:emts[e],bst:bst,cmp:cmp});
  };
  return bst;
};

data_structures.bst.contains=function(o){
  eval(f.opt_eval_str("{e:undefined,bst:undefined,cmp:undefined}"));

  var focused_node=bst;
  for (var i = 0; i < 1000; i++) {
    if(focused_node===null)
      break;

    var compart=cmp(e,o.value);
    if(compart===0)
      return true;
    else if(compart<0)
      focused_node=bst.left;
    else if(compart>0)
      focused_node=bst.right;
  };
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