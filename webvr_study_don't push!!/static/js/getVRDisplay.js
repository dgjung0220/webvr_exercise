// more information : https://developer.mozilla.org/en-US/docs/Web/API/VRDisplay

/*******************
 * THREE.js Objects
*/
var scene;
var renderer;
var camera;

var vrDisplay;
var normalSceneFrame;
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
                window.cancelAnimationFrame(normalSceneFrame);
                drawVRScene();
                
                vrButton.textContent = 'Exit VR display'
            })
        } else {
            //vrDisplay.exitPresent();
            console.log('Stopped presenting to WebVR display');

            btn.textContent = 'Start VR display'
        }

    })
}

// draw scene using Three.js
function drawVRScene() {
    // Request the next frame of the animation
    normalSceneFrame = window.requestAnimationFrame(drawScene);

    var aspect = window.innerWidth / window.innerHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,aspect, 0.1 , 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createObjects();
    camera.position.z = 5;
    animate();
}

function animate() {
    console.log("animate VR Scene");
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function createObjects() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({color:0x00ff00});
    var cube = new THREE.Mesh(geometry, material);

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