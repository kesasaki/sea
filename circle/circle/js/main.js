var width, height;
var renderer;

var data = new Array();
var count_cp = 0;
var sphere_num = 5;
var container, stats;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


//仮の値
var positions = {'0,0,0,http://www.yahoo.co.jp/': [
					{'-200,0,-300,https://www.google.co.jp/': [
						{'-400,0,-600,http://www.bing.com/?cc=jp': [
							{'-600,0,-900,http://www.microsoft.com/ja-jp/default.aspx': [
								{'-800,0,-1200,http://lewuathe.sakura.ne.jp': null},
								{'800,0,-1200,http://www.apple.com/jp/': null}
							]}, 
							{'600,0,-900,http://mb.softbank.jp': null}
						]}, 
						{'400,0,-600,http://www.amazon.co.jp/': null}
					]}, 
					{'200,0,-300,http://www.facebook.com': null}
				]};



//var out = resultParse(positions,2);
var out = resultParse(positions);
//document.write(out);



function resultParse(tree){
	var out = "";
	for (var prop in tree){
		if(tree[prop] === null){
			return prop;
		}
		
		out += prop + ",";
		
		for(var i = 0 ; i < tree[prop].length ; i++){
			out += resultParse(tree[prop][i]) + ",";
		}
		
		
	}
	return out;
}



insertData(out);



function insertData(out){

	var tmp = out.split(",");
	var all_data = new Array();

	for(var i = 0; i < tmp.length; i++){
		if(tmp[i] != "" ){
			all_data.push(tmp[i]);
		}
	}






	for(var i = 0; i < all_data.length; i+=4){
		data[i/4] = {};
		data[i/4].x = parseInt(all_data[i]);
		data[i/4].y = parseInt(all_data[i + 1]);
		data[i/4].z = parseInt(all_data[i + 2]);
		data[i/4].url = all_data[i + 3];
	
		//document.write(data[i/4].x + "," + data[i/4].y + "," + data[i/4].z + "<br>");
	}

}
//circleの繋がりを示す２次元配列の宣言
/*
var lineConnection = new Array(data.length);
for(var i = 0; i < data.length; i++){
	lineConnection[i] = new Array(data.length);
	
	for(var j = 0 ;j < data.length; j++){
		lineConnection[j] = {};
	}
}
*/


var Dict = {};
searchLine('', positions);

function searchLine(parentName, child){
	var dic = Dict[parentName];
	if(!dic) dic = Dict[parentName] = {};

	var childName;
	for(childName in child){
		if(child.hasOwnProperty(childName)){
			dic[childName] =true;
		
			var grandChildren = child[childName];
			if(grandChildren){
				var I = grandChildren.length;
				var i;
				for(i = 0; i < I; ++i){
					searchLine(childName, grandChildren[i]);
				}
			}
		}
	}
}


//document.write( Dict[data[0].x + ',' + data[0].y + ',' + data[0].z + ',' + data[0].url ][ data[1].x + ',' + data[1].y + ',' + data[1].z + ',' + data[1].url ] );







function initThree() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	width = document.getElementById('canvas-frame').clientWidth;
	height = document.getElementById('canvas-frame').clientHeight;  
	renderer = new THREE.WebGLRenderer({antialias: true});
	//renderer = new THREE.CanvasRenderer();
	renderer.setSize(width, height );
	document.getElementById('canvas-frame').appendChild(renderer.domElement);
	//renderer.setClearColorHex(0xFFFFFF, 1.0);



	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
  
  
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
}

var camera;
function initCamera() {  
  camera = new THREE.PerspectiveCamera( 45 , width / height , 1 , 10000 );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 1200;
  camera.up.x = 0;
  camera.up.y = 0;
  camera.up.z = 0;
  camera.lookAt( {x:0, y:0, z:0 } );
}




var scene;
function initScene() {    
  scene = new THREE.Scene( 'mousemove', onDocumentMouseMove, false );
  
  
	//fog
	//scene.fog = new THREE.FogExp2( 0xff0000, 0.0003 );
	//scene.fog.color.setHSV( 0.1, 0.10, 1 );
	
	
  	scene.add(camera);
  
}




