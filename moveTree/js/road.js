if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;
var camera, controls, scene, renderer;
var light, pointLight;

var mesh;

var isFps = false;

var clock = new THREE.Clock();
var isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 90, onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0,
target = new THREE.Vector3();

var radius,xx,yy,zz,ccolor,picpath;

init();
animate();

function moveLink(){
	camera.position.y += 50;
	camera.rotation.y += 1.0;
}

function init() {

	// �R���e�i
	container = document.getElementById( 'container' );

	// �V�[��
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.0005 );

	// �J����
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 200, 0 );
	if(isFps){camera.rotation.set(0,0,0);}
	//camera.rotation.x -= Math.PI*60/180;
	//camera.rotation.y += Math.PI*90/180;
	//camera.rotation.z -= Math.PI*90/180;
	scene.add( camera );
	
	if(isFps){
		controls = new THREE.FirstPersonControls( camera );
		controls.movementSpeed = 70;
		controls.lookSpeed = 0.05;
		controls.noFly = true;
		controls.lookVertical = true;
	}

	// ����
	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0.5, 1 ).normalize();
	scene.add( light );

	// �n�ʂ̖�
	//makeWired(-100);
	//makeWired(-50);
	makeWired(0);
	//makeWired(50);
	//makeWired(100);

	// �p�l�����O�~����
	makePlace(100,0,0,'ytop.png');
	makePlace(200,0,100,'ytop.png');
	makePlace(200,0,0,'ytop.png');
	makePlace(200,0,-100,'ytop.png');
	makePlace(200,50,-100,'ytop.png');

/*
var amaterial = new THREE.MeshBasicMaterial({color:Math.random() * 0xffffff, opacity:0.5, reflectivity:true});
    var aplane = new THREE.Mesh(new THREE.Plane(150, 150), amaterial);
    
    scene.add(aplane);
*/
	// ��
	makeRoad(100,0,0,200,0,100,20);
	makeRoad(100,0,0,200,0,0,20);
	makeRoad(100,0,0,200,0,-100,20);
	makeRoad(100,0,0,200,50,-100,20);
	makeRoad(100,0,0,200,0,0,20);
	makeRoad(100,0,0,200,0,-100,20);
	makeRoad(100,0,0,200,50,-100,20);

	// �����_���[
	renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1, antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );

	// �R���e�i�[
	container.innerHTML = "";
	container.appendChild( renderer.domElement );

	if(!isFps){
		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	}
}
// �֐��F�Ԃ���
// �����F
function makeWired(height){
	var material_wireframe = new THREE.MeshLambertMaterial( { wireframe: true, wireframeLinewidth: 1 } );
	material_wireframe.color.setHSV( 0.5,1,1 );
	var plane = new THREE.PlaneGeometry( 1000, 1000, 5,5 );
	mesh = new THREE.Mesh( plane, material_wireframe );
	mesh.position.y = height;
	scene.add( mesh );
}


// �֐��F�������
// �����Fx1 y1 z1�@���͂���
//	 x2 y2 z2�@���I���
// 	 width ����
// �Ԓl�F�Ȃ�
function makeRoad(x1,y1,z1,x2,y2,z2,width){
	var a = x1 - x2;
	var b = z1 - z2;
	var c = y1 - y2;
	var distance = Math.sqrt(Math.pow(a,2) + Math.pow(b,2) + Math.pow(c,2));
	var roadGeo = new THREE.PlaneGeometry(distance,width);
	var roadMat = new THREE.MeshLambertMaterial({color: 0x89bdde});
	roadMat.color.setHSV(0.48,1,1);
	var road = new THREE.Mesh(roadGeo,roadMat);
	road.position.x = (x1 + x2)/2;
	road.position.z = (z1 + z2)/2;
	road.position.y = (y1 + y2)/2;
	road.rotation.y -= Math.atan(b/a);
	road.rotation.z += Math.atan(c/a); 
	scene.add(road);
}


