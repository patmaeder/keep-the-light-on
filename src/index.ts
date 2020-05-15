import * as THREE from "three";
import {BoxGeometry, DoubleSide, Intersection, Mesh, Raycaster} from "three";
import Ammo from "ammojs-typed";
import {BreakScreen} from "./screens/BreakScreen";
import {InputHandler, Key} from "./input/InputHandler";
import PhysicsHandler from "./Physics";
import Cube from "./beans/Cube";
import Stats from "stats-js";
import World from "./beans/World";
import DebugDrawer from "./utils/DebugDrawer";
import Portal from "./beans/Portal";
import Timer from "./Timer";
import Movable from "./beans/Movable";
import Sound from "./effects/Sound";
import music from "../assets/music/Melt-Down_Looping.mp3";
import lightCollect from "../assets/music/sammeln/SynthChime2.mp3";
import GUI from "./GUI";
import {StartScreen} from "./screens/StartScreen";
import {VictoryScreen} from "./screens/VictoryScreen";
import {Introduction} from "./screens/introduction/introduction";
import {IntroPage1} from "./screens/introduction/introduction-page1";
import {IntroPage2} from "./screens/introduction/introduction-page2";
import Light from "./beans/Light";
import {destroyElement, drawArrow} from "./utils/Utils";


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
let raycaster: Raycaster;
let portalTexture;
let portal: Portal;
let gui: GUI;
let debugDrawer = new DebugDrawer();
let backgroundMusic: Sound;
//###############################################################################Start: Alischa Thomas

let posArrLights = [
    {x: 22.079566955566406, y: 17.419992446899414, z: -13.481974601745605},
    {x: 22, y: 48, z: -20},
    {x: 26.181129455566406, y: 17.419992446899414, z: -10.475132942199707},
    {x: 51.5322151184082, y: 17.419994354248047, z: -3.3070199489593506},
    {x: 12.259516716003418, y: 17.419992446899414, z: -40.222694396972656},
    {x: 40.884971618652344, y: 12.319998741149902, z: -63.711273193359375},
    {x: 66.48548889160156, y: 15.548307418823242, z: -75.95284271240234},
    {x: 59.88838195800781, y: 1.339999794960022, z: -98.68903350830078},
    {x: 20.116077423095703, y: 6.679998874664307, z: -30.966354370117188},
    {x: 47.247779846191406, y: 17.419992446899414, z: -12.239371299743652},
];
//###############################################################################Ende: Alischa Thomas

let arrLights: Mesh[] = [];
let pause = new BreakScreen();
let play = true;

export let introScreen1: Introduction;
export let introScreen2: Introduction;
export function toggleBreak(){
    if(play){
        play = false;
        timer.pause();
    } else {
        play = true;
        timer.resume();
    }
}

//###############################################################################Start: Alischa Thomas
let lightCounter = 0;
//###############################################################################Ende: Alischa Thomas

export let timer: Timer;

// TODO rewrite input handler to update ammo physics

/**
 * Input handlers regarding player movement and game mechanics, which will repeat on a regular basis
 */

const setupInputHandler = () => {
    document.addEventListener("visibilitychange", function() {
        if (document.hidden){
            toggleBreak();
        } else {
            toggleBreak();
        }
    });

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

    let scale = 1;

    document.addEventListener("wheel", (event) => {
        scale += event.deltaY * 0.05;
        scale = Math.min(Math.max(30, scale), 60);

        camera.fov = scale;

        camera.updateProjectionMatrix();
    });
};

/*
 * Initialize Lights
 */
//###############################################################################Start: Alischa Thomas
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
//###############################################################################Ende: Alischa Thomas

const setupMoveables = async () => {
    new Movable()
        .init(Movable.createBox(1, 1, 1), {
            x: 26,
            y: 48,
            z: -20,
        })
        .show(scene, physics);

    //###############################################################################Start: Alischa Thomas
    new Movable()
        .init(Movable.createBox(1, 7, 10), {
            x: 27,
            y: 1.3399999141693115,
            z: -24.838674545288086,
        })
        .show(scene, physics);
    //###############################################################################Ende: Alischa Thomas

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
            x: 105.61286163330078,
            y: 1.3399999141693115,
            z: -100.41109466552734,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 99.084716796875,
            y: 1.3399999141693115,
            z: -104.68998718261719,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 97.084716796875,
            y: 1.3399999141693115,
            z: -102.68998718261719,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 91.52635192871094,
            y: 1.3399999141693115,
            z: -102.28218078613281,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 91.18050384521484,
            y: 1.339999794960022,
            z: -97.33890533447266,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 110.90746307373047,
            y: 1.339999794960022,
            z: -93.74198150634766,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 103.90746307373047,
            y: 1.339999794960022,
            z: -90.74198150634766,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 100.90746307373047,
            y: 1.339999794960022,
            z: -88.74198150634766,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 101.90746307373047,
            y: 1.339999794960022,
            z: -85.74198150634766,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 101.90746307373047,
            y: 1.339999794960022,
            z: -98.74198150634766,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 106.90746307373047,
            y: 1.339999794960022,
            z: -104.74198150634766,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 117.90746307373047,
            y: 1.339999794960022,
            z: -99.74198150634766,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 115.90746307373047,
            y: 1.339999794960022,
            z: -85.74198150634766,
        })
        .show(scene, physics);

    new Movable()
        .init(Movable.createBox(4, 4, 4), {
            x: 117.90746307373047,
            y: 1.339999794960022,
            z: -96.74198150634766,
        })
        .show(scene, physics);
}

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

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
    });

    // this should be opt-in because it reduces framerate significantly on some devices:

    // renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    document.body.appendChild(renderer.domElement);

    raycaster = new Raycaster();

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

        //###############################################################################Start: Alischa Thomas
    let geoL = new THREE.BoxGeometry(1, 1, 1);
    let matL = new THREE.MeshPhongMaterial({
        opacity: 0.3,
        transparent: true,
        color: 0xffff,
        side: DoubleSide,
    });

    posArrLights.forEach(async (pos) => {
        let light = new THREE.PointLight(0x751085, 3, 3);
        let MeshL = new THREE.Mesh(geoL, matL);

        const collectableLight = new Light();
        await collectableLight.init(MeshL, pos, light);
        scene.add(MeshL);
        arrLights.push(<Mesh>collectableLight.getModel());
    });
    setupMoveables();

    renderer.compile(scene, camera);
};

