/*
 * Debug parameters.
 */
WebVRConfig = {
  /**
   * webvr-polyfill configuration
   */

  // Forces availability of VR mode.
  //FORCE_ENABLE_VR: true, // Default: false.
  // Complementary filter coefficient. 0 for accelerometer, 1 for gyro.
  //K_FILTER: 0.98, // Default: 0.98.
  // How far into the future to predict during fast motion.
  //PREDICTION_TIME_S: 0.040, // Default: 0.040 (in seconds).
  // Flag to disable touch panner. In case you have your own touch controls
  //TOUCH_PANNER_DISABLED: true, // Default: false.
  // Enable yaw panning only, disabling roll and pitch. This can be useful for
  // panoramas with nothing interesting above or below.
  //YAW_ONLY: true, // Default: false.
  // Enable the deprecated version of the API (navigator.getVRDevices).
  //ENABLE_DEPRECATED_API: true, // Default: false.
  // Scales the recommended buffer size reported by WebVR, which can improve
  // performance. Making this very small can lower the effective resolution of
  // your scene.
  //BUFFER_SCALE: 0.5, // default: 1.0
  // Allow VRDisplay.submitFrame to change gl bindings, which is more
  // efficient if the application code will re-bind it's resources on the
  // next frame anyway.
  // Dirty bindings include: gl.FRAMEBUFFER_BINDING, gl.CURRENT_PROGRAM,
  // gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING,
  // and gl.TEXTURE_BINDING_2D for texture unit 0
  // Warning: enabling this might lead to rendering issues.
  //DIRTY_SUBMIT_FRAME_BINDINGS: true // default: false
};

/************************************************************************************************************************* */

// Last time the scene was rendered.
var lastRenderTime = 0;
// Currently active VRDisplay.
var vrDisplay;
var boxSize = 50;
// Various global THREE.Objects.
var scene;
var cube;
var controls;
var effect;
var camera;

// EnterVRButton for rendering enter/exit UI.
var vrButton;

function initializeScene() {
  var renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(window.devicePixelRatio);

  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene();

  return renderer;
}

function onTextureLoaded(texture) {
  var geometry = new THREE.SphereGeometry(50, 200, 200);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide
  });

  // Align the skybox to the floor (which is at y=0).
  var mesh = new THREE.Mesh(geometry, material);
  skybox = new THREE.Mesh(geometry, material);
  scene.add(skybox);

  setupStage();
}

function onLoad() {
  var renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(window.devicePixelRatio);

  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene();
    
  var loader = new THREE.TextureLoader();

  // Create a three.js camera.
  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);

  controls = new THREE.VRControls(camera);
  controls.standing = true;
  camera.position.y = controls.userHeight;

  // Apply VR stereo rendering to renderer.
  effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  
  // Add a mars as a skybox. & Add earth as Sphere Object.
  loader.load('img/mars.jpg', onTextureLoaded);
  loader.load(
    'img/earthmap1k.png',
    function(texture) {
      var geometry = new THREE.SphereGeometry(0.5, 32, 32);
      var material = new THREE.MeshBasicMaterial({
        map: texture
      });
      
      var earthMesh = new THREE.Mesh(geometry, material);
      earthMesh.position.x = 1;
      earthMesh.position.y = 15;
      earthMesh.position.z = 7.25;

      scene.add(earthMesh);
    }
  )

  // Create 3D objects.
  var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  var material = new THREE.MeshNormalMaterial();
  cube = new THREE.Mesh(geometry, material);

  // Position cube mesh to be right in front of you.
  cube.position.set(0, controls.userHeight, -1);

  // Add cube mesh to your three.js scene
  scene.add(cube);

  window.addEventListener('resize', onResize, true);
  window.addEventListener('vrdisplaypresentchange', onResize, true);

  // Initialize the WebVR UI.
  var uiOptions = {
    color: 'black',
    background: 'white',
    corners: 'square'
  };
  vrButton = new webvrui.EnterVRButton(renderer.domElement, uiOptions);
  vrButton.on('exit', function() {
    camera.quaternion.set(0, 0, 0, 1);
    camera.position.set(0, controls.userHeight, 0);
  });
  vrButton.on('hide', function() {
    document.getElementById('ui').style.display = 'none';
  });
  vrButton.on('show', function() {
    document.getElementById('ui').style.display = 'inherit';
  });
  document.getElementById('vr-button').appendChild(vrButton.domElement);
  document.getElementById('magic-window').addEventListener('click', function() {
    vrButton.requestEnterFullscreen();
  });
}

// Request animation frame loop function
function animate(timestamp) {
  var delta = Math.min(timestamp - lastRenderTime, 500);
  lastRenderTime = timestamp;

  // Apply rotation to cube mesh
  cube.rotation.y += delta * 0.0006;

  // Only update controls if we're presenting.
  if (vrButton.isPresenting()) {
    controls.update();
  }
  // Render the scene.
  effect.render(scene, camera);

  vrDisplay.requestAnimationFrame(animate);
}

function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
function setupStage() {
  navigator.getVRDisplays().then(function(displays) {
    if (displays.length > 0) {
      vrDisplay = displays[0];
      if (vrDisplay.stageParameters) {
        setStageDimensions(vrDisplay.stageParameters);
      }
      vrDisplay.requestAnimationFrame(animate);
    }
  });
}

function setStageDimensions(stage) {
  // Make the skybox fit the stage.
  var material = skybox.material;
  scene.remove(skybox);

  // Size the skybox according to the size of the actual stage.
  var geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ);
  skybox = new THREE.Mesh(geometry, material);

  // Place it on the floor.
  skybox.position.y = boxSize/2;
  scene.add(skybox);

  // Place the cube in the middle of the scene, at user height.
  cube.position.set(0, controls.userHeight, 0);
}

window.addEventListener('load', onLoad);