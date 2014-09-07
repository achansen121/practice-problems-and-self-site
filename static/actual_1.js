//list of strings into 

(function(g){

  var a={};
  g.f.actual_1=a;

  a.serialize=function(in_list){
    var delimiter;

    delimiter=",";

    var out="";
    for(i in in_list){
      var s=in_list[i];
      s=s.replace(new RegExp(/-/g),"--",s);
      out+=s.replace(new RegExp(/,/g),"-,",s)+delimiter;
    }
    return out;
  };

  a.serialize_better=function(in_list){
    var out_str="";
    for (var i = 0; i < in_list.length; i++) {
      out_str+=in_list[i].length.toString();
      out_str+=",";
    };
    out_str+="]";
    for (var i = 0; i < in_list.length; i++) {
      out_str+=in_list[i];
    };
    return out_str;
  };

  a.deserialize_better=function(in_str){
    var out_list=[];

    var lengths=/^([\d+,]{0,})\](.*)/.exec(in_str);

    if(!lengths)
      throw new Error("need lengths");

    var rest_of_str=lengths[2];

    lengths=lengths[1].substring(0,lengths[1].length-1);
    lengths=lengths.split(",");

    var current_index=0;
    for (var i = 0; i < lengths.length; i++) {
      l=parseInt(lengths[i]);
      out_list.push(rest_of_str.substring(current_index,current_index+l));
      current_index=current_index+l;
    };
    return out_list;
  };

  a.deserialize=function(in_str){
    var out_list=[];
    var last_push=0;
    for(var i=0;i<in_str.length;i++){
      if(",".charCodeAt()==in_str.charCodeAt(i)){
        var dash_count=0;
        for(var j=1;j<i;j++){
           if(in_str.charCodeAt(i-j)=="-".charCodeAt())
             dash_count++;
           else
             break;
        }
        if(dash_count%2==0){
         var s_out=in_str.substring(last_push,i);
         s_out=s_out.replace(/-,/g,",",s_out);
         s_out=s_out.replace(/--/g,"-",s_out);
         out_list.push(s_out);
         last_push=i+1;
        }
      }
    }
    return out_list;
  };

})(window);