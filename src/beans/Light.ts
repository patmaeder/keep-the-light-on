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
  private modelMaterial: Material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
    opacity: 0.7,
    transparent: true,
  });

  private rigidBody: Ammo.btRigidBody;
  private model: Object3D;
  private scale = { x: 1, y: 1, z: 1 };
  private pos = { x: 26, y: 28, z: -16 };
  private quat = { x: 0, y: 0, z: 0, w: 1 };
  private mass = 10;

  async init(camera: Camera): Promise<Light> {
    const gltf = await loadModel(modelModel);
    this.model = gltf.scene;
    this.model.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = this.modelMaterial;
      }
    });

    this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
    console.log(this.model.position, this.model.scale);

    //create light to shine on environment and on cube
    let pointLight1 = new PointLight(0xfffff, 30, 50);
    pointLight1.position.set(this.pos.x, this.pos.y, this.pos.z);
    //let pointLight2 = new PointLight(0xfffff, 30, 5);
    //pointLight2.position.set(0, 2, 0);
    return this;
  }

  getModel(): Object3D {
    return this.model;
  }

  initRigidBody(): Ammo.btRigidBody {
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(this.pos.x, this.pos.y, this.pos.z));
    transform.setRotation(
      new Ammo.btQuaternion(this.quat.x, this.quat.y, this.quat.z, this.quat.w)
    );
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(this.scale.x, this.scale.y, this.scale.z)
    );
    colShape.setMargin(0.1);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(this.mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(
      this.mass,
      motionState,
      colShape,
      localInertia
    );

    this.rigidBody = new Ammo.btRigidBody(rbInfo);

    return this.rigidBody;
  }
}
