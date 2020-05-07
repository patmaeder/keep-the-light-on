import { loadModel } from "../Loader";
import modelModel from "../../assets/models/cube/cube_white.glb";
import {
  PointLight,
  MeshPhongMaterial,
  DoubleSide,
  BoxGeometry,
  Vector3,
  Group,
  Camera,
  Object3D,
  Mesh,
  Material /*default as THREE,*/,
} from "three";
import Ammo from "ammojs-typed";
import { State } from "../utils/Constants";
import Cube from "./Cube";

export default class Light extends Cube {
  //make model with three.js
  private modelMaterialLight: Material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
    opacity: 0.7,
    transparent: true,
  });

  private rigidBodyLight: Ammo.btRigidBody;
  private modelLight: Object3D;
  private scaleLight = { x: 1, y: 1, z: 1 };
  private posL = { x: 20, y: 28, z: -16 };
  private quatL = { x: 0, y: 0, z: 0, w: 1 };
  private massL = 11;

  async inits(): Promise<Light> {
    const gltf = await loadModel(modelModel);
    this.modelLight = gltf.scene;
    this.modelLight.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = this.modelMaterialLight;
      }
    });

    this.modelLight.scale.set(this.scaleLight.x, this.scaleLight.y, this.scaleLight.z);
    console.log(this.modelLight.position, this.modelLight.scale);

    //create light to shine on environment and on cube
    let pointLight1 = new PointLight(0xfffff, 30, 50);
    pointLight1.position.set(this.posL.x, this.posL.y, this.posL.z);
    //let pointLight2 = new PointLight(0xfffff, 30, 5);
    //pointLight2.position.set(0, 2, 0);
    return this;
  }

  getModel(): Object3D {
    return this.modelLight;
  }

  initRigidBody(): Ammo.btRigidBody {
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(this.posL.x, this.posL.y, this.posL.z));
    transform.setRotation(
      new Ammo.btQuaternion(this.quatL.x, this.quatL.y, this.quatL.z, this.quatL.w)
    );
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(this.scaleLight.x, this.scaleLight.y, this.scaleLight.z)
    );
    colShape.setMargin(0.1);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(this.massL, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(
      this.massL,
      motionState,
      colShape,
      localInertia
    );

    this.rigidBodyLight = new Ammo.btRigidBody(rbInfo);

    return this.rigidBodyLight;
  }
}
