var width, height;
var renderer;


var container, stats;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


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





var circle = Array();
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
		//line.rotation.z = 90 * Math.PI / 180;
		
		scene.add( line );

		line = new THREE.Line( geometry, material );
		line.position.x = ( i * 100 ) - 2000;
		line.rotation.y = 90 * Math.PI / 180;
		//line.rotation.x = 90 * Math.PI / 180;
		scene.add( line );

	}


}


function renderCircle(x,y,z){
	var circle = new THREE.Mesh(
		new THREE.CylinderGeometry(100, 100, 0, 50, 50, false),		//形状の設定
		new THREE.MeshLambertMaterial({
         	//map: new THREE.Texture( generateSprite() ),
         	//blending: THREE.AdditiveBlending,
         	color: Math.random() * 0xffffff,
         	opacity: 0.3,
			
         	}) //材質の設定
	);
	
	var panel = new THREE.Mesh(
		new THREE.PlaneGeometry(100, 80),	//形状の設定
		new THREE.MeshLambertMaterial({
			color: Math.random() * 0xffffff,
			opacity: 0.3,
			
			}) //材質の設定
	);
	
	scene.add(circle);
	scene.add(panel);
	circle.position.set(x,y,z);
	panel.position.set(x, y + 70, z);
	circle.rotation.set(angle,angle,angle);
	panel.rotation.set(0,angle,angle);
}
  
  
  
  //Line(Sphere)をレンダリングする関数
  function renderLine(x0,y0,z0,x1,y1,z1){//2つの位置はcircleの位置
	  
	  var xx0, zz0, xx1, zz1;
	  
	  calcLinePos();
	  
	  //var distance = Math.sqrt(Math.pow(xx0 - xx1, 2) + Math.pow(zz0 - zz1, 2));
	  var sphere_num = 10;
	  
	  for (var i = 0; i < sphere_num; i++){
		  
		
		  
	  	var sphere = new THREE.Mesh(
			new THREE.SphereGeometry(10,20,20),
			new THREE.MeshLambertMaterial({color: 0x000000})	
		);
	  
	  	sphere.position.set(
			xx0 + ( xx1 - xx0 ) / ( sphere_num - 1 ) * i,
			y0  + ( y1  - y0  ) / ( sphere_num - 1 ) * i,
			zz0 + ( zz1 - zz0 ) / ( sphere_num - 1 ) * i
			);
	  	scene.add(sphere);
	  }
	  
	  
	  
	  //2点のcirlteの位置からLineの先端部の位置を計算する関数
	  function calcLinePos(){
		var dis = 60;//横移動距離
		  
		if(x0 > x1){
			xx0 = x0 - dis;
			xx1 = x1 + dis;
		} else {
			xx0 = x0 + dis;
			xx1 = x1 - dis;	
		}
		
		if(z0 > z1){
			zz0 = z0 - dis;
			zz1 = z1 + dis;
		} else {
			zz0 = z0 + dis;
			zz1 = z1 - dis;	
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















/*
var t=0;
function loop() {
  t++;
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( {x:0, y:0, z:0 } );
	//circle[0].position.set(t%500,-100,0);
	//circle[1].position.set(t%500,100,0);
	//circle[0].rotation.set( t/100, t/100, t/100 );
	//circle[1].rotation.set( t/100, t/100, t/100 );
	//circle[2].rotation.set( 0, 0, t/100 );
	renderer.clear();
	renderer.render(scene, camera);
	//renderer.setClearColor( scene.fog.color, 1 );
	//renderer.sortObjects = false;
	window.requestAnimationFrame(loop);
	stats.update();

}  

function threeStart() {
  initThree();
  initCamera();
  initScene();    
  initLight();
  initObject();
  loop();
}
*/