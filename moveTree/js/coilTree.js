/**
 * @author 佐々木 海
 */

/* トップレベルのアプリケーションオブジェクト*/
SPRING_APP = {
	/*全ノードの格納配列*/
	Nodes : {},
	
	/*弾性係数とバネの自然長さ*/
	K : 4.0,	
	L : 30.0,
	
	/*反発係数*/
	R : 2.0,
	
	/*ノードの追加*/
	AddNode : function(URL,Node){ 
		this.Nodes[URL] = Node;
		console.log(URL + " is added.");
	},
	
	/*各ノードの次ステップでの位置計算*/
	MoveAll : function(){
		/*タイムスパン*/
		var dt = 0.1;
		
		for(var i in this.Nodes){
			console.log("**********");
			var spring_force = this.SpringForce(i);
			var repulsive_force = this.RepulsiveForce(i);
			this.MoveNode(i,spring_force,repulsive_force,dt);
		}

		//this.ShowNodes();
	},
	
	/*指定ノードでの弾性力を計算*/
	SpringForce : function(nodeIndex){
		var spring_force = { sp_x : 0.0 , sp_y : 0.0 , sp_z : 0.0};
		var curNode = this.Nodes[nodeIndex];
		for(var adjIndex in curNode.adjacencyNodes){
			var distX = curNode.x - curNode.adjacencyNodes[adjIndex].x;
			var distY = curNode.y - curNode.adjacencyNodes[adjIndex].y;
			var distZ = curNode.z - curNode.adjacencyNodes[adjIndex].z;
			//var dist = Math.sqrt(Math.abs(distX*distX + distY*distY + distY*distZ));
			var dist = Math.sqrt(Math.abs(distX*distX + distZ*distZ));
			var extend = dist - this.L;
			spring_force.sp_x += -this.K*extend*distX / dist;
			spring_force.sp_y += -this.K*extend*distY / dist;
			spring_force.sp_z += -this.K*extend*distZ / dist;
		}
		console.log("sf: " + spring_force.sp_x + " " + spring_force.sp_y);
		return spring_force;
	},
	
	/*指定ノードでの反発力を計算*/
	RepulsiveForce : function(nodeIndex){
		var repulsice_force = { rp_x : 0.0 , rp_y : 0.0  , rp_z : 0.0 };
		var curNode = this.Nodes[nodeIndex];
		
		for(var allIndex in this.Nodes){
			if(allIndex != nodeIndex){
				var distX = curNode.x - this.Nodes[allIndex].x;
				var distY = curNode.y - this.Nodes[allIndex].y;
				var distZ = curNode.z - this.Nodes[allIndex].z;
				//var dist = Math.sqrt(Math.abs(distX*distX + distY*distY + distY*distZ));
				var dist = Math.floor(Math.sqrt(Math.abs(distX*distX + distZ*distZ)));
				if(dist == 0){dist=1;}
				repulsice_force.rp_x += this.R*distX / dist;
				repulsice_force.rp_y += this.R*distY / dist; 
				repulsice_force.rp_z += this.R*distZ / dist; 
			}
		}
		console.log("rf: " + repulsice_force.rp_x + " " + repulsice_force.rp_y);
		return repulsice_force;
	},
	
	
	/*指定ノードを動かす*/
	MoveNode : function(nodeIndex,spring_force,repulsive_force,dt){
		this.Nodes[nodeIndex].x += Math.floor(dt*(spring_force.sp_x + repulsive_force.rp_x));
		this.Nodes[nodeIndex].y += Math.floor(dt*(spring_force.sp_y + repulsive_force.rp_y));
//		this.Nodes[nodeIndex].z += Math.floor(dt*(spring_force.sp_z + repulsive_force.rp_z));
		this.Nodes[nodeIndex].z += 0;
	},
	

	/*ノードをすべて表示（デバッグ用）*/
	ShowNodes : function(){
		for(var allIndex in this.Nodes){
			var curNode = this.Nodes[allIndex];
			for(var adjIndex in curNode.adjacencyNodes){
				console.log(curNode.x + " " + curNode.y + " " + curNode.z + " " + allIndex + " " + curNode.adjacencyNodes[adjIndex].x + " " + curNode.adjacencyNodes[adjIndex].y + " " + curNode.adjacencyNodes[adjIndex].z + " " + adjIndex);
			}
		}
	}





};



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



/*ロード時*/
$(function(){	



	parseTree(positions,null);

//	var pos = addPosition(positions);

//	show(pos);

	/*初期ノードの指定*/
/*	var rand = randobet(10);
	console.log(rand);
	SPRING_APP.AddNode(rand,{
		x : 400.0,
		y : 200.0,
		z : 200.0,
		adjacencyNodes : {}
	});
*/	
	SPRING_APP.ShowNodes();
	
	$("canvas.spring").click( function(event){ 
		for(var nodeIndex in SPRING_APP.Nodes){
			if(is_pushed(event,SPRING_APP.Nodes[nodeIndex])){
				
				/*追加ノードの構成*/
				var addedNode = {
					x : event.pageX - 210.0,
					y : event.pageY - 110.0,
					z : 0.0,
					adjacencyNodes : {}
				};
				
				
				/*アプリケーションオブジェクトにノードを追加*/
				var rand = randobet(10);
				addedNode.adjacencyNodes[nodeIndex] = SPRING_APP.Nodes[nodeIndex];
				SPRING_APP.AddNode(rand,addedNode);
				
				/*クリックされたノードの隣接ノードとして追加*/
				SPRING_APP.Nodes[nodeIndex].adjacencyNodes[rand] = addedNode;

				/* Nodes 出力（デバッグ用） */
				for(var nodeIndex in SPRING_APP.Nodes){
					var curNode = SPRING_APP.Nodes[nodeIndex];
					console.log(" " + nodeIndex);
					for(var adjIndex in curNode.adjacencyNodes){
						console.log("  " + adjIndex + " " + SPRING_APP.Nodes[adjIndex].x);
					}
				}
				
				return false;
			}
		}
	} );


	
	/*座標表示*/
	$("canvas.spring").mousemove(function(event){
		$("span#X").text(event.pageX - 210.0);
		$("span#Y").text(event.pageY - 110.0);
	} );
	
	setInterval(loop,10000);
});



