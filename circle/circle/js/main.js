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
	renderer.setSize(width, height );
	document.getElementById('canvas-frame').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);



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
  	//scene.add(camera);
  
}




var light;
function initLight() {  
  light = new THREE.DirectionalLight(0xFFFFFF, 1.0, 0);
  light.position.set( 500, 500, 200 );
  scene.add(light);
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

		var line = new THREE.Line( geometry, material );
		line.position.x = ( i * 100 ) - 2000;
		line.rotation.y = 90 * Math.PI / 180;
		//line.rotation.x = 90 * Math.PI / 180;
		scene.add( line );

	}




  for(var i=0; i<10; i++){
    circle[i] = new THREE.Mesh(
         new THREE.CylinderGeometry(100, 100, 0, 50, 50, false),                //形状の設定
         new THREE.MeshLambertMaterial({
         	//map: new THREE.Texture( generateSprite() ),
         	//blending: THREE.AdditiveBlending,
         	color: Math.random() * 0xffffff,
         	opacity: 0.3,
			
         	}) //材質の設定
    );
    //circle[i].overdraw = true;
    scene.add(circle[i]);
    circle[i].position.set(0,-200,1000 - 250 * i);
    circle[i].rotation.set(angle,angle,angle);
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




function generateSprite() {

	var canvas = document.createElement( 'canvas' );
	canvas.width = 16;
	canvas.height = 16;

	var context = canvas.getContext( '2d' );
	var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
	gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
	gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
	gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
	gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

	context.fillStyle = gradient;
	context.fillRect( 0, 0, canvas.width, canvas.height );

	return canvas;
}












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