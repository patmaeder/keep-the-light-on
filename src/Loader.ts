import { Loader } from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";

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
