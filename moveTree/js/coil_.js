var spring_app = function(){

        /*     */
	this.Nodes = new Array();

	this.K = 2.0;   //	K�@�e���W��
	this.L = 200.0; //	L�@�o�l�̎��R����
	this.R = 5.0; //		R�@�����W��


/*
	this.AddNode = function(Node){
		var len = this.Nodes.length;
		this.Nodes[len] = Node;
	};
*/

	this.AddNode = function(URL,Node){
		this.Nodes[URL] = Node;
	
	};

/*
	// �S�m�[�h�̎��X�e�b�v�ł̈ʒu�v�Z
	this.MoveAll = function(){
		var len = this.Nodes.length;
		var dt = 0.1; // 	�^�C���X�p
		
		for(var i = 0; i < len; i++){
			var spring_force = this.SpringForce(i);
			var repulsive_force = this.RepulsiveForce(i);
			this.MoveNode(i,spring_force,repulsive_force,dt);
		}
	};
*/

	// �S�m�[�h�̎��X�e�b�v�ł̈ʒu�v�Z
	this.MoveAll = function(){
		var dt = 0.1; // 	�^�C���X�p��
		
		for(var i in this.Nodes){
			var spring_force = this.SpringForce(i);
			var repulsive_force = this.RepulsiveForce(i);
			this.MoveNode(i,spring_force,repulsive_force,dt);
		}
	};


	

	// �e���͂��v�Z
	this.SpringForce = function(URL){
		var spring_force = {sp_x:0.0, sp_y:0.0, sp_z:0.0};
		var curNode = this.Nodes[URL];
		

		for(var adjIndex in curNode.adjacencyNodes){
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





/*
	// �e���͂��v�Z
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
*/



	// ������
	this.RepulsiveForce = function(URL){
		var repulsice_force = {rp_x:0.0, rp_y:0.0, rp_z:0.0};
		var curNode = this.Nodes[nodeIndex];
		
		for(var allIndex in this.Nodes){
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




/*
	// ������
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
*/


	
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

/*
	this.getAdj = function(nodes){
		var adj = new Array;
		for(key in nodes){
			adj.push(key);
		}
		return implode(",",adj);
	};
*/


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
	  for(var i in tree[prop]){
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


/*
*
*	tree ���͖؁@addPosition�Ő������ꂽ���W�t���̖�
*
*	nodes �o�͔z��@spring_app�Ŏg������W�̔z��
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

	var positions = {'100,300,300,http://lewuathe.sakura.ne.jp': [
				{'200,300,300,http://mixi.jp/': [
					{'300,300,300,https://twitter.com/': [
						{'400,300,300,https://www.google.co.jp/': [
							{'500,300,300,http://www.yahoo.co.jp/': null},
							{'500,500,500,http://www.facebook.com': null}
						]}, 
						{'400,500,500,http://www.amazon.co.jp/': null}
					]}, 
					{'300,500,500,http://www.2ch.net/': null}
				]},
				{'200,300,500,http://dka-hero.com/top.html': null}
			]};

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





var SPRING_APP  = new spring_app();
var SPRING_APP_ = new spring_app();
var tree;

/* ���[�h�� */
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
	console.log("******************************");
	
	var nodes = new Array();
	var temp2 = makeNodes(temp,nodes);
	console.log(makeJSON(temp2));
	

/*
	var json = loadJson("sample.json");
	var nodes = getNodes(json);
*/	SPRING_APP.AddNode({x:400.0, y:0.0, z:200.0, adjacencyNodes:[]});


	//SPRING_APP.LoadJson("sample.json");



	setInterval(makeNodeRandom, 10000); // 10�b�����Ƀm�[�h�ǉ�

	setInterval(loop, 100); // 0.1�b�����ɕ`��
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

// �����_���Ɉ�m�[�h�I��ł��̋߂��ɐV�����m�[�h���
function makeNodeRandom(){
	var nodeIndex = Math.floor(Math.random() * SPRING_APP.Nodes.length);
	var x = SPRING_APP.Nodes[nodeIndex].x + Math.random();
	var y = SPRING_APP.Nodes[nodeIndex].y + Math.random();
	var z = SPRING_APP.Nodes[nodeIndex].z + Math.random();
	makeNode(nodeIndex,x,y,z);
}


// �m�[�h����
function makeNode(nodeIndex,px,py,pz){

	/*�ǉ��m�[�h�̍\��*/
	var addedNode = {
		x : px,
		y : py,
		z : pz,
	
		adjacencyNodes : [SPRING_APP.Nodes[nodeIndex]]
	};
	
	var adj_last = SPRING_APP.Nodes[nodeIndex].adjacencyNodes.length;
	
	/*�A�v���P�[�V�����I�u�W�F�N�g�Ƀm�[�h��ǉ�*/
	SPRING_APP.AddNode(addedNode);	
	
	/*�N���b�N���ꂽ�m�[�h�̗אڃm�[�h�Ƃ��Ēǉ�*/
	SPRING_APP.Nodes[nodeIndex].adjacencyNodes[adj_last] = addedNode;

/*  �~�Ɠ�����ʕ`��
	renderCircle(px,py,pz);
	renderLine(	px,
			py,
			pz,
			SPRING_APP.Nodes[nodeIndex].x,
			SPRING_APP.Nodes[nodeIndex].y,
			SPRING_APP.Nodes[nodeIndex].z	);
*/
}




function makeNode2(parentURL,childURL){


	/*�ǉ��m�[�h�̍\��*/
	var addedNode = {
		x : SPRING_APP.Nodes[parentURL] + Math.floor(Math.random()*10),
		y : SPRING_APP.Nodes[parentURL] + Math.floor(Math.random()*10),
		z : SPRING_APP.Nodes[parentURL] + Math.floor(Math.random()*10),
	
		adjacencyNodes : [{parentURL:SPRING_APP.Nodes[parentURL]}]
	};
	
	var adj_last = SPRING_APP.Nodes[nodeIndex].adjacencyNodes.length;
	
	/*�A�v���P�[�V�����I�u�W�F�N�g�Ƀm�[�h��ǉ�*/
	SPRING_APP.AddNode(addedNode);	
	
	/*�N���b�N���ꂽ�m�[�h�̗אڃm�[�h�Ƃ��Ēǉ�*/
	SPRING_APP.Nodes[nodeIndex].adjacencyNodes[adj_last] = addedNode;74




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

