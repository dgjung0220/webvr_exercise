// more information : https://developer.mozilla.org/en-US/docs/Web/API/VRDisplay

var vrDisplay
var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var vrButton = document.getElementById('VRButton');

function onLoad() {

    if(navigator.getVRDisplays) {
        console.log('WebVR 1.1 supported');

        navigator.getVRDisplays().then(function(displays){
            
            // Get Display attached to the computer
            if (displays.length > 0) {
                vrDisplay = displays[0];
            }
            
            // get device information
            debug_getDeviceInfo();
            setVRButtonEvent();
        });
        
    }
}


function setVRButtonEvent() {
    
    vrButton.addEventListener('click', function(){
        if (vrButton.textContent === 'Start VR display') {
            
            // starts the VRDisplay presenting a scene.
            var layers = [
                {
                    source : canvas
                }
            ]
            vrDisplay.requestPresent(layers).then(function() {
                console.log('Presenting to WebVR display');

                // set the canvas size to the size of the vrDisplay viewport

                // VREyeParameters object containing the eye parameters for the specified eye.
                var leftEye = vrDisplay.getEyeParameters('left');
                var rightEye = vrDisplay.getEyeParameters('right');

                canvas.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
                canvas.height = Math.max(leftEye.renderheight, rightEye.renderheight) * 2;
                
                // stop the normal presentation, and start the vr presentation
                //window.cancelAnimationFrame(normal)

                drawScene();
                
                vrButton.textContent = 'Exit VR display'
            })
        }

    })
}

// draw scene using Three.js
function drawScene() {
    
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);

    document.body.appendChild(renderer.domElement);
    
    scene = new THREE.Scene();

    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

    // Create 3D object
    var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    var material = new THREE.MeshNormalMaterial();
    cube = new THRE.Mesh(geometry, material);

    // cube.position.set(0, -1);

    scene.add(cube);

}

// VRDisplay's Property
function debug_getDeviceInfo() {

    // Get VRDisplay's capabilities 
    var myCapabilities = vrDisplay.capabilities;
    console.log("Get VRDisplay's capabilities")
    console.log("Display can present content: " , myCapabilities.canPresent); 
    console.log("Display is separate from the computer's main display: ", myCapabilities.hasExternalDisplay);
    console.log("Display can return position info: ", myCapabilities.hasPostion);
    console.log("Display can return orientation info: ", myCapabilities.hasOrientation);
    console.log("Display max layers: ", myCapabilities.maxLayers);
    console.log("==========================================================================================")

    // Get & Set z-depth defining the far or near plane of the eye view frustum
    // Generally you should leave the value as is, but you might want to increase it if you are trying to improve performance on slower computers.
    console.log("VR Camera depth")
    console.log("DepthNear: ", vrDisplay.depthNear);
    console.log("DepthFar: ", vrDisplay.depthFar);
    console.log("change depth...")
    vrDisplay.depthNear = 1.0;
    vrDisplay.depthFar = 7000.0;
    console.log("DepthNear: ", vrDisplay.depthNear);
    console.log("DepthFar: ", vrDisplay.depthFar);
    console.log("==========================================================================================")

    
    // identifier for particular vrdisplay, also used as an association point in the Gamepad API.
    console.log("display id : " , vrDisplay.displayId);
    // human-readable name to identify the vrdisplay
    // ex. Oculus VR HMD (HMD), Oculus VR HMD (Sensor)
    console.log("display name : " , vrDisplay.displayName);
    // boolean value
    console.log("isConnected : ", vrDisplay.isConnected);
    console.log("isPresenting : ", vrDisplay.isPresenting);
    // VRStageParameters object containing room-scale parameters, if the VRDisplay is capable of supporting room-scale experiences.
    console.log("stageParameters : ", vrDisplay.stageParameters);

}


window.addEventListener('load', onLoad);