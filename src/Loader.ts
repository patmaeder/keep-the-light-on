import { Loader, Group } from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";


export const loadModel = (model: any) =>
  new Promise<GLTF>((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      model,
      (gltf) => resolve(gltf),
      undefined,
      function (error) {
        console.error(error);
        reject();
      }
    );
  });

  export const loadModelObj = (model: any) =>
  new Promise<Group>((resolve, reject) => {
    const loader = new OBJLoader();

    loader.load(
      model,
      (gltf) => resolve(gltf),
      undefined,
      function (error) {
        console.error(error);
        reject();
      }
    );
  });