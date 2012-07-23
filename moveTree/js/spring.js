/**
 * @author ���X�� �C
 */

/* �g�b�v���x���̃A�v���P�[�V�����I�u�W�F�N�g*/
SPRING_APP = {
	/*�S�m�[�h�̊i�[�z��*/
	Nodes : [],
	
	/*�e���W���ƃo�l�̎��R����*/
	K : 2.0,	
	L : 50.0,
	
	/*�����W��*/
	R : 5.0,
	
	/*�m�[�h�̒ǉ�*/
	AddNode : function(Node){ 
		var len = this.Nodes.length;
		this.Nodes[len] = Node;
	},
	
	/*�e�m�[�h�̎��X�e�b�v�ł̈ʒu�v�Z*/
	MoveAll : function(){
		var len = this.Nodes.length;
		/*�^�C���X�p��*/
		var dt = 0.1;
		
		for(var i = 0 ; i < len ; i++){
			var spring_force = this.SpringForce(i);
			var repulsive_force = this.RepulsiveForce(i);
	        /*var friction_force = this.FrictionForce(i);*/
			this.MoveNode(i,spring_force,repulsive_force,dt);
		}
	},
	
	/*�w��m�[�h�ł̒e���͂��v�Z*/
	SpringForce : function(nodeIndex){
		var spring_force = { sp_x : 0.0 , sp_y : 0.0};
		var curNode = this.Nodes[nodeIndex];
		
		for(var adjIndex = 0 ; adjIndex < curNode.adjacencyNodes.length ; adjIndex++){
			var distX = curNode.x - curNode.adjacencyNodes[adjIndex].x;
			var distY = curNode.y - curNode.adjacencyNodes[adjIndex].y;
			var dist = Math.sqrt(distX*distX + distY*distY);
			var extend = dist - this.L;
			spring_force.sp_x += -this.K*extend*distX / dist;
			spring_force.sp_y += -this.K*extend*distY / dist; 
		}
		
		return spring_force;
	},
	
	/*�w��m�[�h�ł̔����͂��v�Z*/
	RepulsiveForce : function(nodeIndex){
		var repulsice_force = { rp_x : 0.0 , rp_y : 0.0 };
		var curNode = this.Nodes[nodeIndex];
		
		for(var allIndex = 0 ;  allIndex < this.Nodes.length ; allIndex++){
			if(allIndex != nodeIndex){				
				var distX = curNode.x - this.Nodes[allIndex].x;
				var distY = curNode.y - this.Nodes[allIndex].y;
				var dist = Math.sqrt(distX*distX + distY*distY);
				repulsice_force.rp_x += this.R*distX / dist;
				repulsice_force.rp_y += this.R*distY / dist; 
			}
		}
		
		return repulsice_force;
	},
	
	
	/*�w��m�[�h�𓮂���*/
	MoveNode : function(nodeIndex,spring_force,repulsive_force,dt){
		this.Nodes[nodeIndex].x += dt*(spring_force.sp_x + repulsive_force.rp_x);
		this.Nodes[nodeIndex].y += dt*(spring_force.sp_y + repulsive_force.rp_y);	
	}
	
};

/*���[�h��*/
$(function(){	
	/*�����m�[�h�̎w��*/
	SPRING_APP.AddNode({
		x : 400.0,
		y : 200.0,
		adjacencyNodes : []	
	});
	
	
	$("canvas.spring").click( function(event){ 
		for(var nodeIndex = 0 ; nodeIndex < SPRING_APP.Nodes.length ; nodeIndex++){
			if(is_pushed(event,SPRING_APP.Nodes[nodeIndex])){
				
				/*�ǉ��m�[�h�̍\��*/
				var addedNode = {
					x : event.pageX - 210.0,
					y : event.pageY - 110.0,
					adjacencyNodes : [SPRING_APP.Nodes[nodeIndex]]
				};
				
				var adj_last = SPRING_APP.Nodes[nodeIndex].adjacencyNodes.length;
				
				/*�A�v���P�[�V�����I�u�W�F�N�g�Ƀm�[�h��ǉ�*/
				SPRING_APP.AddNode(addedNode);	
				
				/*�N���b�N���ꂽ�m�[�h�̗אڃm�[�h�Ƃ��Ēǉ�*/
				SPRING_APP.Nodes[nodeIndex].adjacencyNodes[adj_last] = addedNode;

		
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
	
	if(SPRING_APP.Nodes.length != 0){		
		for(var nodeIndex = 0 ; nodeIndex < SPRING_APP.Nodes.length ; nodeIndex++){
			
			/*�m�[�h�`��*/
			var node = SPRING_APP.Nodes[nodeIndex];
			$("canvas.spring").drawArc({
				fillStyle : "#000",
				x : node.x,
				y : node.y,
				radius : 10
			});
			
			
			/*�G�b�W�`��*/
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
		
		/*���X�e�b�v�ł̈ʒu���v�Z*/
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