var light;
function initLight() {  
  light = new THREE.DirectionalLight(0xFFFFFF, 1.0, 0);
  light.position.set( 500, 500, 200 );
  scene.add(light);
  light2 = new THREE.DirectionalLight(0xFFFFFF, 1.0, 0);
  light2.position.set( -500, -500, -200 );
  scene.add(light2);
}



count_cp = 0;
var circle = new Array();
var panel = new Array();
var sphere = new Array();
var angle = Math.PI / 2;
function initObject(){


	//Grid
	
	var geometry = new THREE.Geometry();
	geometry.vertices.push( new THREE.Vector3( - 2000, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 2000, 0, 0 ) );

	var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );

	for ( var i = 0; i <= 40; i ++ ) {

		var line = new THREE.Line( geometry, material );
		line.position.z = ( i * 100 ) - 2000;
		
		scene.add( line );

		line = new THREE.Line( geometry, material );
		line.position.x = ( i * 100 ) - 2000;
		line.rotation.y = 90 * Math.PI / 180;
		scene.add( line );

	}



	for(var i = 0; i < data.length; ++i){
		renderCircle(data[i].x, data[i].y, data[i].z);
	}

	//renderCircle(0,0,0);
	//renderCircle(-300,-300,-300);
	//renderCircle(300,-300,-300);
	//renderCircle(300,0,-600);
	
	count_cp = 0;
	for(var j = 0; j < data.length; ++j){
		for(var i = 0; i < data.length; ++i){
			if( Dict.hasOwnProperty( data[j].x + ',' + data[j].y + ',' + data[j].z + ',' + data[j].url ) ){
				if(Dict[ data[j].x + ',' + data[j].y + ',' + data[j].z + ',' + data[j].url ].hasOwnProperty( data[i].x + ',' + data[i].y + ',' + data[i].z + ',' + data[i].url )){
					renderLine( data[j].x, data[j].y, data[j].z, data[i].x, data[i].y, data[i].z );
					//document.write( data[j].x + ',' + data[j].y + ',' + data[j].z + ',' + data[i].x + ',' + data[i].y + ',' + data[i].z + "<br>");
				}
			}
		}
	}
	

	//renderLine(0,0,0,-200,-0,-300);
	//renderLine(0,0,0,200,0,-300);
	//renderLine(300,-300,-300,300,0,-600);
	
  
  
  
  
  
  
  //circleとpanelをレンダリングする関数
  function renderCircle(x,y,z){
	circle[count_cp] = new THREE.Mesh(
		new THREE.CylinderGeometry(100, 100, 0, 50, 50, false),		//形状の設定
		new THREE.MeshLambertMaterial({
         	color: Math.random() * 0xffffff,
         	opacity: 0.3,
			
         	}) //材質の設定
	);
	
	panel[count_cp] = new THREE.Mesh(
		new THREE.PlaneGeometry(100, 80),	//形状の設定
		new THREE.MeshLambertMaterial({
			color: Math.random() * 0xffffff,
			opacity: 0.3,
			
			}) //材質の設定
	);
	
	
	scene.add(circle[count_cp]);
	scene.add(panel[count_cp]);
	circle[count_cp].position.set(x,y,z);
	panel[count_cp].position.set(x, y + 70, z);
	circle[count_cp].rotation.set(angle,angle,angle);
	panel[count_cp].rotation.set(0,angle,angle);
	
	count_cp++;
  }
  
  
  
  //Line(Sphere)をレンダリングする関数
  function renderLine(x0,y0,z0,x1,y1,z1){//2つの位置はcircleの位置
	  
	  var xx0, zz0, xx1, zz1;
	  
	  calcLinePos();
	  
	  //var distance = Math.sqrt(Math.pow(xx0 - xx1, 2) + Math.pow(zz0 - zz1, 2));
	  
	  
	  if(!sphere[count_cp]) sphere[count_cp] = new Array();
	  
	  for (var i = 0; i < sphere_num; i++){
		  
		
		  
	  	sphere[count_cp][i] = new THREE.Mesh(
			new THREE.SphereGeometry(10,20,20),
			new THREE.MeshLambertMaterial({color: 0x000000})	
		);
	  
	  	sphere[count_cp][i].position.set(
			xx0 + ( xx1 - xx0 ) / ( sphere_num - 1 ) * i,
			y0  + ( y1  - y0  ) / ( sphere_num - 1 ) * i,
			zz0 + ( zz1 - zz0 ) / ( sphere_num - 1 ) * i
			);
	  	scene.add(sphere[count_cp][i]);
	  }
	  
	  count_cp++;
	  
	  //2点のcirlteの位置からLineの先端部の位置を計算する関数
	  function calcLinePos(){
		var dis = 60;//横移動距離
		  
		if(x0 > x1){
			xx0 = x0 - dis;
			xx1 = x1 + dis;
		} else if(x0 < x1){
			xx0 = x0 + dis;
			xx1 = x1 - dis;	
		} else {
			xx0 = x0;
			xx1 = x1;	
		}
		
		if(z0 > z1){
			zz0 = z0 - dis;
			zz1 = z1 + dis;
		} else if(z0 < z1){
			zz0 = z0 + dis;
			zz1 = z1 - dis;	
		} else {
			zz0 = z0;
			zz1 = z1;	
		}
		
		
		
	  }
	  
  }
  
  
  
  


}



