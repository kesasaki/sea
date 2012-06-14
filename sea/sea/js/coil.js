var spring_app = function(){

        /*     */
	this.Nodes = new Array();

	this.K = 2.0;   //	K　弾性係数
	this.L = 200.0; //	L　バネの自然長さ
	this.R = 5.0; //		R　反発係数



	this.AddNode = function(Node){
		var len = this.Nodes.length;
		this.Nodes[len] = Node;
	};

	// 全ノードの次ステップでの位置計算
	this.MoveAll = function(){
		var len = this.Nodes.length;
		var dt = 0.1; // 	タイムスパンコール
		
		for(var i = 0; i < len; i++){
			var spring_force = this.SpringForce(i);
			var repulsive_force = this.RepulsiveForce(i);
			this.MoveNode(i,spring_force,repulsive_force,dt);
		}
	};

	// 弾性力を計算
	this.SpringForce = function(nodeIndex){
		var spring_force = {sp_x:0.0, sp_y:0.0, sp_z:0.0};
		var curNode = this.Nodes[nodeIndex];
		

		for(var adjIndex = 0; adjIndex < curNode.adjacencyNodes.length; adjIndex++){
			var distX = curNode.x - curNode.adjacencyNodes[adjIndex].x;
			var distY = curNode.y - curNode.adjacencyNodes[adjIndex].y;
			var distZ = curNode.z - curNode.adjacencyNodes[adjIndex].z;
			var dist = Math.sqrt(distX*distX + distY*distY + distZ*distZ);
			var extend = dist - this.L;
			spring_force.sp_x += -this.K*extend*distX / dist;
			spring_force.sp_y += -this.K*extend*distY / dist;
		}
		return spring_force;
	};

	// 反発力
	this.RepulsiveForce = function(nodeIndex){
		var repulsice_force = {rp_x:0.0, rp_y:0.0, rp_z:0.0};
		var curNode = this.Nodes[nodeIndex];
		
		for(var allIndex = 0; allIndex < this.Nodes.length; allIndex++){
			if(allIndex != nodeIndex){				
				var distX = curNode.x - this.Nodes[allIndex].x;
				var distY = curNode.y - this.Nodes[allIndex].y;
				var distZ = curNode.z - this.Nodes[allIndex].z;
				var dist = Math.sqrt(distX*distX + distY*distY + distZ*distZ);
				repulsice_force.rp_x += this.R*distX / dist;
				repulsice_force.rp_y += this.R*distY / dist; 
				repulsice_force.rp_z += this.R*distZ / dist; 
			}
		}
		return repulsice_force;
	};
	
	this.MoveNode = function(nodeIndex,spring_force,repulsive_force,dt){
		this.Nodes[nodeIndex].x += dt*(spring_force.sp_x + repulsive_force.rp_x);
		this.Nodes[nodeIndex].y += dt*(spring_force.sp_y + repulsive_force.rp_y);
		this.Nodes[nodeIndex].z += dt*(spring_force.sp_z + repulsive_force.rp_z);
	};
/*
	this.LoadJson = function(url){
		var json = loadJson(url);
		var saveNode(json);
	};

	this.parse = function(json,nodes){
		for(key in json){
			new_key = index + ",0,0,0," + key;
			indexArray.push(index++);
			if(json[key] == null){
				SPRING_APP.AddNode({x:Math.random()*400, y:0.0, z:Math.random()*400, key, adjacencyNodes:[]});
			}else{
				SPRING_APP.AddNode({x:Math.random()*400, y:0.0, z:Math.random()*400, json[key], adjacencyNodes:[]});
			}
		}
		return nodes;
	};
*/
	this.getAdj = function(nodes){
		var adj = new Array;
		for(key in nodes){
			adj.push(key);
		}
		return implode(",",adj);
	};
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

var i = 0;
function addPosition(tree){
	var out = new Array();
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


function change(){
	

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





var SPRING_APP  = new spring_app();
var SPRING_APP_ = new spring_app();
var tree;

/* ロード時 */
function threeStart(){
	console.log("threeStart");
	initThree();
	initCamera();
	initScene();    
	initLight();

	tree = 
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
	console.log(makeJSON(tree));
	console.log("******************************");
	var temp = addPosition(tree);
	console.log(makeJSON(temp));

/*
	var json = loadJson("sample.json");
	var nodes = getNodes(json);
*/	SPRING_APP.AddNode({x:400.0, y:0.0, z:200.0, adjacencyNodes:[]});


	//SPRING_APP.LoadJson("sample.json");



	setInterval(makeNodeRandom, 10000); // 10秒おきにノード追加

	setInterval(loop, 100); // 0.1秒おきに描画
	//loop();
}

var index = 0;
function getNodes(json){
	var nodes = new Array();
	return parse(json,nodes);
}




function implode(delimiter,array){
	var str = "";
	for(var i = 0; i < array.length;i++){
		str += array[i];
		if(i+1 < array.length){
			str += delimiter;
		}
	}
	return str;
}

// ランダムに一個ノード選んでその近くに新しいノード作る
function makeNodeRandom(){
	var nodeIndex = Math.floor(Math.random() * SPRING_APP.Nodes.length);
	var x = SPRING_APP.Nodes[nodeIndex].x + Math.random();
	var y = SPRING_APP.Nodes[nodeIndex].y + Math.random();
	var z = SPRING_APP.Nodes[nodeIndex].z + Math.random();
	makeNode(nodeIndex,x,y,z);
}


// ノード一個作る
function makeNode(nodeIndex,px,py,pz){

	/*追加ノードの構成*/
	var addedNode = {
		x : px,
		y : py,
		z : pz,
	
		adjacencyNodes : [SPRING_APP.Nodes[nodeIndex]]
	};
	
	var adj_last = SPRING_APP.Nodes[nodeIndex].adjacencyNodes.length;
	
	/*アプリケーションオブジェクトにノードを追加*/
	SPRING_APP.AddNode(addedNode);	
	
	/*クリックされたノードの隣接ノードとして追加*/
	SPRING_APP.Nodes[nodeIndex].adjacencyNodes[adj_last] = addedNode;

/*  円と道を画面描画
	renderCircle(px,py,pz);
	renderLine(	px,
			py,
			pz,
			SPRING_APP.Nodes[nodeIndex].x,
			SPRING_APP.Nodes[nodeIndex].y,
			SPRING_APP.Nodes[nodeIndex].z	);
*/
}


var t=0;
function loop(){
  t++;
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( {x:0, y:0, z:0 } );



	for(var allIndex = 0; allIndex < SPRING_APP.Nodes.length; allIndex++){
		var curNode = SPRING_APP.Nodes[allIndex];
		var oldNode = SPRING_APP_.Nodes[allIndex];

		circle[allIndex].position.x += curNode.x - oldNode.x;
		circle[allIndex].position.y += curNode.y - oldNode.y;
		circle[allIndex].position.z += curNode.z - oldNode.z;
		panel[allIndex].position.x += curNode.x - oldNode.x;
		panel[allIndex].position.y += curNode.y - oldNode.y;
		panel[allIndex].position.z += curNode.z - oldNode.z;

		for(var adjIndex = 0; adjIndex < curNode.adjacencyNodes.length; adjIndex++){
			var adjNode = curNode.adjacencyNodes[adjIndex];
/*

			renderLine(	curNode.x,
					curNode.y,
					curNode.z,
					adjIndex.x,
					adjIndex.y,
					adjIndex.z );
*/
		}
	}

	renderer.clear();
	renderer.render(scene, camera);


	//window.requestAnimationFrame(loop);
	stats.update();

	SPRING_APP_ = SPRING_APP;
	SPRING_APP.MoveAll();
}

