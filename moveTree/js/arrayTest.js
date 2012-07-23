

var i = 0;
function addPosition(tree){
	var out = new Array();
	for(var prop in tree){
		console.log(prop);
		if(tree[prop] === null){
			out[i + "b0b" + i++ + "b"+prop] = null;
		}
		else { 
			out[i + "a0a" + i++ + "a"+prop] = addPosition(tree[prop]);
		}
	}
	return out;
}

  function resultParse(tree,depth){
      var out = "<div class='offset2'>";
      for (var prop in tree){
	  if(tree[prop] === null){
	      return "<li>"+prop+"</li>";
	  }else if(depth == 0){
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


var points;
function parse(tree){
	points = new Array();
	aa(tree);
	return points;
}

function aa(tree){
	for(var prop in tree){
		var arr = prop.split(",");
		points[arr[3]] = {x:arr[0],y:arr[1],z:arr[2],adjacencyNodes:[]};
		points[arr[3]].adjancyNodes = new Array();
		if(tree[prop] === null){
			return {x:arr[0],y:arr[1],z:arr[2],adjacencyNodes:[]};
		}else{
			//for(var i = 0; i<tree[prop].length; i++){
			for(var i in tree[prop]){
				console.log("++"+tree[prop].length +" "+i +" "+prop );
				points[arr[3]].adjacencyNodes.push(aa(tree[prop][i]));
			}
			return {x:arr[0],y:arr[1],z:arr[2],adjacencyNodes:[]};
		}
	}
}

function showww(arr,depth){
	var result = "";
	for(var prop in arr){
		var str = "";
		for(var i=0; i<depth; i++){
			str += "&nbsp;";
		}
		if(typeof arr[prop] == "object"){
			result += str + showww(arr[prop],depth+1) + "<br>";
		}else{
			result += str + arr[prop] + "<br>";
		}
	}
	return result;
}
/*
*
*	tree 入力木　addPositionで生成された座標付きの木
*
*	nodes 出力配列　spring_appで使われる座標の配列
*
*
*/
var i = 0;
function makeNodes(tree,nodes){
	var out = {x:400.0, y:0.0, z:200.0, adjacencyNodes:[]}
	for(var prop in tree){
		if(tree[prop] === null){
			out[i + ",0," + i++ + ","+prop] = null;
		}
		else{ 
			out[i + ",0," + i++ + ","+prop] = addPosition(tree[prop]);
		}
	}
	return out;
}





function makeJSON(hash){
	var init = true;
	var str = '{';
	for(var i in hash){
		if(!init) str += ',';
		str += '"' + i.replace('"', '\\"', 'g') + '":';
		switch(typeof hash[i]){
			case 'object':
			str += makeJSON(hash[i]);
			break;

			case 'function':
			str += hash[i].toString();
			break;

			default:
			str += '"' + hash[i].toString().replace('"', '\\"', 'g') + '"';
		}
		init = false;
	}
	str += '}';
	return str;
}
/*

var b = {"http://aaa":{x:1, y:2, z:3, adjacencyNodes:{
     "http://aaa":{x:1, y:2, z:3, adjacencyNodes:{}},
     "http://aaa":{x:1, y:2, z:3, adjacencyNodes:{}},
     "http://aaa":{x:1, y:2, z:3, adjacencyNodes:{}}
 }}}
function addPosition(hash){
	var init = true;
	var temp = new Array();

	for(var i in hash){
		//if(!init) str += ',';
		str += '"' + i.replace('"', '\\"', 'g') + '":';
		switch(typeof hash[i]){
			case 'object':
			str += makeJSON(hash[i]);
			break;

			case 'function':
			str += hash[i].toString();
			break;

			default:
			str += '"' + hash[i].toString().replace('"', '\\"', 'g') + '"';
		}
		init = false;
	}
	str += '}';
	return str;
}
*/


	var tree = 
	{ "http://yahoo.co.jp" : 
	  { "http://search.yahoo.co.jp" : null 
	  , "http://shopping.yahoo.co.jp" : null
	  , "http://travel.yahoo.co.jp" : 
	    { "http://domestic.hotel.travel.yahoo.co.jp/" : null
	    , "http://domestic.tour.travel.yahoo.co.jp/" : null
	    , "http://travel.yahoo.co.jp/domestic_dp/" : 
	      { "https://rps.atour.ana.co.jp/adam/internet/" : null }
	    }
	  }
	};
	var res = {'http://lewuathe.sakura.ne.jp': [
			{'http://lewuathe.sakura.ne.jp': [
				{'http://lewuathe.sakura.ne.jp': [
					{'http://lewuathe.sakura.ne.jp': [
						{'http://lewuathe.sakura.ne.jp': null},
						{'http://www.facebook.com': null}
					]}, 
					{'http://www.facebook.com': null}
				]}, 
				{'http://www.facebook.com': null}
			]}, 
			{'http://www.facebook.com': null}
		]};

	var positions = {'100,0,300,http://lewuathe.sakura.ne.jp': [
			{'200,0,300,http://lewuathe.sakura.ne.jp': [
				{'300,0,300,http://lewuathe.sakura.ne.jp': [
					{'400,0,300,http://lewuathe.sakura.ne.jp': [
						{'500,0,300,http://lewuathe.sakura.ne.jp': null},
						{'500,0,500,http://www.facebook.com': null}
					]}, 
					{'400,0,500,http://www.facebook.com': null}
				]}, 
				{'300,0,500,http://www.facebook.com': null}
			]}, 
			{'200,300,500http://www.facebook.com': null}
		]};






	var out = resultParse(positions,2);
document.write(out);
document.write("<br>*******************<br>");
//	var temp = addPosition(res);
//document.write(resultParse(temp,2));
//document.write("<br>*******************<br>");
	var temp2 = parse(positions);
console.log(temp2.toString());
document.write(showww(temp2,0));

