(function(g){

var simple={};

if(g.f===undefined)
  throw new Error("eff");
else
  g.f.simple=simple;

simple.str_to_array=function(str_in){
  return str_in.split("");
};

simple.array_to_str=function(arr){
  return arr.join("");
};

simple.in_place_reverse=function(instr){
  instr=simple.str_to_array(instr);
  for (var i = 0; i < Math.floor(instr.length/2); i++) {
     var temp=instr[i];
     instr[i]=instr[instr.length-1-i];
     instr[instr.length-1-i]=temp;
  };
  return simple.array_to_str(instr);
};


simple.bubble_sort=function(o){
  if(f.is_array(o))o={ul:o};
  eval(f.opt_eval_str("{ul:[],cmp:simple.bubble_sort.compare,timeout:100000}"));

  var failed;
  var swp=simple.bubble_sort.swap;
  for(var j=0;j<timeout;j++){
    failed=false;
    for (var i = 0; i < ul.length-1; i++) {
      if(cmp(ul[i],ul[i+1])<0){
        failed=true;
        swp(ul,i,i+1);
      };
    };
    if(!failed)
      break;
  };
  if(j===timeout)
    throw f.trace_gen("bubble_sort timeout");
};

simple.bubble_sort.compare=function(a,b){
  return b-a;
};

simple.bubble_sort.swap=function(arr,a,b){
  var temp=arr[a];arr[a]=arr[b];arr[b]=temp;
};

simple.parse_int=function(str_in){
  var iout=null;var c,n;
  var i_code="0".charCodeAt(0);
  var sign=1;var start=0;

  if(str_in.charCodeAt(0)==="-".charCodeAt(0)){
    sign=-1;start=1;}

  for (var i = start; i < str_in.length; i++) {
    c=str_in.charCodeAt(i);
    if(c<i_code||c>i_code+10){
      throw f.trace_gen("not an int");
    }
    n=c-i_code;
    if(iout===null)
      iout=n;
    else
      iout=10*iout+n;
  };
  return iout*sign;
};

simple.i_to_str=function(num){
  var s_out="";var mod;
  pnum=Math.abs(num);

  var n_c="0".charCodeAt(0);

  for (var i = 0; i < 1000; i++) {
    mod=pnum%10;
    s_out=String.fromCharCode(n_c+mod)+s_out;
    pnum=Math.floor(pnum/10);
    if(pnum===0)
      break;
  };
  if(num<0){
    s_out="-"+s_out;}
  return s_out;
};

simple.linked_list={};
simple.linked_list.gen=function(arr){
  var ll=null;
  for (var i = arr.length-1; i >= 0; i--) {
     if(ll===null)
      ll={next:null,value:arr[i]};
    else
      ll={next:ll,value:arr[i]};
  };
  return ll;
};

simple.linked_list.reverse=function(ll){
  var pl=null,nl,timeout=1000;
  for (var i = 0; i < timeout; i++) {
    if(ll==null)
      break;
    nl=ll.next;
    ll.next=pl;
    pl=ll;
    ll=nl;
  };
  if(i>=timeout)
  return pl;
};


var promises={};
var __promises={};


var __load_dictionary_prev_promise=null;

simple.load_dictionary=function(){
  if(!(__load_dictionary_prev_promise!=null)){
    var xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
      if(this.readyState==4){
        try{
          simple.dictionary=this.responseText.split("\r\n");
          if(simple.dictionary.length==1)
            simple.dictionary=this.responseText.split("\n");

          __load_dictionary_prev_promise.pvt.finish(true);
        } catch(e){
          __load_dictionary_prev_promise.pvt.finish(false);
          throw e;
        }
      };
    };
    xhr.open("GET","/static/data/words-en.txt?v="+window.jsfilemtime["/static/data/words-en.txt"]);
    xhr.send();
    var prm=simple.make_promise("dictionary");
    __load_dictionary_prev_promise=prm;
  };
  return __load_dictionary_prev_promise.pbc;
};

simple.test_dict=function(){
  var all_keys=Object.keys(simple.dictionary);
  for (var i = 0; i < all_keys.length; i++) {
    if(all_keys[i]==="carport")
      console.log("carport");
    if(!(all_keys[i] in simple.dictionary)){
      console.log(all_keys[i]+" missing");
      break;}
  };
}

simple.wrd_cmp=function(wrd1,wrd2){
  wrd1=wrd1.toLowerCase().trim();
  wrd2=wrd2.toLowerCase().trim();

  for (var i = 0; i < wrd1.length&&i<wrd2.length; i++) {
    var c1=wrd1.charCodeAt(i);
    var c2=wrd2.charCodeAt(i);

    if(c1!=c2)
      return c2-c1;
  };
  return wrd2.length-wrd1.length;
};

simple.in_dict=function(wrd,display){
  if(!simple.dictionary)
    throw new Error("need dictionary");

  var cmp=simple.wrd_cmp;var comp;
  var left=0;var right=simple.dictionary.length;
  var c_index=Math.floor((left+right)/2);
  var prev;
  for (var i = 0; i < 1000; i++) {
    prev=c_index;
    d_wrd=simple.dictionary[c_index];
    comp=cmp(d_wrd,wrd);
    if(display)
      console.log(d_wrd,c_index,comp);
    if(comp==0)
      return true;
    else if(comp>0){
      left=c_index;
    }
    else if(comp<0){
      right=c_index;
    }
    c_index=Math.floor((right+left)/2);
    if(c_index===prev)
      return false;
  };
  return false;
}

simple.make_promise=function(name){
  if(name in promises){
    return {pvt:promises[name],pbc:__promises[name]};
  }
  __promises[name]={status:"pending",callback_list:[],data:null,finish:function(input){
      var fnc;
      this.status="done";
      this.data=this.input;
      for(var i=0;i<10000&&this.callback_list.length>0;i++){
        fnc=this.callback_list.pop(0);
        fnc(this.data);
      };
    }
  };
  promises[name]={status:function(){return __promises[name].status;},
    on_done:function(cback){
      if(__promises[name].status!=="done")
        __promises[name].callback_list.push(cback);
      else
        cback(__promises[name].data);
    }
  };
  return {pvt:__promises[name],pbc:promises[name]};
};

simple.telewords=function(t_number){
  if(typeof t_number!=="string")
    throw new Error("should be a string");

  var tmp=simple.telewords.reverse_map;
  var possible_letters=[];
  for (var i = 0; i < t_number.length; i++) {
    var num=t_number[i];
    if(num==="-")
      continue;
    else if(isNaN(num))
      throw new Error(num+" not a number");

    var lmap=simple.telewords.map[parseInt(num)].toString();
    if(lmap!="")
      possible_letters.push(lmap);
  };

  if(possible_letters.length>10)
    throw new Error("too long");

  var words=[];var n_poss=0;var sample=[];
  for (var i = 0; i < 100000; i++) {
    var num_to_try=i;
    var w_try="";
    for (var j = 0; j < possible_letters.length; j++) {
      var s_ln=possible_letters[j].length;
      var clet=(num_to_try%s_ln);
      num_to_try=Math.floor(num_to_try/s_ln);
      w_try+=possible_letters[j][clet];
    };
    if(num_to_try!=0)
      break;

    n_poss+=1;
    if(Math.random()<1/(n_poss+1)||w_try=="carport")
      sample.push(w_try);
    if(simple.in_dict(w_try))
      words.push(w_try);
  };
  if(i==100000)
    throw new Error("timeout");
  return words;
};

simple.telewords.map=["","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"];
simple.telewords.reverse_map={};
(function(){
  for (var i = 0; i < simple.telewords.map; i++) {
    var tsr=simple.telewords.map[i];
    for (var j = 0; j < m.length; j++) {
      simple.telewords.reverse_map[m[j]]=i;
    };
  };
})();


})(window);