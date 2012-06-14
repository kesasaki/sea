function threeStart() {
  initThree();
  initCamera();
  initScene();    
  initLight();
  initTree();
  //initObject();
  //loop();
}


/*
var t=0;
function loop() {
  t++;
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( {x:0, y:0, z:0 } );
	renderer.clear();
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
	stats.update();

} */ 