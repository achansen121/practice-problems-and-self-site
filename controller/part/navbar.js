var navlink=function(ltxt,href){
  return {
    tag:"a",
    className:"navlink",
    href:href,
    cn:[
      {
        tag:"div",
        cn:[ltxt]
      }
    ]
  };
};


var navbar={
  tag:"div",
  id:"navbar",
  cn:[
    navlink("Home","/"),
    navlink("Extensions","/extgc"),
    navlink("Go","/go"),
    navlink("",""),
    navlink("",""),
  ]

};

module.exports=navbar;