const box = new BoxGeometry(1, 1, 1);
const collisionCheckingRays = [
    ...box.vertices,
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
];
box.dispose();

const collectLights = () => {
    var originPoint = cube.getModel().position.clone();

    for (
        var vertexIndex = 0;
        vertexIndex < collisionCheckingRays.length;
        vertexIndex++
    ) {
        if (debugging) {
            drawArrow(
                scene,
                cube.getModel().position,
                collisionCheckingRays[vertexIndex]
            );
        }
        raycaster.set(cube.getModel().position, collisionCheckingRays[vertexIndex]);
        var collisionResults: Intersection[] = raycaster.intersectObjects(
            arrLights
        );
        collisionResults.forEach((intersection: Intersection) => {
            if (intersection.distance <= 1 || intersection.distance >= 2) {
                return;
            }
            const light = <Mesh>intersection.object;
            const index = arrLights.indexOf(<Mesh>intersection.object);

            if (index === -1) {
                return;
            }
            new Sound(camera, lightCollect);
            light.visible = false;
            lightCounter++;
        });
    }
    return lightCounter;
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
    return [moveX, moveY, moveZ];
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
        new VictoryScreen(0, 1, timer.Time);
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

    //###############################################################################Start: Alischa Thomas
    if(play){
        physics.updatePhysics(deltaTime);
        renderer.render(scene, camera);
        cube.move(getPlayerMovement());
    }
    gui.updateCollectedLights(collectLights());
    //###############################################################################Ende: Alischa Thomas

    gui.updateTime(timer.Time);
    backgroundMusic.setPlaybackSpeed(2 - timer.Time / 100)

    if (debugging) {
        debugDrawer.animate();
    }


    cube.intensity = timer.Time / 15;

    arrLights
        .filter((light) => !light.visible)
        .forEach((light) => {
            arrLights.splice(arrLights.indexOf(light), 1);
            destroyElement(scene, light, true);
        });

    checkIfWon();
    requestAnimationFrame(animate);

    stats.end();
};

/**
 * SetUp Screen for Game Introduction
 */
function setUpGameIntroduction() {
    introScreen1 = new IntroPage1("Spieleinführung", "Spielsteuerung");
    introScreen2 = new IntroPage2("Spieleinführung", "Spielkonzept");
    introScreen1.addButton("Weiter", "continue", () => {
        introScreen1.switchVisibleStatus();
        introScreen2.switchVisibleStatus();
    });
    introScreen2.addButton("Schließen", "continue", () => {
        introScreen2.switchVisibleStatus();
    });
}

async function playGameIntroduction() {
    introScreen1.switchVisibleStatus();
    setInterval(() => {
        /*if (!introScreen1.isVisible() && !introScreen2.isVisible()) {
          console.log("resolved");
          resolve();
          clearInterval(interval);
        }*/
    }, 100);
}

/**
 * Startscreen
 */
const setupStartScreen = (callback) => {
    let test = new StartScreen();
    test.addButton("start", "start", async () => {
        //hide main menu
        test.switchVisibleStatus();

        //Check if Player plays for the first time
        let storage;
        for (let i = 0; i < localStorage.length; i++) {
            storage = localStorage.key(i)!;
        }
        if (storage === undefined) {
            await new Promise((resolve, reject) => {
                introScreen1.switchVisibleStatus();
                let interval = setInterval(() => {
                    if (!introScreen1.isVisible() && !introScreen2.isVisible()) {
                        resolve();
                        clearInterval(interval);
                    }
                }, 100);
            });
            localStorage.setItem("returning player", "true");
        }
        //Init Timer
        timer = new Timer();
        timer.start(100);
        //init GUI
        gui = new GUI();
        //toggle sound on
        backgroundMusic = new Sound(camera, music);
        backgroundMusic.setLoop(true);
        backgroundMusic.setVolume(0.8)
        //Start game
        callback();

        //Start Break Menu Event Listener
        window.addEventListener("keydown", ({key}) => {
            if (key === Key.Escape) {
                pause.switchVisibleStatus();
                toggleBreak();
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
    setupInputHandler();
    await setupGraphics();
    setupCameraMovement();

    setUpGameIntroduction();
    setupStartScreen(() => {
        animate();
    });

    if (debugging) {
        debugDrawer.initDebug(scene, physics.getPhysicsWorld());
    }
}