function onDocumentMouseMove(event) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}




function onDocumentTouchStart( event ) {

	if ( event.touches.length > 1 ) {
		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}






var t=0;
function loop() {
  t++;
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( {x:0, y:0, z:0 } );
	
	getPositions();
	
	/* デバッグ表示 	木表示*/
	console.log("");
	console.log("+++++++++++ showTree +++++++++++");
	showTree(positions,0);
	console.log("");

	out = resultParse(positions);

	/* デバッグ 	木表示*/
	console.log("");
	console.log("+++++++++++ showTree +++++++++++");
	showTree(out,0);
	console.log("");



	insertData(out);
	
	moveCircles();
	
	count_cp = 0;
	
	moveLine();
	
	
	renderer.clear();
	renderer.render(scene, camera);
	//renderer.setClearColor( scene.fog.color, 1 );
	//renderer.sortObjects = false;
	window.requestAnimationFrame(loop);
	stats.update();
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//ここでpositionsを更新する必要あり
	function getPositions(){
		
		SPRING_APP.parseTree(positions,null);
		SPRING_APP.MoveAll();
		
	}
	
	
	
	//circleとpanelの位置を更新
	function moveCircles(){
		
		for(var i = 0; i < data.length; ++i){
			circle[i].position.set(data[i].x, data[i].y, data[i].z);
			panel[i].position.set(data[i].x, data[i].y + 70, data[i].z);
		}
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	//Lineの位置を更新する
	function moveLine(){
		Dict = {};
		searchLine('', positions);
		
		var xx0, zz0, xx1, zz1;
		
		//ここでラインの詳細な移動を行う
		
		for(var j = 0; j < data.length; ++j){
			for(var i = 0; i < data.length; ++i){
				if(Dict.hasOwnProperty(data[j].x + ',' + data[j].y + ',' + data[j].z + ',' + data[j].url)){
					if(Dict[data[j].x + ',' + data[j].y + ',' + data[j].z + ',' + data[j].url].hasOwnProperty(data[i].x + ',' + data[i].y + ',' + data[i].z + ',' + data[i].url)){
						
						//document.write( data[j].x + ',' + data[j].y + ',' + data[j].z + ',' + data[i].x + ',' + data[i].y + ',' + data[i].z + "<br>");
						
						calcLinePos(data[j].x, data[j].z, data[i].x, data[i].z);
						var y0 = data[j].y;
						var y1 = data[i].y;
						
						for(var num = 0; num < sphere_num; ++num){
							sphere[count_cp][num].position.set(
								xx0 + ( xx1 - xx0 ) / ( sphere_num - 1 ) * num,
								y0  + ( y1  - y0  ) / ( sphere_num - 1 ) * num,
								zz0 + ( zz1 - zz0 ) / ( sphere_num - 1 ) * num
							);
						}
						
						++count_cp;
						
						
					}
				}
			}
		}
		
		
		
		
		
		
		//2点のcirlteの位置からLineの先端部の位置を計算する関数
	  function calcLinePos(x0, z0, x1, z1){
		var dis = 60;//横移動距離
		  
		if(x0 > x1){
			xx0 = x0 - dis;
			xx1 = x1 + dis;
		} else if(x0 < x1){
			xx0 = x0 + dis;
			xx1 = x1 - dis;	
		} else {
			xx0 = x0;
			xx1 = x1;	
		}
		
		if(z0 > z1){
			zz0 = z0 - dis;
			zz1 = z1 + dis;
		} else if(z0 < z1){
			zz0 = z0 + dis;
			zz1 = z1 - dis;	
		} else {
			zz0 = z0;
			zz1 = z1;	
		}
		
	  }
		
	}
	
	t++;

}

function threeStart() {
  initThree();
  initCamera();
  initScene();    
  initLight();
  initObject();
  loop();
}

















/***************************************************************/
/*															   */
/*                    copy from bane.js                        */
/*															   */
/***************************************************************/




/*クリックされたかの判定*/
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

/*
loop_num = 0;
//メインループ
function loop(){
	loop_num++;
	$("canvas.spring").clearCanvas();
	$("span#step").text(loop_num);
	$("span#len").text(SPRING_APP.Nodes.length);
	display();

}
*/

/*メインディスプレイ関数*/
function display(){
	if(true){		
		for(var nodeIndex in SPRING_APP.Nodes){

			/*ノード描画*/
			var node = SPRING_APP.Nodes[nodeIndex];
			$("canvas.spring").drawArc({
				fillStyle : "#000",
				x : node.x,
				y : node.z,
				radius : 10
			});
			
			
			/*エッジ描画*/
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
		
		/*次ステップでの位置を計算*/
		SPRING_APP.MoveAll();
	}
	/* デバッグ		SPRING_APPのノード表示 */
	SPRING_APP.ShowNodes();
	
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
		//console.log(depth + " " + prop);
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







/* トップレベルのアプリケーションオブジェクト*/
SPRING_APP = {
	/*全ノードの格納配列*/
	Nodes : {},
	
	/*弾性係数とバネの自然長さ*/
	K : 4.0,	
	L : 50.0,
	
	/*反発係数*/
	R : 10.0,
	
	/*ノードの追加*/
	AddNode : function(URL,Node){ 
		this.Nodes[URL] = Node;
		console.log("Node add : " + URL);
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
//			var dist = Math.sqrt(Math.abs(distX*distX + distY*distY + distY*distZ));
			var dist = Math.sqrt(Math.abs(distX*distX + distZ*distZ));
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
	
	
	/*指定ノードを動かす*/
	MoveNode : function(nodeIndex,spring_force,repulsive_force,dt){
		this.Nodes[nodeIndex].x += Math.floor(dt*(spring_force.sp_x + repulsive_force.rp_x));
//		this.Nodes[nodeIndex].y += Math.floor(dt*(spring_force.sp_y + repulsive_force.rp_y));
		this.Nodes[nodeIndex].y += 0;
		this.Nodes[nodeIndex].z += Math.floor(dt*(spring_force.sp_z + repulsive_force.rp_z));
	},
	

	/*ノードをすべて表示（デバッグ用）*/
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



	/* 木をノードに格納 */
	parseTree : function(tree,parent){
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
				addedNode.adjacencyNodes[parent] = this.Nodes[parent];
			}

			// ノード加える
			this.AddNode(arr[3],addedNode);

			// 子を　adjacencyNodes　に加える
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





	/* ノードから木を得る */
	parseNodes : function(tree){
		if(tree === null){
			return null;
		}
		for (var prop in tree){
			
			// 座標＋URL文字列作る
			var propArr = prop.split(",");
			var node = this.Nodes[propArr[3]];
			var index = [node.x , node.y , node.z , propArr[3]].join(",");

			// 配列に格納
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