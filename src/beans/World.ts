import { loadModel } from "../Loader";
import Testmodule from "../../assests/models/testmodule.glb";
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

export default class World {
  //make cube with three.js
  private cubeMaterial: Material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
  });

  private model: Object3D;
  private scale = { x: 0.007, y: 0.007, z: 0.007 };
  private pos = { x: 0, y: 0, z: 0 };
  private mass = 0;

  async init(): Promise<World> {
    const gltf = await loadModel(Testmodule);
    this.model = gltf.scene;
    // this.model.traverse((child) => {
    //   if (child instanceof Mesh) {
    //     child.material = this.cubeMaterial;
    //   }
    // });

    this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);

    return this;
  }

  getModel(): Object3D {
    return this.model;
  }

  initRigidBody(): Ammo.btRigidBody {
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(this.pos.x, this.pos.y, this.pos.z));

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
