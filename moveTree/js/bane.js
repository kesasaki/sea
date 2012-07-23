/**
 * @author ���X�� �C
 */







// ���W�Ȃ��A�h���X��
var inputTree = {'http://lewuathe.sakura.ne.jp': [
			{'http://mixi.jp/': [
				{'https://twitter.com/': [
					{'https://www.google.co.jp/': [
						{'http://www.yahoo.co.jp/': null},
						{'http://www.facebook.com': null}
					]}, 
					{'http://www.amazon.co.jp/': null}
				]}, 
				{'http://www.2ch.net/': null}
			]},
			{'http://dka-hero.com/top.html': null}
		]};

// ���W����A�h���X��
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


/*���[�h��*/
$(function(){	

/***********************************************************/
/*                                                         */
/*                      how to use                         */
/*                                                         */
/***********************************************************/


	/* ���W�Ȃ��؂ɍ��W������ */
	var inTree = addPosition(inputTree);

	/* �f�o�b�O�\�� 	�ؕ\��*/
	console.log("");
	console.log("+++++++++++ showTree +++++++++++");
	showTree(inTree,0);
	console.log("");


	/* SPRING_APP�ɒl���Z�b�g */
	SPRING_APP.parseTree(inTree,null);


	/* �f�o�b�O		SPRING_APP�̃m�[�h�\�� */
	SPRING_APP.ShowNodes();


	/* SPRING_APP��Nodes�̍��W�X�V */
	SPRING_APP.MoveAll();


	/* �f�o�b�O		SPRING_APP�̃m�[�h�\�� */
	SPRING_APP.ShowNodes();


	/* SPRING_APP����؂��擾 */
	var outTree = SPRING_APP.parseNodes(inTree);


	/* �f�o�b�O 	�ؕ\��*/
	console.log("");
	console.log("+++++++++++ showTree +++++++++++");
	showTree(outTree,0);
	console.log("");


	/*�����m�[�h���ЂƂǉ�*/
/*	var rand = randobet(10);
	console.log(rand);
	SPRING_APP.AddNode(rand,{
		x : 400.0,
		y : 200.0,
		z : 200.0,
		adjacencyNodes : {}
	});
*/	

	
	$("canvas.spring").click( function(event){ 
		for(var nodeIndex in SPRING_APP.Nodes){
			if(is_pushed(event,SPRING_APP.Nodes[nodeIndex])){
				
				/*�ǉ��m�[�h�̍\��*/
				var addedNode = {
					x : event.pageX - 210.0,
					y : 0.0,
					z : event.pageY - 110.0,
					adjacencyNodes : {}
				};
				
				
				/*�A�v���P�[�V�����I�u�W�F�N�g�Ƀm�[�h��ǉ�*/
				var rand = randobet(10);
				addedNode.adjacencyNodes[nodeIndex] = SPRING_APP.Nodes[nodeIndex];
				SPRING_APP.AddNode(rand,addedNode);
				
				/*�N���b�N���ꂽ�m�[�h�̗אڃm�[�h�Ƃ��Ēǉ�*/
				SPRING_APP.Nodes[nodeIndex].adjacencyNodes[rand] = addedNode;

				/* �f�o�b�O�o�� */
				//SPRING_APP.ShowNodes();

				
				return false;
			}
		}
	} );


	
	/*���W�\��*/
	$("canvas.spring").mousemove(function(event){
		$("span#X").text(event.pageX - 210.0);
		$("span#Y").text(event.pageY - 110.0);
	} );
	
	setInterval(loop,100);
});



/*�N���b�N���ꂽ���̔���*/
function is_pushed(event,Node){
	var distX = event.pageX - 210.0 - Node.x;
	var distY = event.pageY - 110.0 - Node.z;
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
				y : node.z,
				radius : 10
			});
			
			
			/*�G�b�W�`��*/
			for(var adjIndex in node.adjacencyNodes){
				var adjNode = node.adjacencyNodes[adjIndex];
				$("canvas.spring").drawLine({
					strokeStyle : "#000",
					strokeWidth : 5,
					x1 : node.x, y1 : node.z,
					x2 : adjNode.x , y2 : adjNode.z
				});
			}
		}
		
		/*���X�e�b�v�ł̈ʒu���v�Z*/
		SPRING_APP.MoveAll();
	}
	/* �f�o�b�O		SPRING_APP�̃m�[�h�\�� */
	SPRING_APP.ShowNodes();
	
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
		var index = 	Math.floor(Math.random()*500) + "," + 
				Math.floor(Math.random()*500) + "," + 
				Math.floor(Math.random()*500) + "," + 
				prop;

		if(tree[prop] === null){
			out[index] = null;
		}
		else{ 
			out[index] = new Array();
			for(var i = 0 ; i < tree[prop].length ; i ++){
				out[index][i] = addPosition(tree[prop][i]);
			}
		}
	}
	return out;
}



