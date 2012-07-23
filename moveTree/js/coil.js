/**
 * @author ���X�� �C
 */

/* �g�b�v���x���̃A�v���P�[�V�����I�u�W�F�N�g*/
SPRING_APP = {
	/*�S�m�[�h�̊i�[�z��*/
	Nodes : {},
	
	/*�e���W���ƃo�l�̎��R����*/
	K : 3.0,	
	L : 50.0,
	
	/*�����W��*/
	R : 10.0,
	
	/*�m�[�h�̒ǉ�
	AddNode : function(Node){ 
		var len = this.Nodes.length;
		this.Nodes[len] = Node;
	},*/


	/*�m�[�h�̒ǉ�*/
	AddNode : function(URL,Node){ 
		this.Nodes[URL] = Node;
	},

	
	/*�e�m�[�h�̎��X�e�b�v�ł̈ʒu�v�Z*/
	MoveAll : function(){
		/*�^�C���X�p��*/
		var dt = 0.1;
		
		for(var i in this.Nodes){
			var spring_force = this.SpringForce(i);
			var repulsive_force = this.RepulsiveForce(i);
	        /*var friction_force = this.FrictionForce(i);*/
			this.MoveNode(i,spring_force,repulsive_force,dt);
		}
	},
	
	/*�w��m�[�h�ł̒e���͂��v�Z*/
	SpringForce : function(nodeIndex){
		var spring_force = { sp_x : 0.0 , sp_y : 0.0 , sp_z:0.0};
		var curNode = this.Nodes[nodeIndex];
		
		for(var adjIndex in curNode.adjacencyNodes){
			var distX = curNode.x - curNode.adjacencyNodes[adjIndex].x;
			var distY = curNode.y - curNode.adjacencyNodes[adjIndex].y;
			var distZ = curNode.z - curNode.adjacencyNodes[adjIndex].z;
			var dist = Math.sqrt(distX*distX + distY*distY + distZ*distZ);
			var extend = dist - this.L;
			spring_force.sp_x += -this.K*extend*distX / dist;
			spring_force.sp_y += -this.K*extend*distY / dist; 
			spring_force.sp_z += -this.K*extend*distZ / dist; 
		}
		
		return spring_force;
	},
	
	/*�w��m�[�h�ł̔����͂��v�Z*/
	RepulsiveForce : function(nodeIndex){
		var repulsice_force = { rp_x : 0.0 , rp_y : 0.0 , rp_z:0.0 };
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
	
	
	/*�w��m�[�h�𓮂���*/
	MoveNode : function(nodeIndex,spring_force,repulsive_force,dt){
		this.Nodes[nodeIndex].x += dt*(spring_force.sp_x + repulsive_force.rp_x);
		this.Nodes[nodeIndex].y += dt*(spring_force.sp_y + repulsive_force.rp_y);
		this.Nodes[nodeIndex].z += dt*(spring_force.sp_z + repulsive_force.rp_z);	
	},

	/* �m�[�h�̐���Ԃ� */
	length : function(){
		var i=0;
		for(key in this.Nodes){i++;}
		return i;
	}
};


function show(a){
	var result = "";
	if (a instanceof Array){
		result += "{";
		var flag = false;
		for (var k in a){
			if(  typeof a[k] == "object"){
				result += k + ":-" + show(a[k]) + ",";
			}else{
				result += k + ":+" + a[k] + ",";
			}
			flag = true;
    		}
		if(flag){
			result = result.slice(0,result.length-1);
		}
		result += "}";
  	}else{
		result += a.toString();
	}
  	result += "}";
  	return result;
}

var testestest = "ab";


/*���[�h��*/
$(function(){	
	/*�����m�[�h�̎w��*/
	SPRING_APP.AddNode("kkk",{
		x : 400.0,
		y : 200.0,
		z : 200.0,
		adjacencyNodes : {}
	});

	var nodes
	console.log("open");
	console.log(show(SPRING_APP.Nodes));	
	
	$("canvas.spring").click( function(event){ 
		for(var nodeIndex in SPRING_APP.Nodes){
			if(is_pushed(event,SPRING_APP.Nodes[nodeIndex])){
				console.log("clicked");
				
				/*�ǉ��m�[�h�̍\��*/
				var addedNode = {
					x : event.pageX - 210.0,
					y : event.pageY - 110.0,
					adjacencyNodes : [SPRING_APP.Nodes[nodeIndex]]
				};
				
				var adj_last = SPRING_APP.Nodes[nodeIndex].adjacencyNodes.length;
				
				/*�A�v���P�[�V�����I�u�W�F�N�g�Ƀm�[�h��ǉ�*/
				SPRING_APP.AddNode(testestest,addedNode);
				
				/*�N���b�N���ꂽ�m�[�h�̗אڃm�[�h�Ƃ��Ēǉ�*/
				SPRING_APP.Nodes[nodeIndex].adjacencyNodes[testestest] = addedNode;



				//console.log(show(SPRING_APP.Nodes));	
				console.log(show(SPRING_APP.Nodes));
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
	$("span#len").text(SPRING_APP.length());
	$("span#debug").text("aaa");
	display();
}

/*���C���f�B�X�v���C�֐�*/
function display(){
	
	if(SPRING_APP.length() != 0){		
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