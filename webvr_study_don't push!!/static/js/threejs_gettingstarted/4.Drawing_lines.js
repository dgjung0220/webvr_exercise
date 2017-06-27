var scene;
var renderer;
var camera;
var cube;

function drawScene() {
    var aspect = window.innerWidth / window.innerHeight;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45,aspect, 1 , 500);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);    
    document.body.appendChild(renderer.domElement);

    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0,0,0));

    createObjects();
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function createObjects() {

    // create a blue LineBasicMaterial
    var material = new THREE.LineBasicMaterial({color:0x0000ff});

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    geometry.vertices.push(new THREE.Vector3(10, 0, 0));

    var line = new THREE.Line(geometry, material);

    scene.add(line);
}

function onResize(e) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', onResize);
window.addEventListener('load', drawScene);