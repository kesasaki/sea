var Bookmarks = new Meteor.Collection("bookmarks");
var Mainpage = new Meteor.Collection("mainpage");

if (Meteor.is_client) {
    var tree = {};
  Template.hello.greeting = function () {
    return "Welcome to makeTree.This is http tree making app";
  };

  Template.hello.display_tree = function(){
      var out = "";
      for( prop in tree ) {
	  out += tree[prop]+"<br>";
      }
      return out;
  }
  Template.hello.events = {
    'click #start' : function () {
      // template data, if any, is available in 'this'
	var url = $("#mainURL").val();
	Meteor.call('analyze',url,function(err,res){
		tree = JSON.stringify(res);
		alert(tree);
	    });
    }
  };

  


  Template.getUrlParam.geturl = function () {
      var query = window.location.search.substring(1);
      var params = query.split('&');
      if(params == ""){
	  Mainpage.update({},{url : ""});
      }
      for(var i = 0 ; i < params.length ; i++){
	  var pos = params[i].indexOf('=');
	  if(pos > 0){
	      var key = params[i].substring(0,pos);
	      var val = params[i].substring(pos+1);
	      Mainpage.update({},{url : val});
	  }
      }

  }
}


if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
	  Bookmarks.remove({});
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
      var childs = [];
      var own = {};
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
      if(child === []){
	  own[url] = null;
      }
      else{
	  own[url] = childs;
      }
      return own;
  }  
}