/*クリックされたかの判定*/
function is_pushed(event,Node){
	var distX = event.pageX - 210.0 - Node.x;
	var distY = event.pageY - 110.0 - Node.y;
	if(distX * distX + distY * distY < 100){
		return true;
	}
	else{
		return false;
	}
}


loop_num = 0;
/*メインループ*/
function loop(){
	loop_num++;
	$("canvas.spring").clearCanvas();
	$("span#step").text(loop_num);
	$("span#len").text(SPRING_APP.Nodes.length);
	display();
	var tree = parseNode(positions);
	console.log("@+++++++++++++ parseNode +++++++++++++++@");
	show(tree,0);
}

/*メインディスプレイ関数*/
function display(){
	console.log("+++++++++++++++++++++++++++++++++");
	if(true){		
		for(var nodeIndex in SPRING_APP.Nodes){

			/*ノード描画*/
			var node = SPRING_APP.Nodes[nodeIndex];
			$("canvas.spring").drawArc({
				fillStyle : "#000",
				x : node.x,
				y : node.y,
				radius : 10
			});
			
			
			/*エッジ描画*/
			for(var adjIndex in node.adjacencyNodes){
				var adjNode = node.adjacencyNodes[adjIndex];
				$("canvas.spring").drawLine({
					strokeStyle : "#000",
					strokeWidth : 5,
					x1 : node.x, y1 : node.y,
					x2 : adjNode.x , y2 : adjNode.y
				});
			}
		}
		
		/*次ステップでの位置を計算*/
		SPRING_APP.MoveAll();
	}
	
}

/* ランダム文字列生成 */
var randobet = function(n, b) {
	b = b || '';
	var a = 'abcdefghijklmnopqrstuvwxyz'
		+ 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		+ '0123456789'
		+ b;
	a = a.split('');
	var s = '';
	for (var i = 0; i < n; i++) {
    	s += a[Math.floor(Math.random() * a.length)];
	}
	return s;
};




/* 
 * 	木をノードに格納する関数
 * 
 * 	引数：	tree	array	Input tree from JSON
 * 		parent	string	Parent node's URL
 * 
 * 
 *
 */
function parseTree(tree,parent){
	for (var prop in tree){

		// ノード作る
		var arr = prop.split(",");
		var addedNode = {
			x : parseInt(arr[0]),
			y : parseInt(arr[1]),
			z : parseInt(arr[2]),
			adjacencyNodes : {}
		};

		// 親を　adjacencyNodes　に加える
		if(parent === null){
		}else{
			addedNode.adjacencyNodes[parent] = SPRING_APP.Nodes[parent];
		}

		// ノード加える
		SPRING_APP.AddNode(arr[3],addedNode);

		// 子を　adjacencyNodes　に加える
		if(tree[prop] === null){
	  	}else{
			var ret = new Array();
			for(var childIndex = 0 ; childIndex < tree[prop].length ; childIndex++){
				for(var chiKey in tree[prop][childIndex]){
					var chi = chiKey.split(",");
					SPRING_APP.Nodes[arr[3]].adjacencyNodes[chi[3]] = parseTree(tree[prop][childIndex],arr[3]);
				}
			}
		}
		
		return addedNode;
	}
	return;
}




/* 
 * 	ノードから木を得る関数
 * 
 * 	引数：	
 * 
 * 
 *
 */
function parseNode(tree){
	if(tree === null){
		return null;
	}
	for (var prop in tree){
		
		// 座標＋URL文字列作る
		var propArr = prop.split(",");
		var node = SPRING_APP.Nodes[propArr[3]];
		var index = [node.x , node.y , node.z , propArr[3]].join(",");

		// 配列に格納
		var out = new Array();
		if(tree[prop] === null){
			out[index] = null;
		}else{
			out[index] = new Array();
			for(var adjIndex = 0; adjIndex < tree[prop].length; adjIndex++){
				out[index][adjIndex] = parseNode(tree[prop][adjIndex]);
			}
		}
		return out;
	}
}


/*
 *	add positions to tree
 *
 *
 *
 *
 *
 *
 *
 *
*/

function addPosition(tree){
	var out = new Array();
	for(var prop in tree){
		if(tree[prop] === null){
			out[Math.floor(Math.random()*100) + "," + Math.floor(Math.random()*100) + "," + Math.floor(Math.random()*100) + ","+prop] = null;
		}
		else{ 
			for(var i = 0 ; i < tree[prop].length ; i ++){
				out[Math.floor(Math.random()*100) + "," + Math.floor(Math.random()*100) + "," + Math.floor(Math.random()*100) + ","+prop] = addPosition(tree[prop][i]);
			}
		}
	}
	return out;
}



/*
 *	show tree
 *
 *
 *
 *
 *
 *
 *
 *
*/

function show(tree, depth){
	var out = new Array();
	for(var prop in tree){
		console.log(depth + " " + prop);
		if(tree[prop] === null){
		}
		else{ 
			for(var i = 0 ; i < tree[prop].length ; i ++){
				show(tree[prop][i], depth+1);
			}
		}
	}
	return out;
}



/*
 *	get length of associative array
 *
 *
 *
 *
 *
 *
 *
 *
*/

function length(arr){
	var length = 0;
	for(var len in arr){
		length++;
	}
	return length;
}