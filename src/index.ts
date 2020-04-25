import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CubeModel from "../assests/models/cube.glb";
import Ammo from "ammojs-typed";
import { BreakScreen } from "./screens/BreakScreen";
import { Key, InputHandler } from "./input/InputHandler";

let inputHandler: InputHandler;
let renderer, scene, camera;
let cube;

let pause = new BreakScreen();

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
    Key.Escape,
  ]);
};

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

const getPlayerMovement = () => {
  let left = inputHandler.isPressed([Key.ArrowLeft, "A"]);
  let right = inputHandler.isPressed([Key.ArrowRight, "D"]);

  let up = inputHandler.isPressed([Key.ArrowUp, "W"]);
  let down = inputHandler.isPressed([Key.ArrowDown, "S"]);

  let moveX = Number(right) - Number(left);
  let moveZ = Number(down) - Number(up);

  return new THREE.Vector3(moveX, 0, moveZ);
};

const animate = () => {
  const vector = getPlayerMovement();
  vector.multiplyScalar(0.13);
  cube.translateX(vector.x);
  cube.translateY(vector.y);
  cube.translateZ(vector.z);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

Ammo().then(start);

async function start() {
  setupInputHandler();
  await setupGraphics();
  animate();
}
