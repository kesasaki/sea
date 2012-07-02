/**
 * @author 佐々木 海
 */

/* トップレベルのアプリケーションオブジェクト*/
SPRING_APP = {
	/*全ノードの格納配列*/
	Nodes : {},
	
	/*弾性係数とバネの自然長さ*/
	K : 3.0,	
	L : 30.0,
	
	/*反発係数*/
	R : 3.0,
	
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
			var spring_force = this.SpringForce(i);
			var repulsive_force = this.RepulsiveForce(i);
			this.MoveNode(i,spring_force,repulsive_force,dt);
		}
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
			var dist = Math.sqrt(Math.abs(distX*distX + distY*distY));
			var extend = dist - this.L;
			spring_force.sp_x += -this.K*extend*distX / dist;
			spring_force.sp_y += -this.K*extend*distY / dist;
			spring_force.sp_z += -this.K*extend*distZ / dist;
		}
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
				var dist = Math.sqrt(Math.abs(distX*distX + distY*distY));
				console.log("dist "+dist);
				repulsice_force.rp_x += this.R*distX / dist;
				repulsice_force.rp_y += this.R*distY / dist; 
				repulsice_force.rp_z += this.R*distZ / dist; 
			}
		}
		
		return repulsice_force;
	},
	
	
	/*指定ノードを動かす*/
	MoveNode : function(nodeIndex,spring_force,repulsive_force,dt){
		this.Nodes[nodeIndex].x += dt*(spring_force.sp_x + repulsive_force.rp_x);
		this.Nodes[nodeIndex].y += dt*(spring_force.sp_y + repulsive_force.rp_y);
		//this.Nodes[nodeIndex].z += dt*(spring_force.sp_z + repulsive_force.rp_z);
		this.Nodes[nodeIndex].z += 0;
	}
	
};

/*ロード時*/
$(function(){	

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
				{'200,300,500,http://www.facebook.com': null}
			]};

	//parseTree(positions,null);

	/*初期ノードの指定*/
	var rand = randobet(10);
	console.log(rand);
	SPRING_APP.AddNode(rand,{
		x : 400.0,
		y : 200.0,
		z : 200.0,
		adjacencyNodes : {}
	});
	
	
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
	
	setInterval(loop,50);
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
}

/*メインディスプレイ関数*/
function display(){
	
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
 * 	this function add nodes from tree.
 * 
 * 	引数：	tree	array	Input tree from JSON
 * 		parent	string	Parent node's URL
 * 
 * 
 *
 */
function parseTree(tree,parent){
	for (var prop in tree){
		var arr = prop.split(",");
		var addedNode = {
			x : arr[0],
			y : arr[1],
			z : arr[2],
			adjacencyNodes : {}
		};
		if(parent === null){
		}else{
			addedNode.adjacencyNodes[parent] = SPRING_APP.Nodes[parent];
		}
		SPRING_APP.AddNode(arr[3],addedNode);
		if(tree[prop] === null){
			return addedNode;
	  	}else{
			for(var temp in tree[prop]){
				var tmp = temp.split(",");
				//SPRING_APP.Nodes[arr[3]].adjacencyNodes[tmp[3]] = parseTree(tree[prop],arr[3]);
			}
			return addedNode;
		}
	}
	return;
}