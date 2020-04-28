import * as THREE from "three";
import Ammo from "ammojs-typed";
import Testmodule from "../assests/models/testmodule.glb";
import { Loader, DoubleSide, TetrahedronBufferGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AmbientLight } from "three";
import { BreakScreen } from "./screens/BreakScreen";
import { Key, InputHandler } from "./input/InputHandler";
import PhysicsHandler from "./Physics";
import Cube from "./beans/Cube";
import { loadModel } from "./Loader";
import Stats from "stats-js";
import World from "./beans/World";

let physics: PhysicsHandler;
let inputHandler: InputHandler;
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let clock: THREE.Clock;
let cube: Cube;
let stats = new Stats();
let pause = new BreakScreen();

// TODO rewrite input handler to update ammo physics

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

/*
 * Initialize Lights
 */
const setupLights = async (scene: THREE.Scene) => {
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
};

/*
 * Initialize Graphics
 */
const setupGraphics = async () => {
  //setup Stats KLICK to Switch
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

  document.body.appendChild(stats.dom);

  scene = new THREE.Scene();
  setupLights(scene);
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.5,
    1000
  );
  camera.position.set(0, 4, 20);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  /**
   * Start loading Cube
   */
  cube = await new Cube().init(camera);
  //Add to Scene
  scene.add(cube.getModel());
  //Add to PhysicsWorld
  physics.addPhysicsToMesh(cube.getModel(), cube.initRigidBody());
  /**
   * End loading Cube
   */

  /**
   * Start loading Testmodule
   */
  const world = await new World().init();
  scene.add(world.getModel());
  physics.addPhysicsToMesh(world.getModel(), world.initRigidBody());

  /**
   * End loading Testmodule
   */
};

/**
 * Userinput for Cube Movement
 */
const getPlayerMovement = () => {
  let left = inputHandler.isPressed([Key.ArrowLeft, "A"]);
  let right = inputHandler.isPressed([Key.ArrowRight, "D"]);

  let up = inputHandler.isPressed([Key.ArrowUp, "W"]);
  let down = inputHandler.isPressed([Key.ArrowDown, "S"]);

  let moveX = Number(right) - Number(left);
  let moveZ = Number(down) - Number(up);

  return new Ammo.btVector3(moveX, 0, moveZ);
};

/**
 * Frame Loader - Called on every Frame
 */
const animate = async () => {
  stats.begin();
  let deltaTime = clock.getDelta();

  cube.move(getPlayerMovement());

  physics.updatePhysics(deltaTime);

  renderer.render(scene, camera);

  stats.end();
  requestAnimationFrame(animate);
};

/**
 * Async application start
 */
Ammo(Ammo).then(start);

async function start() {
  clock = new THREE.Clock();
  physics = new PhysicsHandler();
  setupEventListeners();
  setupInputHandler();
  await setupGraphics();
  animate();
}
