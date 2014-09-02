(function(g){

var algo={};

if(g.f===undefined)
  throw new Error("eff");
else
  g.f.algo=algo;

algo.qsort=function(arr,compare){
  if(compare===undefined)
    compare=this.qsort.compare;
  var min=0;var max=arr.length-1;
  var todolist=[];
  todolist.push([min,max]);

  while(todolist.length>0){
    var task=todolist.shift();
    var min=task[0];var max=task[1];
    var ploc=algo.qsort.split_on_pivot(arr,min,max,compare);
    if(ploc!=min&&ploc-1!=min){
      todolist.push([min,ploc-1]);
    }
    if(ploc!=max&&ploc+1!=max)
      todolist.push([ploc+1,max]);
  };
  
  return arr;
};
algo.qsort.split_on_pivot=function(arr,min,max,compare){
  var n=1;
  var r=.45+(0.05*algo.qsort.rand_int(3));
  var pivotindex=min+Math.floor(r*((max-min)+1));
  var pivotval=arr[pivotindex];
  this.swap(arr,pivotindex,max);


  var storeindex=min;
  for (var i = min; i < max; i++) {
    var cr=compare(arr[i],pivotval);
    if(cr<0){
      this.swap(arr,i,storeindex);
      storeindex+=1;}
  };
  this.swap(arr,storeindex,max);
  return storeindex;
};
algo.qsort.split_on_pivot_2=function(arr,min,max,cmp){
  var n=1;
  var r=.45+(0.05*algo.qsort.rand_int(3));
  var pivotindex=min+Math.floor(r*((max-min)+1));
  var pivotval=arr[pivotindex];
  var i=min;var j=max;
  var found;

  var toolong=10*arr.length;
  var check_toolong=function(){
    if(toolong==0)
      throw f.trace_gen("toolong");
    else
      toolong--;
  };
  console.log(pivotval+"pivotval");
  console.log(arr);
  for(;i<=j;){
    found=true;
    for(;cmp(arr[i],pivotval)<0;){
      i++;
      check_toolong();
    }
    for(;cmp(arr[j],pivotval)>0;){
      j--;
      check_toolong();
    }
    if(i<=j){
      this.swap(arr,i,j);
      i++;
      j--;
    }
    check_toolong();
    console.log(arr,i,j,min,max);
  }
  console.log(Math.min(i,max)+"pindex");
  return Math.min(i,max);

  return storeindex;
};



algo.__generic_sort_benchmark__=function(n,name){
  if(n==undefined)n=1000;
  var t=algo[name].gentestlist(n);
  var astart=new Date();
  t.b.sort(algo[name].compare);
  var aend=new Date();
  var mstart=new Date();
  if(name=="qsort")
    algo[name](t.a);
  else if(name=="msort")
    t.a=algo[name](t.a);
  var mend=new Date();
  console.log("I took "+(mend.getTime()-mstart.getTime())+"ms");
  console.log("Array took "+(aend.getTime()-astart.getTime())+"ms");

  algo.__generic_sort_benchmark__.last_bench=t.b;
  algo.__generic_sort_benchmark__.last_result=t.a;

  if(t.a==undefined)
    throw f.trace_gen("no array generated");

  for (var i = 0; i < n; i++) {
    if(!(i in t.a)||t.b[i]!=t.a[i]){
      console.log("Match failure at index "+i);
      break;
    }
  };
  return t;
};
algo.qsort.benchmark=function(n){
  return algo.__generic_sort_benchmark__(n,"qsort");
};
algo.qsort.rand_int=function(n){
  var r=algo.qsort.rand_int.leftover;
  if(r.used*n>=Math.pow(10,17)){
    r.used=1;
    r.n=Math.random();}
  r.n*=n;
  r.used*=n;
  var new_rand=Math.floor(r.n);
  r.n=r.n%1;
  return new_rand;
};
algo.qsort.rand_int.leftover={n:1,used:Math.pow(10,17)}

algo.qsort.gentestlist=function(n){
  if(n==undefined)
    n=10;
  var a=[];var b=[];var c=[];
  for (var i = 0; i < n; i++) {
    var v=parseInt(Math.random()*n);
    a.push(v);b.push(v);c.push(v);
  };
  return {a:a,b:b,c:c};
};
algo.qsort.compare=function(lv,rv){
  if(lv<rv)
    return -1;
  else if(lv==rv)
    return 0;
  else
    return 1;
};
algo.qsort.swap=function(a,i,j){
  var tmp=a[i];
  a[i]=a[j];a[j]=tmp;
};
algo.msort=function(arr,compare){
  x=0;y=arr.length-1;
  if(compare==undefined)
    compare=algo.msort.compare;
  if(y-x==0)
    return arr;
  if(y-x==1){
    if(compare(arr[x],arr[y])>0){
      algo.msort.swap(arr,x,y);
    }
    return arr;
  } else{
    var lx=x;
    var ly=f.avg(x,y);
    var rx=f.avg(x,y);
    var ry=y+1;
    //console.log("x"+x+",y"+y,"lx"+lx+",ly"+ly,"rx"+rx+",ry"+ry);
    var larray=algo.msort(arr.slice(lx,ly),compare);
    var rarray=algo.msort(arr.slice(rx,ry),compare);

    if(arr.length!=larray.length+rarray.length){
      console.log(larray,rarray);
      console.log(arr);
      throw f.trace_gen("missing elements");}
    
    var narray=[];
    var cl=0,cr=0;
    var lx=0,ly=larray.length-1;
    var rx=0,ry=rarray.length-1;

    var add_from_left=function(){
      narray.push(larray[cl]);cl+=1;
    };
    var add_from_right=function(){
      narray.push(rarray[cr]);cr+=1;
    };
    var max_l=1/0;

    for (var i = 0; i < max_l; i++) {
      if(cl<=ly&&cr<=ry){
        if(compare(larray[cl],rarray[cr])<=0){
          add_from_left();
        } else{
          add_from_right();
        }
      }else if(cl<=ly){
        add_from_left();
      } else if(cr<=ry){
        add_from_right();
      } else
        break;
    };
    if(narray.length!=larray.length+rarray.length)
      throw f.trace_gen("missing elements");
    if(i>=max_l)
      throw f.trace_gen("max loop");

    return narray;
    for (var li = lx,ri=rx,i=0;(li<ly||ri<ry)&&i<2*arr.length; i++) {
      var ali=(li < liwrapsunder ? rx+li : li);
      if(arr[ri]==undefined||compare(arr[li],arr[ri])<0){
        li+=1;
      } else {
        algo.msort.swap(arr,li,ri);
        liwrapsunder+=1;
        ri+=1;
      }
    };
    return;
  }

};
algo.msort.compare=algo.qsort.compare;algo.msort.swap=algo.qsort.swap;algo.msort.gentestlist=algo.qsort.gentestlist;

algo.msort.benchmark=function(n){
  return algo.__generic_sort_benchmark__(n,"msort");
};
})(window);