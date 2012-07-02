/**
 * @author ���X�� �C
 */

/* �g�b�v���x���̃A�v���P�[�V�����I�u�W�F�N�g*/
SPRING_APP = {
	/*�S�m�[�h�̊i�[�z��*/
	Nodes : {},
	
	/*�e���W���ƃo�l�̎��R����*/
	K : 3.0,	
	L : 30.0,
	
	/*�����W��*/
	R : 3.0,
	
	/*�m�[�h�̒ǉ�*/
	AddNode : function(URL,Node){ 
		this.Nodes[URL] = Node;
		console.log(URL + " is added.");
	},
	
	/*�e�m�[�h�̎��X�e�b�v�ł̈ʒu�v�Z*/
	MoveAll : function(){
		/*�^�C���X�p��*/
		var dt = 0.1;
		
		for(var i in this.Nodes){
			var spring_force = this.SpringForce(i);
			var repulsive_force = this.RepulsiveForce(i);
			this.MoveNode(i,spring_force,repulsive_force,dt);
		}
	},
	
	/*�w��m�[�h�ł̒e���͂��v�Z*/
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
	
	/*�w��m�[�h�ł̔����͂��v�Z*/
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
	
	
	/*�w��m�[�h�𓮂���*/
	MoveNode : function(nodeIndex,spring_force,repulsive_force,dt){
		this.Nodes[nodeIndex].x += dt*(spring_force.sp_x + repulsive_force.rp_x);
		this.Nodes[nodeIndex].y += dt*(spring_force.sp_y + repulsive_force.rp_y);
		//this.Nodes[nodeIndex].z += dt*(spring_force.sp_z + repulsive_force.rp_z);
		this.Nodes[nodeIndex].z += 0;
	}
	
};

/*���[�h��*/
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

	/*�����m�[�h�̎w��*/
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
				
				/*�ǉ��m�[�h�̍\��*/
				var addedNode = {
					x : event.pageX - 210.0,
					y : event.pageY - 110.0,
					z : 0.0,
					adjacencyNodes : {}
				};
				
				
				/*�A�v���P�[�V�����I�u�W�F�N�g�Ƀm�[�h��ǉ�*/
				var rand = randobet(10);
				addedNode.adjacencyNodes[nodeIndex] = SPRING_APP.Nodes[nodeIndex];
				SPRING_APP.AddNode(rand,addedNode);
				
				/*�N���b�N���ꂽ�m�[�h�̗אڃm�[�h�Ƃ��Ēǉ�*/
				SPRING_APP.Nodes[nodeIndex].adjacencyNodes[rand] = addedNode;

				/* Nodes �o�́i�f�o�b�O�p�j */
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


	
	/*���W�\��*/
	$("canvas.spring").mousemove(function(event){ 
		$("span#X").text(event.pageX - 210.0); 
		$("span#Y").text(event.pageY - 110.0);	
	} );
	
	setInterval(loop,50);
});



/*�N���b�N���ꂽ���̔���*/
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
/*���C�����[�v*/
function loop(){
	loop_num++;
	$("canvas.spring").clearCanvas();
	$("span#step").text(loop_num);
	$("span#len").text(SPRING_APP.Nodes.length);
	display();
}

/*���C���f�B�X�v���C�֐�*/
function display(){
	
	if(true){		
		for(var nodeIndex in SPRING_APP.Nodes){

			/*�m�[�h�`��*/
			var node = SPRING_APP.Nodes[nodeIndex];
			$("canvas.spring").drawArc({
				fillStyle : "#000",
				x : node.x,
				y : node.y,
				radius : 10
			});
			
			
			/*�G�b�W�`��*/
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
		
		/*���X�e�b�v�ł̈ʒu���v�Z*/
		SPRING_APP.MoveAll();
	}
	
}

/* �����_�������񐶐� */
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
 * 	�����F	tree	array	Input tree from JSON
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