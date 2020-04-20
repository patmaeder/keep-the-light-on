import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import LevelDemo from "../assests/models/level-demo.glb";
import Ammo from "ammojs-typed";

Ammo().then((ammo) => {
  console.log("Ammo wurde geladen");
  new ammo.btVector3(24, 24, 24);
});

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.5,
  100
);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
var cube = new THREE.Mesh(geometry, material);
//scene.add(cube);

camera.position.z = 5;

var loader = new GLTFLoader();

loader.load(
  LevelDemo,
  function (gltf) {
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

var animate = function () {
  requestAnimationFrame(animate);

  scene.rotation.x += 0.01;

  renderer.render(scene, camera);
};

animate();
