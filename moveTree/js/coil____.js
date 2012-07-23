/**
 * @author 佐々木 海
 */

/* トップレベルのアプリケーションオブジェクト*/
SPRING_APP = {
	/*全ノードの格納配列*/
	Nodes : {},
	
	/*弾性係数とバネの自然長さ*/
	K : 2.0,	
	L : 50.0,
	
	/*反発係数*/
	R : 5.0,
	
	/*ノードの追加*/
	AddNode : function(URL,Node){ 
		this.Nodes[URL] = Node;
	},
	
	/*各ノードの次ステップでの位置計算*/
	MoveAll : function(){
		var len = this.Nodes.length;
		/*タイムスパン*/
		var dt = 0.1;
		
		for(var i in this.Nodes){
			var spring_force = this.SpringForce(i);
			var repulsive_force = this.RepulsiveForce(i);
	        /*var friction_force = this.FrictionForce(i);*/
			this.MoveNode(i,spring_force,repulsive_force,dt);
		}
	},
	
	/*指定ノードでの弾性力を計算*/
	SpringForce : function(nodeIndex){
		var spring_force = {sp_x:0.0, sp_y:0.0, sp_z:0.0};
		var curNode = this.Nodes[nodeIndex];
		

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
	},
	
	/*指定ノードでの反発力を計算*/
	RepulsiveForce : function(nodeIndex){
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
	},
	
	
	/*指定ノードを動かす*/
	MoveNode : function(nodeIndex,spring_force,repulsive_force,dt){
		this.Nodes[nodeIndex].x += dt*(spring_force.sp_x + repulsive_force.rp_x);
		this.Nodes[nodeIndex].y += dt*(spring_force.sp_y + repulsive_force.rp_y);	
		this.Nodes[nodeIndex].z += dt*(spring_force.sp_z + repulsive_force.rp_z);
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
			{'200,300,500http://www.facebook.com': null}
		]};




	/*初期ノードの指定*/
	SPRING_APP.AddNode({
		x : 400.0,
		y : 200.0,
		adjacencyNodes : []	
	});
	
	
	$("canvas.spring").click( function(event){ 
		for(var nodeIndex = 0 ; nodeIndex < SPRING_APP.Nodes.length ; nodeIndex++){
			if(is_pushed(event,SPRING_APP.Nodes[nodeIndex])){
				
				/*追加ノードの構成*/
				var addedNode = {
					x : event.pageX - 210.0,
					y : event.pageY - 110.0,
					adjacencyNodes : [SPRING_APP.Nodes[nodeIndex]]
				};
				
				var adj_last = SPRING_APP.Nodes[nodeIndex].adjacencyNodes.length;
				
				/*アプリケーションオブジェクトにノードを追加*/
				SPRING_APP.AddNode(addedNode);	
				
				/*クリックされたノードの隣接ノードとして追加*/
				SPRING_APP.Nodes[nodeIndex].adjacencyNodes[adj_last] = addedNode;

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
	
	if(SPRING_APP.Nodes.length != 0){		
		for(var nodeIndex = 0 ; nodeIndex < SPRING_APP.Nodes.length ; nodeIndex++){
			
			/*ノード描画*/
			var node = SPRING_APP.Nodes[nodeIndex];
			$("canvas.spring").drawArc({
				fillStyle : "#000",
				x : node.x,
				y : node.y,
				radius : 10
			});
			
			
			/*エッジ描画*/
			for(var adjIndex = 0 ; adjIndex < node.adjacencyNodes.length ; adjIndex++){
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