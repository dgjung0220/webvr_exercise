var scene;
var renderer;
var camera;
var cube;

function drawScene() {
    var aspect = window.innerWidth / window.innerHeight;

    scene = new THREE.Scene();
    // PerspectiveCamera
    // - FOV - aspectRatio - depthNear - depthFar
    camera = new THREE.PerspectiveCamera(75,aspect, 0.1 , 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);    
    document.body.appendChild(renderer.domElement);

    createObjects();
    camera.position.z = 5;

    // Webgl compatibility check
    if (Detector.webgl) {
        animate();        
    } else {
        var warning = Detector.getWebGLErrorMessage();
        document.getElementById('container').appendChild(warning);
    }
}

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;

    renderer.render(scene, camera);
}

function createObjects() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({color:0x00ff00});
    cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
}

window.addEventListener('load', drawScene);