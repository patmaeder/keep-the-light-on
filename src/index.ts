import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CubeModel from "../assests/models/cube.glb";
import Ammo from "ammojs-typed";
import {BreakScreen} from "./screens/BreakScreen";
import Testmodul from "../assests/models/testmodule.glb";
import { Loader, DoubleSide, TetrahedronBufferGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";



let renderer, scene, camera;

let moveState = { forward: 0, backwards: 0, left: 0, right: 0 };

let cube;

let testmodul;

//TODO Move to KeyHandler.ts
function setupEventHandlers() {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}
let pause = new BreakScreen();
//TODO Move to KeyHandler.ts
function handleKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case "w":
      moveState.forward = 1;
      break;
    case "s":
      moveState.backwards = 1;
      break;
    case "a":
      moveState.left = 1;
      break;
    case "d":
      moveState.right = 1;
      break;
    case "Escape":
      pause.switchVisibleStatus();
      break;
  }
}

//TODO Move to KeyHandler.ts
function handleKeyUp(event: KeyboardEvent) {
  switch (event.key) {
    case "w":
      moveState.forward = 0;
      break;
    case "s":
      moveState.backwards = 0;
      break;
    case "a":
      moveState.left = 0;
      break;
    case "d":
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

  let controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(20, 30, -10);
  controls.update();
  
  var loader = new GLTFLoader();

  //TODO Move to Cube.ts
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
          cube.position.set(3.5, 0.95, -6);
          cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);
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


  //Load Tesmodul
  const loadTestmodul = () =>
  new Promise((resolve, reject) => {
    loader.load(
      Testmodul,
      function (gltfTestmodul) {
        gltfTestmodul.scene.scale.x = 0.007;
        gltfTestmodul.scene.scale.y = 0.007;
        gltfTestmodul.scene.scale.z = 0.007;
        testmodul = gltfTestmodul.scene;
        scene.add(testmodul);
        resolve();
      },
      undefined,
      function (error) {
        console.error(error);
        reject();
      }
    );
  });
  await loadTestmodul();
};

var scaleTestmodel = function(testmodel){
  testmodel.scene.scale.x = 0.25;
  testmodel.scene.scale.y = 0.25;
  testmodel.scene.scale.z = 0.25;
}

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
