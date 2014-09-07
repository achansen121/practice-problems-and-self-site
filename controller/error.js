


var j_str_prop=function(input,properties,indent){
  if(indent===undefined)indent=0;
  if(indent>10)
    return JSON.parse(input);
  var out="";var p;
  var keys=Object.keys(input);

  for (i in properties) {
    p=properties[parseInt(i)];
    for (var j = 0; j < indent; j++) {
      out+=" ";
    };
    if(true&&typeof input[p]=="object"&&Object.keys(input[p]).length>0)
      out+=p+":\n"+j_str_prop(input[p],Object.keys(input[p]),indent+2);
    else
      out+=p+":"+JSON.stringify(input[p]);
    out+="\n"
  };
  return out;
};



var error_controller=function(req,res,misc){
  var status=misc.status,errtxt=misc.errtxt;suppress=misc.suppress;
  if(!status)
    status=500;
  if(!errtxt)
    errtxt="Error";
  if(!suppress)
    suppress=false;
  try{
    res.writeHead(status,{"Content-Type":"text/plain"});}
  catch(e){
    console.error([req,res]);
  }

  if(!suppress)
    console.trace();

  res.write(j_str_prop(req,["url","method","headers"]));
  res.write(errtxt);
  res.end();
};


module.exports=error_controller;
