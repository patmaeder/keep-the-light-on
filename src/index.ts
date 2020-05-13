import * as THREE from "three";
import Ammo from "ammojs-typed";
import { BreakScreen } from "./screens/BreakScreen";
import { InputHandler, Key } from "./input/InputHandler";
import PhysicsHandler from "./Physics";
import Cube from "./beans/Cube";
import Stats from "stats-js";
import World from "./beans/World";
import DebugDrawer from "./utils/DebugDrawer";
import Portal from "./beans/Portal";
import Timer from "./Timer";
import Movable from "./beans/Movable";
import Sound, { toggleBackgroundMusic } from "./effects/Sound";
import GUI from "./GUI";
import { StartScreen } from "./screens/StartScreen";

let debugging = window.location.pathname.includes("debug");
let physics: PhysicsHandler;
let inputHandler: InputHandler;
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let clock: THREE.Clock;
let cube: Cube;
let world: World;
let stats = new Stats();
let portalTexture;
let portal: Portal;
let licht1;
let licht2;
let gui: GUI;
let debugDrawer = new DebugDrawer();

let pause = new BreakScreen();
export let timer: Timer;

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
    " ",
  ]);
};

/**
 * Event handlers regarding single-time events
 */
const setupEventListeners = () => {
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

/**
 * Event handlers regarding mouse input to rotate the camera
 */
const setupCameraMovement = () => {
  let reference: number = window.innerWidth / 2;

  document.addEventListener("mousemove", function getDifference(
    event: MouseEvent
  ) {
    let difference = reference - event.clientX;
    let radians = difference * ((Math.PI * 2) / reference);
    let xValue = Math.sin(radians) * 10;
    let zValue = Math.cos(radians) * 10;

    camera.position.set(xValue, 4, zValue);
    camera.lookAt(
      cube.getModel().position.x,
      cube.getModel().position.y + 2,
      cube.getModel().position.z
    );
  });
};

/*
 * Initialize Lights
 */
const setupLights = (scene: THREE.Scene) => {
  let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
  hemiLight.color.setHSL(0.6, 0.6, 0.6);
  hemiLight.groundColor.setHSL(0.1, 1, 0.4);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  if (debugging) {
    //Add directional light
    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(100);
    scene.add(dirLight);
  }
};

/*
 * Initialize Graphics
 */
const setupGraphics = async () => {
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  scene = new THREE.Scene();
  setupLights(scene);
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.5,
    10000
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
  licht1 = new Cube();
  licht2 = new Cube();
  //Add to Scene
  scene.add(cube.getModel());
  //scene.add(licht1.getModel());
  //scene.add(licht2.getModel());

  //Add to PhysicsWorld
  physics.addPhysicsToMesh(cube.getModel(), cube.initRigidBody());
  //physics.addPhysicsToMesh(licht1.getModel(), licht1.initRigidBody());
  //physics.addPhysicsToMesh(licht2.getModel(), licht2.initRigidBody());

  /**
   * End loading Cube
   */

  /**
   * Start loading Testmodule
   */
  world = await new World().init();
  scene.add(world.getModel());
  physics.addPhysicsToMesh(world.getModel(), world.initRigidBody());
  /**
   * End loading Testmodule
   */

  /**
   * Start loading Portal
   */
  portal = await new Portal().init();
  //Add to Scene
  scene.add(portal.getModel());
  /**
   * End loading Portal
   */

  /**
   * Start movable objects
   */

  new Movable()
    .init(Movable.createBox(1, 1, 1), {
      x: 26,
      y: 48,
      z: -20,
    })
    .show(scene, physics);

  /*new Movable()
    .init(Movable.createBox(10, 5, 2), {
      x: 43,
      y: 48,
      z: -20,
    })
    .show(scene, physics);*/

  new Movable()
      .init(Movable.createBox(1, 7, 10), {
        x: 27,
        y: 1.3399999141693115,
        z: -24.838674545288086,
      })
      .show(scene, physics);
};

/**
 * Userinput for Cube Movement
 */
const getPlayerMovement = () => {
  let left = inputHandler.isPressed([Key.ArrowLeft, "A"]);
  let right = inputHandler.isPressed([Key.ArrowRight, "D"]);

  let up = inputHandler.isPressed([Key.ArrowUp, "W"]);
  let down = inputHandler.isPressed([Key.ArrowDown, "S"]);

  let space = inputHandler.isPressed(" ");

  let moveX = Number(right) - Number(left);
  let moveY = Number(space);
  let moveZ = Number(down) - Number(up);

  return new Ammo.btVector3(moveX, moveY, moveZ);
};

/**
 * Winning condition
 */
const checkIfWon = () => {
  let atGoalX: boolean = false;
  let atGoalY: boolean = false;
  let atGoalZ: boolean = false;

  if (9 < cube.getModel().position.x && cube.getModel().position.x < 10.5) {
    atGoalX = true;
  }

  if (0 < cube.getModel().position.y && cube.getModel().position.y < 1) {
    atGoalX = true;
  }

  if (-48 < cube.getModel().position.z && cube.getModel().position.z < -45) {
    atGoalZ = true;
  }

  if (atGoalX && atGoalZ) {
    alert("YOU WON!");
    location.reload();
  }
};

/**
 * Frame animation - Called on every Frame
 */
const animate = async () => {
  stats.begin();
  let deltaTime = clock.getDelta();
  //GUI
  //TODO collected Lights
  gui.updateCollectedLights(1);
  gui.updateTime(timer.Time);
  cube.move(getPlayerMovement());

  physics.updatePhysics(deltaTime);

  if (debugging) {
    debugDrawer.animate();
  }

  renderer.render(scene, camera);

  checkIfWon();
  requestAnimationFrame(animate);

  stats.end();
};

/**
 * Startscreen
 */
const setupStartScreen = () => {
  let test = new StartScreen();
  test.addButton("start", "start", () => {
    //Init Timer
    timer = new Timer();
    timer.start(100);
    //init GUI
    gui = new GUI();
    //toggle sound on
    //TODO make sound class able to put this in start()
    toggleBackgroundMusic();
    //Start game
    animate();
    //hide main menu
    test.switchVisibleStatus();

    //Start Break Menu Event Listener
    window.addEventListener("keydown", ({ key }) => {
      if (key === Key.Escape) {
        pause.switchVisibleStatus();
      }
    });
  });
  test.initButtons();
  test.switchVisibleStatus();
};

/**
 * Async application start
 */
Ammo(Ammo).then(start);
async function start() {
  globalThis.Ammo = Ammo;
  clock = new THREE.Clock();
  physics = new PhysicsHandler();
  setupEventListeners();
  setupCameraMovement();
  setupInputHandler();
  await setupGraphics();
  setupStartScreen();
  if (debugging) {
    debugDrawer.initDebug(scene, physics.getPhysicsWorld());
  }
}
