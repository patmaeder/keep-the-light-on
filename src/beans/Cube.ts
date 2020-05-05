import { loadModel } from "../Loader";
import modelModel from "../../assests/models/cube_white.glb";
import {
  MeshPhongMaterial,
  DoubleSide,
  BoxGeometry,
  Vector3,
  Group,
  Camera,
  Object3D,
  Mesh,
  Material,
} from "three";
import Ammo from "ammojs-typed";
import { State } from "../utils/Constants";

export default class Cube {
  //make model with three.js
  private modelMaterial: Material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
  });

  private rigidBody: Ammo.btRigidBody;
  private model: Object3D;
  private scale = { x: 1, y: 1, z: 1 };
  private pos = { x: 26, y: 28, z: -16 };
  private quat = { x: 0, y: 0, z: 0, w: 1 };
  private mass = 10;

  async init(camera: Camera): Promise<Cube> {
    const gltf = await loadModel(modelModel);
    this.model = gltf.scene;
    this.model.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = this.modelMaterial;
      }
    });

    this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
    console.log(this.model.position, this.model.scale);

    //Camera turns with model move
    const PivotPoint = new Object3D();
    this.model.add(PivotPoint);
    PivotPoint.add(camera);

    return this;
  }

  getModel(): Object3D {
    return this.model;
  }

  move(vector: Ammo.btVector3) {
    if (vector.length() === 0) return;

    this.rigidBody.activate();

    if (vector.y() !== 0) {
      this.rigidBody.applyCentralImpulse(new Ammo.btVector3(0, this.mass, 0));
    }

    //Triggerd on player move (WASD, Arrow Keys)
    vector.op_mul(this.mass * 10);

    this.rigidBody.applyCentralForce(vector);
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
