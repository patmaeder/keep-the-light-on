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

export default class model {
  //make model with three.js
  private modelMaterial: Material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
  });

  private model: Object3D;
  private scale = { x: 0.25, y: 0.25, z: 0.25 };
  private pos = { x: 10, y: 5, z: 0 };
  private quat = { x: 0, y: 0, z: 0, w: 1 };
  private mass = 1;

  async init(camera: Camera): Promise<model> {
    const gltf = await loadModel(modelModel);
    this.model = gltf.scene;
    this.model.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = this.modelMaterial;
      }
    });

    //this.model.position.set(3.5, 0.95, -6);
    //this.model.rotateOnAxis(new Vector3(0, 1, 0), Math.PI);
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
    //Triggerd on player move (WASD, Arrow Keys)
    //vector.op_mul(0.13);

    const physicsBody: Ammo.btRigidBody = this.model.userData.rigidBody;

    physicsBody.setLinearVelocity(
      new Ammo.btVector3(0, vector.y(), vector.z())
    );
    physicsBody.setAngularVelocity(new Ammo.btVector3(0, -vector.x(), 0));
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
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(this.mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(
      this.mass,
      motionState,
      colShape,
      localInertia
    );

    return new Ammo.btRigidBody(rbInfo);
  }
}
