var Bookmarks = new Meteor.Collection("bookmarks");
var Mainpage = new Meteor.Collection("mainpage");

if (Meteor.is_client) {
  Template.hello.greeting = function () {
    return "Welcome to makeTree.";
  };

  Template.hello.events = {
    'click input' : function () {
      // template data, if any, is available in 'this'
	var url = Mainpage.findOne({}).url;
	Meteor.call('analyze',url,function(err,res){
		alert(res);
	    });
    }
  };
  
  Template.resultArea.urls = function(){
      return "None";
  }

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
	  var bms = ["http://www.google.com"
		     ,"http://www.yahoo.co.jp"
		     ,"http://www.gree.co.jp"];
	  for(var i = 0 ; i < bms.length ; i++){
	      Bookmarks.insert({url : bms[i], point : Math.random()});
	  }
  });
  Meteor.methods({
	  'analyze' : function(url){
	      var tree = makeTree(url);
      	      return tree;
	  }
  });
  function makeTree(url){
      var source = Meteor.http.call('GET',url);
      var urls = result.content.match(/(\w+):\/\/([\w.]+)\/(\S*)/g);
      var childs = [];
      var own = {};
      for(var i = 0 ; i < urls.length ; i++){
	  var included = Bookmarks.find({url : urls[i]});
	  if(included.count){
	      var child = makeTree(urls[i]);
	  }
	  childs.push(child);
      }
      if(!child){
	  own[url] = null;
      }
      else{
	  own[ur] = childs;
      }
      return own;
  }
  
}