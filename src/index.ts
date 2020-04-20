import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CubeModel from "../assests/models/cube.glb";
import Ammo from "ammojs-typed";

let renderer, scene, camera;

let moveState = { forward: 0, backwards: 0, left: 0, right: 0 };

let cube;

function setupEventHandlers() {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}

function handleKeyDown(event: KeyboardEvent) {
  switch (event.keyCode) {
    case 87:
      moveState.forward = 1;
      break;
    case 83:
      moveState.backwards = 1;
      break;
    case 65:
      moveState.left = 1;
      break;
    case 68:
      moveState.right = 1;
      break;
  }
}

function handleKeyUp(event: KeyboardEvent) {
  switch (event.keyCode) {
    case 87:
      moveState.forward = 0;
      break;
    case 83:
      moveState.backwards = 0;
      break;
    case 65:
      moveState.left = 0;
      break;
    case 68:
      moveState.right = 0;
      break;
  }
}

const setupGraphics = async () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.5,
    100
  );

  camera.position.set(0, 1, 5);

  let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
  hemiLight.color.setHSL(0.6, 0.6, 0.6);
  hemiLight.groundColor.setHSL(0.1, 1, 0.4);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  //Add directional light
  let dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(100);
  scene.add(dirLight);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var loader = new GLTFLoader();

  const loadCube = () =>
    new Promise((resolve, reject) => {
      loader.load(
        CubeModel,
        function (gltf) {
          gltf.scene.scale.x = 0.25;
          gltf.scene.scale.y = 0.25;
          gltf.scene.scale.z = 0.25;
          //gltf.scene.scale.set(0.3, 0.3, 1);
          cube = gltf.scene;
          scene.add(cube);
          resolve();
        },
        undefined,
        function (error) {
          console.error(error);
          reject();
        }
      );
    });
  await loadCube();
};

var animate = function () {
  let moveX = moveState.right - moveState.left;
  let moveZ = moveState.backwards - moveState.forward;

  let vector = new THREE.Vector3(moveX, 0, moveZ);

  vector.multiplyScalar(0.13);
  cube.translateX(vector.x);
  cube.translateY(vector.y);
  cube.translateZ(vector.z);

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
};

Ammo().then(start);

async function start() {
  setupEventHandlers();
  await setupGraphics();
  animate();
}
