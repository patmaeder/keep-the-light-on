import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CubeModel from "../assests/models/cube.glb";
import Ammo from "ammojs-typed";
import {BreakScreen} from "./screens/BreakScreen";
import Testmodul from "../assests/models/testmoduleKlein.glb";
import { Loader } from "three";


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

  //make cube with three.js
  /*function makeInstance(geometry, color, x, y, z) {   
    const material = new THREE.MeshPhongMaterial({
    opacity: 0.5, 
    transparent: true,
  })
      const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
   
    cube.position.x = x;
    cube.position.set(x, y, z);
   
    return cube;
  }*/

  
  //cube Material



  
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


  /*let vectorTestmodul = new THREE.Vector3(0.1, 0.1, 0.1);


  testmodul.translateX(vectorTestmodul.x);
  testmodul.translateY(vectorTestmodul.y);
  testmodul.translateZ(vectorTestmodul.z);
  testmodul.position.set(0,0,0);*/

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

//Load Tesmodul
/*var scale = function (){
  let vector = new THREE.Vector3(0.25, 0.25, 0.25);
  vector.multiplyScalar(0.13);
  testmodul.translateX(vector.x);
  testmodul.translateY(vector.y);
  testmodul.translateZ(vector.z);
}*/
var loaderTestmodul = new GLTFLoader();
const loadTestmodul = () =>
new Promise((resolve, reject) => {
  loaderTestmodul.load(
    Testmodul,
    function (gltfTestmodul) {
      testmodul = gltfTestmodul.scene;
      gltfTestmodul.scene.scale.x = 0.25;
      gltfTestmodul.scene.scale.y = 0.25;
      gltfTestmodul.scene.scale.z = 0.25;
      //testmodul.scene.scale.set(0.3, 0.3, 1);
      //gltf.scene.scale.set(0.3, 0.3, 1)
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
Ammo().then(start);

async function start() {
  setupEventHandlers();
  await setupGraphics();
  await loadTestmodul();
  animate();
}
