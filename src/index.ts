import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CubeModel from "../assests/models/cube_white.glb";
import Ammo from "ammojs-typed";
import Testmodul from "../assests/models/testmodule.glb";
import { Loader, DoubleSide, TetrahedronBufferGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AmbientLight } from "three";
import { BreakScreen } from "./screens/BreakScreen";
import { Key, InputHandler } from "./input/InputHandler";
import Portal from "../assests/portal/portal.glb";
import { BasisTextureLoader } from "three/examples/jsm/loaders/BasisTextureLoader.js"

let inputHandler: InputHandler;
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let cube;
let testmodul;
let portal, portalTexture;

let pause = new BreakScreen();

/**
 * Input handlers regarding player movement and game mechanics, which will repeat on a regular basis
 */
const setupInputHandler = () => {
  inputHandler = new InputHandler();
  const detachWindow = inputHandler.attach(window);
  inputHandler.observeKeys([
    Key.ArrowUp,
    Key.ArrowLeft,
    Key.ArrowRight,
    Key.ArrowDown,
    "W",
    "A",
    "S",
    "D",
  ]);
};

/**
 * Event handlers regarding single-time events
 */
const setupEventListeners = () => {
  window.addEventListener("keydown", ({ key }) => {
    if (key === Key.Escape) {
      pause.switchVisibleStatus();
    }
  });

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    // without updating the camera aspect ration, our scene will be distorted
    camera.aspect = window.innerWidth / window.innerHeight;

    // needs to be called in order to have changes taking effect
    camera.updateProjectionMatrix();
  });

  window.addEventListener("contextmenu", (event) => {
    if (!pause.isVisible()) event.preventDefault();
  });
};

//scene setup
const setupGraphics = async () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.5,
    100
  );

  camera.position.set(0, 4, 20);

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

  //pointlight
  let pointLight1 = new THREE.PointLight(0xfffff, 1, 2);
  pointLight1.position.set(-1, 2, -1);
  scene.add(pointLight1);

  let pointLight2 = new THREE.PointLight(0xfffff, 1, 2);
  pointLight2.position.set(-1, 2, 1);
  scene.add(pointLight2);

  let pointLight3 = new THREE.PointLight(0xfffff, 1, 2);
  pointLight3.position.set(1, 1, 1);
  scene.add(pointLight3);

  //make cube with three.js
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var cubeMaterial = [
    new THREE.MeshPhongMaterial({ color: 0xfffff, side: THREE.DoubleSide }),
    new THREE.MeshPhongMaterial({ color: 0xfffff, side: THREE.DoubleSide }),
    new THREE.MeshPhongMaterial({ color: 0xfffff, side: THREE.DoubleSide }),
    new THREE.MeshPhongMaterial({ color: 0xfffff, side: THREE.DoubleSide }),
    new THREE.MeshPhongMaterial({ color: 0xfffff, side: THREE.DoubleSide }),
    new THREE.MeshPhongMaterial({ color: 0xfffff, side: THREE.DoubleSide }),
  ];

  var cube1 = new THREE.Mesh(geometry, cubeMaterial);
  scene.add(cube1);
  cube1.position.set(-1, 2, -1);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

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
          //let geometry = new THREE.BoxGeometry( 1, 1, 1 );
          //let material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
          // let cube = new THREE.Mesh(geometry, material);
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

  //Load Portal
  const loadPortal = () =>
  new Promise((resolve, reject) => {
    loader.load(
      Portal,
      function (gltfPortal) {
        gltfPortal.scene.scale.y = 2.5;
        gltfPortal.scene.scale.z = 3;
        portal = gltfPortal.scene;
        scene.add(portal);
        resolve();
      },
      undefined,
      function (error) {
        console.error(error);
        reject();
      }
    );
  });
  await loadPortal();

  portal.position.set(0.58, 0.7, -21)

  let pointLightPortal1 = new THREE.PointLight(0xffffff, 1.8, 10, 2);
  pointLightPortal1.position.set(0.1, 0.5, 0);
  portal.add(pointLightPortal1);

  let pointLightPortal2 = new THREE.PointLight(0x990e96, 1.5, 12, 2);
  pointLightPortal2.position.set(1, 0.5, 0);
  portal.add(pointLightPortal2);
};

var scaleTestmodel = function (testmodel) {
  testmodel.scene.scale.x = 0.25;
  testmodel.scene.scale.y = 0.25;
  testmodel.scene.scale.z = 0.25;
};

const getPlayerMovement = () => {
  let left = inputHandler.isPressed([Key.ArrowLeft, "A"]);
  let right = inputHandler.isPressed([Key.ArrowRight, "D"]);

  let up = inputHandler.isPressed([Key.ArrowUp, "W"]);
  let down = inputHandler.isPressed([Key.ArrowDown, "S"]);

  let moveX = Number(right) - Number(left);
  let moveZ = Number(down) - Number(up);

  return new THREE.Vector3(moveX, 0, moveZ);
};

const checkIfWon = () => {

  let atGoalX: boolean = false;
  let atGoalZ: boolean = false;

  if (0.58 < cube.position.x && cube.position.x < 1){
    atGoalX = true
  }

  if (-21.5 < cube.position.z && cube.position.z < -20.5) {
    atGoalZ = true;
  }

  if(atGoalX && atGoalZ) {
    
    alert("YOU WON!");
    location.reload();
  }
}

const animate = () => {
  const vector = getPlayerMovement();
  vector.multiplyScalar(0.13);
  cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), -(vector.x / 4));
  cube.translateY(vector.y);
  cube.translateZ(vector.z);

  let PivotPoint = new THREE.Object3D();
  cube.add(PivotPoint);
  PivotPoint.add(camera);

  checkIfWon();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

Ammo().then(start);

async function start() {
  setupEventListeners();
  setupInputHandler();
  await setupGraphics();
  animate();
}