/*
 *	show tree
 *
 *
 *	how to use:	show(tree);
 *

*/
function showTree(tree, depth){
	var out = new Array();
	for(var prop in tree){
		console.log(depth + " " + prop);
		if(tree[prop] === null){
		}
		else{ 
			for(var i = 0 ; i < tree[prop].length ; i ++){
				showTree(tree[prop][i], depth+1);
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







/* �g�b�v���x���̃A�v���P�[�V�����I�u�W�F�N�g*/
SPRING_APP = {
	/*�S�m�[�h�̊i�[�z��*/
	Nodes : {},
	
	/*�e���W���ƃo�l�̎��R����*/
	K : 4.0,	
	L : 50.0,
	
	/*�����W��*/
	R : 10.0,
	
	/*�m�[�h�̒ǉ�*/
	AddNode : function(URL,Node){ 
		this.Nodes[URL] = Node;
		console.log("Node add : " + URL);
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

		//this.ShowNodes();
	},
	
	/*�w��m�[�h�ł̒e���͂��v�Z*/
	SpringForce : function(nodeIndex){
		var spring_force = { sp_x : 0.0 , sp_y : 0.0 , sp_z : 0.0};
		var curNode = this.Nodes[nodeIndex];
		for(var adjIndex in curNode.adjacencyNodes){
			var distX = curNode.x - curNode.adjacencyNodes[adjIndex].x;
			var distY = curNode.y - curNode.adjacencyNodes[adjIndex].y;
			var distZ = curNode.z - curNode.adjacencyNodes[adjIndex].z;
//			var dist = Math.sqrt(Math.abs(distX*distX + distY*distY + distY*distZ));
			var dist = Math.sqrt(Math.abs(distX*distX + distZ*distZ));
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
//				var dist = Math.floor(Math.sqrt(Math.abs(distX*distX + distY*distY + distY*distZ)));
				var dist = Math.floor(Math.sqrt(Math.abs(distX*distX + distZ*distZ)));
				if(dist == 0){dist=1;}
				repulsice_force.rp_x += this.R*distX / dist;
				repulsice_force.rp_y += this.R*distY / dist; 
				repulsice_force.rp_z += this.R*distZ / dist; 
			}
		}
		return repulsice_force;
	},
	
	
	/*�w��m�[�h�𓮂���*/
	MoveNode : function(nodeIndex,spring_force,repulsive_force,dt){
		this.Nodes[nodeIndex].x += Math.floor(dt*(spring_force.sp_x + repulsive_force.rp_x));
//		this.Nodes[nodeIndex].y += Math.floor(dt*(spring_force.sp_y + repulsive_force.rp_y));
		this.Nodes[nodeIndex].y += 0;
		this.Nodes[nodeIndex].z += Math.floor(dt*(spring_force.sp_z + repulsive_force.rp_z));
	},
	

	/*�m�[�h�����ׂĕ\���i�f�o�b�O�p�j*/
	ShowNodes : function(){
		console.log("");
		console.log("************ showNodes ************");
		for(var allIndex in this.Nodes){
			var curNode = this.Nodes[allIndex];
				console.log(curNode.x + " " + curNode.y + " " + curNode.z + " " + allIndex);
			
			for(var adjIndex in curNode.adjacencyNodes){
				console.log("                  " + curNode.adjacencyNodes[adjIndex].x + " " + curNode.adjacencyNodes[adjIndex].y + " " + curNode.adjacencyNodes[adjIndex].z + " " + adjIndex);
			}
		}
		console.log("");
	},



	/* �؂��m�[�h�Ɋi�[ */
	parseTree : function(tree,parent){
		for (var prop in tree){

			// �m�[�h���
			var arr = prop.split(",");
			var addedNode = {
				x : parseInt(arr[0]),
				y : parseInt(arr[1]),
				z : parseInt(arr[2]),
				adjacencyNodes : {}
			};

			// �e���@adjacencyNodes�@�ɉ�����
			if(parent === null){
			}else{
				addedNode.adjacencyNodes[parent] = this.Nodes[parent];
			}

			// �m�[�h������
			this.AddNode(arr[3],addedNode);

			// �q���@adjacencyNodes�@�ɉ�����
			if(tree[prop] === null){
		  	}else{
				var ret = new Array();
				for(var childIndex = 0 ; childIndex < tree[prop].length ; childIndex++){
					for(var chiKey in tree[prop][childIndex]){
						var chi = chiKey.split(",");
						this.Nodes[arr[3]].adjacencyNodes[chi[3]] = this.parseTree(tree[prop][childIndex],arr[3]);
					}
				}
			}
			
			return addedNode;
		}
		return;
	},





	/* �m�[�h����؂𓾂� */
	parseNodes : function(tree){
		if(tree === null){
			return null;
		}
		for (var prop in tree){
			
			// ���W�{URL��������
			var propArr = prop.split(",");
			var node = this.Nodes[propArr[3]];
			var index = [node.x , node.y , node.z , propArr[3]].join(",");

			// �z��Ɋi�[
			var out = new Array();
			if(tree[prop] === null){
				out[index] = null;
			}else{
				out[index] = new Array();
				for(var adjIndex = 0; adjIndex < tree[prop].length; adjIndex++){
					out[index][adjIndex] = this.parseNodes(tree[prop][adjIndex]);
				}
			}
			return out;
		}
	}



};