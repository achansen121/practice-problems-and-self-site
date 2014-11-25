




var amap={
  tag:function(d,attr,node,val){},
  default:function(d,attr,node,val){
    node[attr]=val;
  },
  style:function(d,attr,node,val){
    if(typeof val==typeof ""){
      node.setAttribute(attr,val);
    } else if(typeof val==typeof {}){
      for(k in val){
        node[attr][k]=val[k];
      }
    }
  },
  cn:function(d,attr,node,val){
    for (var i = 0; i < val.length; i++) {
      node.appendChild(genhtml(d,val[i]));
    };
  }
};







var genhtml=function(d,sk){
  if(typeof sk==typeof "")
    return d.createTextNode(sk);
  var new_node=d.createElement(sk.tag);
  
  for (k in sk) {
    var fnc=amap[k]||amap["default"];
    fnc(d,k,new_node,sk[k]);
  };
  return new_node;
}

module.exports=genhtml;