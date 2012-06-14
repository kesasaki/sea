var Bookmarks = new Meteor.Collection("bookmarks");
var Mainpage = new Meteor.Collection("mainpage");
var Tree = new Meteor.Collection("tree");
Tree.insert({main : "", tree: ""});


if (Meteor.is_client) {
  Template.hello.greeting = function () {
    return "Welcome to the make tree.";
  };

  Template.hello.tree = function(){
      return Tree.find({},{sort : {url : 1 }});
  };

  
  function resultParse(tree,depth){
      var out = "<div class='offset2'>";
      for (var prop in tree){
	  if(tree[prop] === null){
	      return "<li>"+prop+"</li>"
	  }
	  if(depth == 0){
	      out += "<ul><span class='offset2 label'>"+prop+"</span></ul>";
	  }
	  else{
	      out += "<ul><strong>"+prop+"</strong>";
	  }
	  for(var i = 0 ; i < tree[prop].length ; i++){
	      out += resultParse(tree[prop][i],depth+1);
	  }
	  out += "</ul>";
      }
      out += "</div>";
      return out;
  }

  Template.hello.events = {
    'click #start' : function () {
      // template data, if any, is available in 'this'
	var url = $("#mainURL").val();
	$("#progress").css("width","50%");
	Meteor.call('analyze',url,function(err,res){
		var out = resultParse(res,0);
		$("#progress").css("width","90%");
		Tree.update({main: "" },{$set : {tree: out}});
		document.body.appendChild(Meteor.ui.render(function(){
			    $("#progress").css("width","100%");
			    return Tree.findOne({}).tree;
			}));
	    });
    }
  };


}


if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
	  Bookmarks.remove({});
	  Tree.remove({});
	  var bms = ["http://twitter.com"
		     ,"http://www.facebook.com"
		     ,"http://lewuathe.sakura.ne.jp"];
	  for(var i = 0 ; i < bms.length ; i++){
	      Bookmarks.insert({url : bms[i], point : Math.random()});
	  }
  });
  Meteor.methods({
	  'analyze' : function(url){
	      var tree = makeTree(url,1);
	      return tree;
	  }
  });
  function makeTree(url,depth){
      var source = Meteor.http.call('GET',url);
      var urls = source.content.match(/(\w+):\/\/([\w.]+)/g);
      var own = {};
      var childs = [];
      if(depth < 0 ){
	  own[url] = null;
	  return own;
      }
      for(var i = 0 ; i < urls.length ; i++){
	  var included = Bookmarks.find({url : urls[i]});
	  if(included.count() > 0){
	      var child = makeTree(urls[i],depth-1);
	      childs.push(child);
	  }
      }
      if(childs === []){
	  own[url] = null;
      }
      else{
	  own[url] = childs;
      }
      return own;
  }  
}