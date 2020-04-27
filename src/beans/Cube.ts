import { loadModel } from "../Loader";
import CubeModel from "../../assests/models/cube_white.glb";
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

export default class Cube {
  //make cube with three.js
  private cubeMaterial: Material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
  });

  private cube: Group;
  private scale = { x: 0.25, y: 0.25, z: 0.25 };
  private pos = { x: 0, y: 20, z: 0 };
  private quat = { x: 0, y: 0, z: 0, w: 1 };
  private mass = 1;

  async init(camera: Camera): Promise<Cube> {
    const gltf = await loadModel(CubeModel);
    this.cube = gltf.scene;
    this.cube.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = this.cubeMaterial;
      }
    });

    //this.cube.position.set(3.5, 0.95, -6);
    //this.cube.rotateOnAxis(new Vector3(0, 1, 0), Math.PI);
    this.cube.scale.set(this.scale.x, this.scale.y, this.scale.z);

    //Camera turns with Cube move
    const PivotPoint = new Object3D();
    this.cube.add(PivotPoint);
    PivotPoint.add(camera);

    return this;
  }

  getModel(): Group {
    return this.cube;
  }

  move(vector: Vector3) {
    //Triggerd on player move (WASD, Arrow Keys)
    vector.multiplyScalar(0.13);
    this.cube.rotateOnAxis(new Vector3(0, 1, 0), -(vector.x / 4));
    this.cube.translateY(vector.y);
    this.cube.translateZ(vector.z);
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
