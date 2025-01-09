import * as THREE from "../libs/three/three.module.js";

import { FBXLoader } from "../libs/three/addons/loaders/FBXLoader.js";

const clock = new THREE.Clock();
const manager = new THREE.LoadingManager();
const loader = new FBXLoader(manager);

let camera, scene, renderer, object;
let mixer = [];

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  scene.fog = new THREE.Fog(0xa0a0a0, 300, 10000);

  scene.add(new THREE.HemisphereLight(0xfbfdd3, 0x444444, 1.5));

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(500, 15, 500);
  dirLight.rotateX(60);
  scene.add(dirLight);

  // ground
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);

  //loader = new FBXLoader(manager);
  loadAsset("test2");
  loadAsset("test3");
  loadAsset("test4");
  loadAsset("test5");
  loadAsset("test6");
  //loadAsset("table");

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

/*   const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 100, 0);
  controls.update(); */
}

function loadAsset(asset) {
  loader.load("assets/" + asset + ".fbx", function (group) {
    console.log("assets : " + asset, group);

/*     group.children
      .filter((c) => c instanceof THREE.Bone)
      .forEach((c) => {
        console.log(c);
        c.visible = false;
      }); */


    object = group;
    if (object.animations && object.animations.length) {
      let mixerTmp = new THREE.AnimationMixer(object);
      mixer.push(mixerTmp);
      const action = mixerTmp.clipAction(object.animations[0]);
      action.play();
    }
    object.rotateX(-Math.PI / 2);
    //console.log(object.rotation);
    scene.add(object);
  });
}

function animate() {
  const delta = clock.getDelta();

  camera.position.x = 2.2629066445888526;
  camera.position.y = 136.5092289232063;
  camera.position.z = 165.4798871740988;

  camera.rotation.x = -0.039315199868861624;
  camera.rotation.y = 0.013663396354001241;
  camera.rotation.z = 0.0005374393252917739;

  mixer.forEach((annim) => {
    annim.update(delta);
  });
  //if (mixer) mixer.update(delta);

  renderer.render(scene, camera);

  //stats.update();
}

init();
