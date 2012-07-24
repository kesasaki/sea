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
	
//	getPositions();
	








	/* SPRING_APPのNodesの座標更新 */
	SPRING_APP.MoveAll();

	/* SPRING_APPから木を取得 */
	var outTree = SPRING_APP.parseNodes(positions);


	showTree(outTree,0);

	
	out = resultParse(outTree);

	insertData(out);
	
	moveCircles();
	
	count_cp = 0;
	
	moveLine();
	
	
	renderer.clear();
	renderer.render(scene, camera);
	//renderer.setClearColor( scene.fog.color, 1 );
	//renderer.sortObjects = false;
	//window.requestAnimationFrame(loop);
	stats.update();
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//ここでpositionsを更新する必要あり
	function getPositions(){
		
		//SPRING_APP.parseTree(positions,null); // これをすると毎loopで初期木を描画しちゃう
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
  initBane();
  initThree();
  initCamera();
  initScene();    
  initLight();
  initObject();
  setInterval(loop,100);
}


function initBane(){



	/* SPRING_APPに値をセット */
	SPRING_APP.parseTree(positions,null);






}



