var scene;
var camera;
var renderer;
var mesh1;

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function inicjujAnimacje(file){

    renderer = new THREE.WebGLRenderer({canvas:document.getElementById('my_canvas'),antialias:true});
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight );

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,  window.innerWidth/window.innerHeight, 0.1, 1000);

    window.addEventListener('resize', resize);

    var light = new THREE.PointLight(0xffffff, 1);
    light.position.set( 0, 0, 50 );
    scene.add(light);

    var texture = new THREE.TextureLoader().load(file);
    var material = new THREE.MeshLambertMaterial();
    material.map = texture;
    var geometry1 = new THREE.SphereGeometry(150, 40, 40);
            
    mesh1 = new THREE.Mesh( geometry1, material );
    mesh1.position.set(0,0,-300);
    scene.add(mesh1);

    // OBJLoader.loadModel(scene);

    requestAnimationFrame( render );
}


function render() {
    mesh1.rotation.y += 0.01;
    
    renderer.render( scene, camera );    
    requestAnimationFrame( render ); 
}