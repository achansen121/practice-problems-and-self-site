var process=require("child_process");
var exec=process.execFile;var fork=process.fork;var spawn=process.spawn;delete process;



var elist=",modify,create,delete,moved_to,moved_from".split(",").join(",-e,").split(",");
var args=["-r","-m"].concat(elist).concat(["."]);

for (var i = 0; i < args.length; i++) {
  console.log(args[i]);
};

var iw=spawn("inotifywait",args);


iw.stdout.on("data",function(d){
  console.log(d.toString());
});


iw.stderr.on("data",function(d){
  console.log(d.toString());
});