// �֐��F�O�~�ƃp�l�������
// �����Fpicpath �摜�̃p�X
//	 xx yy zz ���W
// �Ԓl�F�Ȃ�
function makePlace(xx,yy,zz,picpath){
    
    				makePanel(xx,yy,zz);
	
	// �~���O�~
        makeCircleRag(xx,yy,zz,30,Math.random()*0xffffff);
/*
	var paPl = new THREE.PlaneGeometry(30,50);
	var paGe = new THREE.MeshLambertMaterial();
	var pa = new THREE.Mesh(paPl,paGe);
	pa.position.x = xx;
	pa.position.y = 30+yy;
	pa.position.z = zz;
	pa.lotation.x = 90*Math.PI/180;
	scene.add(pa);
*/
	// �p�l��
/*				var pa = new THREE.Mesh(
		new THREE.PlaneGeometry(30,50),
		new THREE.MeshLambertMaterial({
			map:new THREE.ImageUtils.loadTexture("ytop.png"), 
			color: 0xffffff, 
			overdraw: true,
			//reflective:true
		})
	);
	//pa.rotation.z += 90*Math.pi/180;
	//pa.rotation.x += 90*Math.pi/180;
	pa.position.x = xx;
	pa.position.z = zz;
	pa.position.y = 30+yy;
	scene.add(pa);

	var paMa = new THREE.MeshLambertMaterial(  );
	paMa.color.setHSV( 0.5,1,1 );
	var paGe = new THREE.PlaneGeometry(30,50);
	pa = new THREE.Mesh( paGe, psMs );
	pa.position.x = xx;
	pa.position.z = zz;
	pa.position.y = 30+yy;
	scene.add( pa );
*/			}

// �Ԓl�F�Ȃ�
function makePanel(x1,y1,z1){
	var paGeo = new THREE.PlaneGeometry(50,30);
	var texture = new THREE.ImageUtils.loadTexture('http://maiho.web.fc2.com/three/examples/bpanel.png');
	var paMat = new THREE.MeshLambertMaterial({map:texture,color:0x0000aa, opacity:0.5});
	paMat.color.setHSV(1,1,1);
	var pa = new THREE.Mesh(paGeo,paMat);
	pa.position.x = x1;
	pa.position.y = y1+10;
	pa.position.z = z1;
	pa.rotation.z = 90*Math.PI/180;
	scene.add(pa);
}

// �֐��F�~���O�~�����
// �����Fradius �~�̔��a
//	 ccolor �~�̐F
//	 xx yy zz ���W
// �Ԓl�FMesh
function makeCircleRag(xx,yy,zz,radius,ccolor){
	var material = new THREE.MeshLambertMaterial({color: ccolor});
        var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0, 50, 50, false), material);
        cylinder.overdraw = true;
	cylinder.position.x = xx;
	cylinder.position.y = yy+1;
	cylinder.position.z = zz;
	scene.add( cylinder );

	// ��
	var material_r = new THREE.MeshLambertMaterial({color: ccolor});
        var cylinder_r = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0, 50, 50, false), material_r);
        cylinder_r.overdraw = true;
	cylinder_r.position.x = xx;
	cylinder_r.position.y = yy+1;
	cylinder_r.position.z = zz;
	cylinder_r.rotation.z = 170*Math.PI/180;
	//scene.add(cylinder_r);
}

// �A�j���[�V����
function animate() {

	requestAnimationFrame( animate );
	render();

}

// ���v�X�V����
function render() {

	if(isFps){
		var delta = clock.getDelta(),
			time = clock.getElapsedTime() * 5;
		controls.update( delta );
	}else{
		lat = Math.max( - 85, Math.min( 85, lat ) );
		phi = ( 90 - lat ) * Math.PI / 180;
		theta = lon * Math.PI / 180;

		target.x = 500 * Math.sin( phi ) * Math.cos( theta );
		target.y = 500 * Math.cos( phi );
		target.z = 500 * Math.sin( phi ) * Math.sin( theta );

		camera.lookAt( target );
	}

	renderer.render( scene, camera );
}
function onDocumentMouseDown( event ) {

	event.preventDefault();

	isUserInteracting = true;

	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;

}

function onDocumentMouseMove( event ) {

	if ( isUserInteracting ) {

		lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
		lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
		render();

	}
}

function onDocumentMouseUp( event ) {

	isUserInteracting = false;
	render();

}

function onDocumentMouseWheel( event ) {

	camera.position.z += event.wheelDeltaY * 0.05;
	camera.updateProjectionMatrix();

	render();

}


function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		onPointerDownPointerX = event.touches[ 0 ].pageX;
		onPointerDownPointerY = event.touches[ 0 ].pageY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
		lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

		render();

	}

}