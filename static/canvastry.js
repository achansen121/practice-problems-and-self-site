







var shippos={x:20,y:20,r:0,size:40,speed:{x:0,y:0}};

var c=null;
var ctx=null;
var simg=null;
var w=null;
var h=null;
var rat=0;
var measureship=function(){
  w=simg.clientWidth;
  h=simg.clientHeight;
  rat=w/h;
  drawship();
}
var drawship=function(){
  ctx.save();
  var sw=rat*shippos.size;
  var sy=shippos.size;
  ctx.translate(shippos.x+sw,shippos.y+sy);
  ctx.rotate(shippos.r*Math.PI/180);
  ctx.drawImage(simg,sw/-2,sy/-2,sw,sy);
  ctx.restore();
};

var keymap={};



var keylist=[87,65,83,68];var act=[["f",-1],["r",-1],["f",1],["r",1]];
for (var i = 0; i < keylist.length; i++) {
  var w=keylist[i];
  keymap[w]={d:act[i][0],n:act[i][1]};
  if(keymap[w].d=="r")
    keymap[w].n*=1;
};
document.addEventListener("keydown",function(evt){
  var d=keymap[evt.keyCode];
  if(!d)
    return;
  if(!d.down){
    if(d.d=="r")
      d.intv=setInterval(function(){
        shippos[d.d]=(shippos.r+d.n+360)%360;
      },1);
    else
      d.intv=setInterval(function(){
        shippos.speed.x-=d.n*Math.sin(shippos.r*Math.PI/180);
        shippos.speed.y+=d.n*Math.cos(shippos.r*Math.PI/180);
      },1);
    d.down=true;
  }
},false);
document.addEventListener("keyup",function(evt){
  var d=keymap[evt.keyCode];
  if(!d)
    return;
  if(d.down){
    clearInterval(d.intv);
    delete d.intv;
    d.down=false;
  }
},false);


var altcontrols=function(){
  var keylist=[87,65,83,68];var act=[["y",-1],["x",-1],["y",1],["x",1]];
  for (var i = 0; i < keylist.length; i++) {
    var w=keylist[i];
    keymap[w]={d:act[i][0],n:act[i][1]};
  };
  document.addEventListener("keydown",function(evt){
    var d=keymap[evt.keyCode];
    if(!d)
      return;
    if(!d.down){
      d.intv=setInterval(function(){
        shippos.speed[d.d]+=d.n;
      },1);
      d.down=true;
    }
  },false);
  document.addEventListener("keyup",function(evt){
    var d=keymap[evt.keyCode];
    if(!d)
      return;
    if(d.down){
      clearInterval(d.intv);
      delete d.intv;
      d.down=false;
    }
  },false);
};


var friction=.98;


window.setTimeout(function(){
  var cfram=fn;
  setTimeout(function(){
    console.log(((fn-cfram)/5)+" frames/s");
  },5000);
},20000);

var fn=0;
var sint=window.setInterval(function(){
  fn++;
  shippos.x=(shippos.x+Math.round(shippos.speed.x*.05,-4)+c.width)%c.width;
  shippos.speed.x*=friction;
  shippos.y=(shippos.y+Math.round(shippos.speed.y*.05,-4)+c.height)%c.height;
  shippos.speed.y*=friction;
  ctx.clearRect(0,0,c.width,c.height);
  drawship();
},1);





var main=function(){
  document.body.style.margin="0";
  var dn=document.createElement("div");
  c=document.createElement("canvas");
  f.dqs("#everything").appendChild(dn)
  dn.appendChild(c);
  var x=600,y=400;
  c.height=y*2;
  c.width=x*2;

  c.style.display="block";
  c.style.border="1px solid black";
  c.style.maxWidth="100%";
  c.style.margin="0 auto";
  // c.style.minHeight="100%";
  x=c.innerWidth;
  y=c.innerHeight;

  ctx=c.getContext("2d");
  // ctx.beginPath();
  // ctx.arc(50,50,20,0,2*Math.PI);
  // ctx.stroke();

  simg=document.createElement("img");
  simg.id="shipsimg";
  simg.src="/static/img/trngl.svg";
  simg.style.position="absolute";
  simg.style.top="0";
  simg.style.left=simg.innerWidth+"px";
  simg.style.visibility="hidden";
  document.body.appendChild(simg);

  var whenloaded

  if(!simg.complete)
    simg.addEventListener("load",function(){
      measureship();
    },false);
  else{
    measureship();
  }
};

if(document.readyState!="complete")
  document.addEventListener("DOMContentLoaded",main,false);
else
  main();