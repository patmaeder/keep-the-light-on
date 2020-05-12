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
import {StartScreen} from "./screens/StartScreen";
import Light from "./beans/Light";
import {Object3D, PointLight} from "three";
import {DoubleSide} from "three";

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
let gui: GUI;
let debugDrawer = new DebugDrawer();
let posArr= [
    {x: 22.079566955566406, y: 17.419992446899414, z: -13.481974601745605},
    {x: 22, y: 48, z: -20},
    {x: 26.181129455566406, y: 17.419992446899414, z: -10.475132942199707},
    {x: 51.5322151184082, y: 17.419994354248047, z: -3.3070199489593506},
    {x: 12.259516716003418, y: 17.419992446899414, z: -40.222694396972656},
    {x: 40.884971618652344, y: 12.319998741149902, z: -63.711273193359375},
    {x: 66.48548889160156, y: 15.548307418823242, z: -75.95284271240234},
    {x: 59.88838195800781, y: 1.339999794960022, z: -98.68903350830078},
    {x: 160.81817626953125, y: 1.339999794960022, z: -99.19303894042969},
    {x: 20.437543869018555, y: 1.3399999141693115, z: -95.42516326904297}
    ];
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
  let previousValue: number;
  let isPressed: boolean = false;
  let angle: number = 0;

  function setCameraPosition() {
    document.addEventListener("mousemove", function getDifference(
      event: MouseEvent
    ) {
      if (isPressed) {
        let difference = previousValue - event.clientX;
        console.log("Differenz: " + difference);
        previousValue = event.clientX;

        if (difference < 0) {
          difference = difference * -1;
          angle = angle + Math.round(Math.sqrt(difference)) * -1;
        } else {
          angle = angle + Math.round(Math.sqrt(difference));
        }

        let radians = angle * (Math.PI / 180);
        let xValue = Math.sin(radians) * 20;
        let zValue = Math.cos(radians) * 20;
        console.log("Y-Wert: " + xValue, "X-Wert: " + zValue);
        camera.position.set(xValue, 4, zValue);
        camera.lookAt(
          cube.getModel().position.x,
          cube.getModel().position.y + 1,
          cube.getModel().position.z
        );
      } else {
        document.removeEventListener("mousemove", getDifference);
      }
    });
  }

  document.addEventListener("mousedown", (event: MouseEvent) => {
    previousValue = event.clientX;
    setCameraPosition();
    isPressed = true;
  });

  document.addEventListener("mouseup", (event: MouseEvent) => {
    isPressed = false;
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

  renderer = new THREE.WebGLRenderer({antialias: true});
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
   * Start movable object
   */
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshPhongMaterial({
    refractionRatio: 0.92,
    reflectivity: 0,
    shininess: 30,
    flatShading: true,
  });
  let box = new THREE.Mesh(geometry, material);
  box.castShadow = true;
  box.receiveShadow = true;
  const movable = new Movable();
  console.log(box);
  await movable.init(box, {x: 26, y: 48, z: -20});
  scene.add(box);
  physics.addPhysicsToMesh(box, movable.initRigidBody());


  let geoL = new THREE.BoxGeometry(1, 1, 1);
  let matL = new THREE.MeshPhongMaterial({
    opacity: 0.3,
    transparent: true,
    color: 0xffff,
    side: DoubleSide,
  });

  for (let i = 0; i < posArr.length; i++) {
    let light = new THREE.PointLight(0xfffff, 5, 20);
    light.name = "Light-" + i;
    let MeshL = new THREE.Mesh(geoL, matL);
    light.name = "Mesh-" + i;
    const lichter = new Light();
    await lichter.init(MeshL, posArr[i], light);
    scene.add(light);
    scene.add(MeshL);
    physics.addPhysicsToMesh(MeshL, lichter.initRigidBody());
    var cons: Ammo.btRigidBody = lichter.getModel().userData.rigidBody;
    console.log(cons.getWorldTransform().getOrigin().x(),cons.getWorldTransform().getOrigin().y(), cons.getWorldTransform().getOrigin().z());
  }
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

  if (8 < cube.getModel().position.x && cube.getModel().position.x < 13) {
    atGoalX = true;
  }

  if (0 < cube.getModel().position.y && cube.getModel().position.y < 2) {
    atGoalX = true;
  }

  if (
    -45 < cube.getModel().position.z &&
    cube.getModel().position.z < -41
  ) {
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

  /*const collectLights = () => {
    if ()
  }*/


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
