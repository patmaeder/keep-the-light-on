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
import Light from "./beans/Light";
import {Material, Mesh, Object3D, PointLight} from "three";
import { DoubleSide } from "three";

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
let posArr = [
  { x: 22.079566955566406, y: 17.419992446899414, z: -13.481974601745605 },
  { x: 22, y: 48, z: -20 },
  { x: 26.181129455566406, y: 17.419992446899414, z: -10.475132942199707 },
  { x: 51.5322151184082, y: 17.419994354248047, z: -3.3070199489593506 },
  { x: 12.259516716003418, y: 17.419992446899414, z: -40.222694396972656 },
  { x: 40.884971618652344, y: 12.319998741149902, z: -63.711273193359375 },
  { x: 66.48548889160156, y: 15.548307418823242, z: -75.95284271240234 },
  { x: 59.88838195800781, y: 1.339999794960022, z: -98.68903350830078 },
  { x: 20.116077423095703, y: 6.679998874664307, z: -30.966354370117188},
  {x: 47.247779846191406, y: 17.419992446899414, z: -12.239371299743652}
];
let pause = new BreakScreen();
let lightCounter = 0;
let lichterArr: Array<Ammo.btRigidBody> = [];

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
   * Start movable objects
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
  await movable.init(box, { x: 26, y: 48, z: -20 });
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
    let light = new THREE.PointLight(0x751085, 3, 3);
    let MeshL = new THREE.Mesh(geoL, matL);
    light.name = "Mesh-" + i;
    const lichter = new Light();
    await lichter.init(MeshL, posArr[i], light);
    // das mesh muss zur Szene hinzugefügt werden
    scene.add(MeshL);
    physics.addPhysicsToMesh(MeshL, lichter.initRigidBody());
    var cons: Ammo.btRigidBody = lichter.getModel().userData.rigidBody;
    lichterArr.push(cons);
    console.log(
      cons.getWorldTransform().getOrigin().x(),
      cons.getWorldTransform().getOrigin().y(),
      cons.getWorldTransform().getOrigin().z()
    );
  }

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

  /* Rätsel 1 - Türme */
  new Movable()
      .init(Movable.createBox(1, 7, 2), {
        x: 126,
        y: 1.3399999141693115,
        z: -19,
      })
      .show(scene, physics);

  new Movable()
      .init(Movable.createBox(4, 4, 4), {
        x: 99,
        y: -17.199995040893555,
        z: -41.74705123901367,
      })
      .show(scene, physics);

  new Movable()
      .init(Movable.createBox(2, 2, 4), {
        x: 99,
        y: -13,
        z: -41.74705123901367,
      })
      .show(scene, physics);

  new Movable()
      .init(Movable.createBox(2, 1, 3), {
        x: 99,
        y: -11,
        z: -41.74705123901367,
      })
      .show(scene, physics);
  
  new Movable()
      .init(Movable.createBox(6, 2, 3), {
        x: 104,
        y: -17.199996948242188,
        z: -46.39596176147461,
      })
      .show(scene, physics);

  new Movable()
      .init(Movable.createBox(2, 2, 3), {
        x: 104,
        y: -15,
        z: -46.39596176147461,
      })
      .show(scene, physics);

  new Movable()
      .init(Movable.createBox(2, 2, 3), {
        x: 104,
        y: -13,
        z: -46.39596176147461,
      })
      .show(scene, physics);

  new Movable()
      .init(Movable.createBox(4, 3, 5), {
        x: 102,
        y: -17.199995040893555,
        z: -37.59646224975586,
      })
      .show(scene, physics);

  new Movable()
      .init(Movable.createBox(2, 6, 2), {
        x: 102,
        y: -14,
        z: -37.59646224975586,
      })
      .show(scene, physics);

  new Movable()
      .init(Movable.createBox(2, 9, 2), {
        x: 107,
        y: -17.199993133544922,
        z: -32.21832275390625,
      })
      .show(scene, physics);




  new Movable()
      .init(Movable.createBox(10, 2, 1), {
        x: 110,
        y: -17.199996948242188,
        z: -46.61009216308594,
      })
      .show(scene, physics);


      /* Rätsel 2 - Treppe bauen */
  new Movable()
  .init(Movable.createBox(3, 2, 3), {
    x: 21.553131103515625,
    y: 3.8061070442199707,
    z: -8.099748611450195,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(3, 1, 3), {
    x: 8.890450477600098,
    y: 13.219998359680176,
    z: -10.046850204467773,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(3, 5, 3), {
    x: 72.5328598022461,
    y: 1.3399999141693115,
    z: -9.398832321166992,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(6, 4, 3), {
    x: 68.68604278564453,
    y: 1.339999794960022,
    z: -19.65791130065918,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(3, 3, 3), {
    x: 62.535186767578125,
    y: 1.339999794960022,
    z: -9.57660961151123,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(3, 2, 5), {
    x: 67.32130432128906,
    y: 1.339999794960022,
    z: -27.18347930908203,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(1, 1, 1), {
    x: 96.60997772216797,
    y: 4.519998073577881,
    z: -28.77609634399414,
  })
  .show(scene, physics);


  


  /* Rätsel 3 - Weg bahnen */

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 105.61286163330078
    y: 1.3399999141693115,
    z: -100.41109466552734,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 99.084716796875
    y: 1.3399999141693115,
    z: -104.68998718261719,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 97.084716796875
    y: 1.3399999141693115,
    z: -102.68998718261719,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 91.52635192871094
    y: 1.3399999141693115,
    z: -102.28218078613281,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 91.18050384521484
    y: 1.339999794960022,
    z: -97.33890533447266,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 110.90746307373047
    y: 1.339999794960022,
    z: -93.74198150634766,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 103.90746307373047
    y: 1.339999794960022,
    z: -90.74198150634766,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 100.90746307373047
    y: 1.339999794960022,
    z: -88.74198150634766,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 101.90746307373047
    y: 1.339999794960022,
    z: -85.74198150634766,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 101.90746307373047
    y: 1.339999794960022,
    z: -98.74198150634766,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 106.90746307373047
    y: 1.339999794960022,
    z: -104.74198150634766,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 117.90746307373047
    y: 1.339999794960022,
    z: -99.74198150634766,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 115.90746307373047
    y: 1.339999794960022,
    z: -85.74198150634766,
  })
  .show(scene, physics);

  new Movable()
  .init(Movable.createBox(4, 4, 4), {
    x: 117.90746307373047
    y: 1.339999794960022,
    z: -96.74198150634766,
  })
  .show(scene, physics);

};

const collectLights = () => {
  for (let i = 0; i < posArr.length; i++) {
    /*console.log((posArr[i].x + 1) > cube.getModel().position.x && (posArr[i].x -1) < cube.getModel().position.x,
        (posArr[i].y + 1) > cube.getModel().position.y && (posArr[i].y - 1) < cube.getModel().position.y ,
        (posArr[i].z + 1) > cube.getModel().position.z && (posArr[i].z -1) < cube.getModel().position.z);*/
    if ((posArr[i].x + 1) > cube.getModel().position.x && (posArr[i].x -1) < cube.getModel().position.x
        && (posArr[i].y + 1) > cube.getModel().position.y && (posArr[i].y - 1) < cube.getModel().position.y){
      if (lichterArr[i]){
        console.log(scene.getObjectByName("Mesh-" + i));
        lightCounter+=1;
        console.log("licht entfernt")
        let MeshL = scene.getObjectByName("Mesh-" + i);
        scene.remove(MeshL.parent);
        console.log(MeshL.parent);
        physics.getPhysicsWorld().removeRigidBody(MeshL.parent.userData.rigidBody);
        var meshPar: Mesh = <Mesh> MeshL.parent;
        /*var meshParMat = <Material> meshPar.material;
        meshParMat.dispose();
        meshPar.geometry.dispose();*/
        meshPar.remove(MeshL);
        lichterArr[i] = undefined;
      }
    }
  }
  return lightCounter;
  }


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



  gui.updateCollectedLights(collectLights());
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
