var last_resize=(new Date()).getTime();
var last_resize_timer=null;
var gb=f.dqs("#goboard");

var resize_delay=1000;

var gbresize=function(){
var npossible=last_resize+resize_delay-((new Date()).getTime());

if(npossible>0)
  return setTimeout(gbresize,npossible+2);

last_resize=(new Date()).getTime();


var p=function(obj){
  return obj.parentNode;
};
var ch=function(obj){
  return obj.clientHeight;
}
var cw=function(obj){
  return obj.clientWidth;
};

var argt=function(w,x,y,z){
  return w(z[x],z[y]);
};

var height_margin=function(nd){
  return parseInt(document.defaultView.getComputedStyle(nd, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(nd, '').getPropertyValue('margin-bottom'));
};

var nh=argt(Math.min,"clientHeight","clientWidth",p(gb));

var mh=height_margin(p(gb));
 
var gh=window.innerHeight-f.dqs("#header").clientHeight-f.dqs("#navbar").clientHeight-mh;

gb.style.height=(gh)+"px";
gb.style.width=(gh)+"px";
};

var show_potential_move=function(nd,color){
  if(nd.has_move)
    return false;
  var img=document.createElement("div");
  img.className="potential_move "+color;
  nd.appendChild(img);
  nd.has_move=true;
  var finalize=function(evt){
    f.preventDefault(evt);
    img.className=(" "+img.className+" ").replace(/ potential_move /," actual_move ").trim();
    img.removeEventListener("click",finalize,false);
    current_color.swap();
  };
  img.addEventListener("click",finalize,false);
};
var hide_potential_move=function(nd){
  for (var i = 0; i < nd.childNodes.length; i++) {
    if(/ potential_move /.test(" "+nd.childNodes[i].className+" ")){
      nd.removeChild(nd.childNodes[i]);
      delete nd.has_move;
      break;
    }
  };
}
var current_color={v:"white",
  swap:function(){
    if(this.v=="white")
      this.v="black";
    else
      this.v="white";
  }
};

var gb_set_up_hover=function(){
  var gr=gb.childNodes[0];

  for (var i = 0; i < gr.childNodes.length; i++) {
    for (var j = 0; j < gr.childNodes[i].childNodes.length; j++) {
      var cn=gr.childNodes[i].childNodes[j];
      cn.addEventListener("mouseenter",function(evt){
        show_potential_move(this,current_color.v);
      },false);
      cn.addEventListener("mouseleave",function(){
        hide_potential_move(this);
      },false);
    };
  };

};
var gb_set_up_resize=function(){
  gbresize();
  f.ael(window,"resize",function(){
    last_resize=(new Date()).getTime();
    if(last_resize_timer)
      clearTimeout(last_resize_timer);
    last_resize_timer=setTimeout(function(){
      gbresize();
    },resize_delay);
  });
};

f.ael(window,"load",function(){
  gb_set_up_resize();
  gb_set_up_hover();
});


