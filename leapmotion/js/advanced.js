(function() {

  var controller, cursor, initScene, stats;

  window.scene = null;

  window.renderer = null;

  window.camera = null;

  initScene = function(element) {
    var axis, pointLight;
    window.scene = new THREE.Scene();
    window.renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    element.appendChild(renderer.domElement);
    axis = new THREE.AxisHelper(200);
    scene.add(axis);
    scene.add(new THREE.AmbientLight(0x888888));
    pointLight = new THREE.PointLight(0xFFffff);
    pointLight.position = new THREE.Vector3(-20, 10, 0);
    pointLight.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(pointLight);
    window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.fromArray([0, 200, 500]);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    window.controls = new THREE.TrackballControls(camera);
    scene.add(camera);
    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      controls.handleResize();
      return renderer.render(scene, camera);
    }, false);
    return renderer.render(scene, camera);
  };

  // via Detector.js:
var webglAvailable  = ( function () { try { var canvas = document.createElement( 'canvas' ); return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ); } catch( e ) { return false; } } )();

  if (webglAvailable) {
    initScene(document.body);
  }

  window.controller = controller = new Leap.Controller;

  controller.use('handHold').use('transform', {
    position: new THREE.Vector3(1, 0, 0)
  }).use('handEntry').use('screenPosition').use('riggedHand', {
    parent: scene,
    renderer: renderer,
    scale: 1,
    positionScale:1,
    offset: new THREE.Vector3(0, 0, 0),
    renderFn: function() {
      renderer.render(scene, camera);
      return controls.update();
    },
    materialOptions: {
      wireframe:false
    },
    dotsMode:false,
    stats: stats,
    camera: camera,
    boneLabels: function(boneMesh, leapHand) {
      if (boneMesh.name.indexOf('Finger_03') === 0) {
        // return leapHand.pinchStrength;
      }
    },
    boneColors: function(boneMesh, leapHand) {
      if ((boneMesh.name.indexOf('Finger_0') === 0) || (boneMesh.name.indexOf('Finger_1') === 0)) {
        return {
          hue: 0.6,
          saturation: leapHand.pinchStrength
        };
      }
    },
    checkWebGL: true
  }).connect();
}).call(this);
