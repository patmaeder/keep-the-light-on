import { loadModelObj } from "../Loader";
import modelModel from "../../assets/models/cube/Cuby.obj";
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
    const gltf = await loadModelObj(modelModel);
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

    //Camera + light moves/turns with model move
    const PivotPoint = new Object3D();
    this.model.add(PivotPoint);
    PivotPoint.add(pointLight1);
    //PivotPoint.add(pointLight2);
    PivotPoint.add(camera);

    return this;
  }

  getModel(): Object3D {
    return this.model;
  }

  move(
    changedAxes: Ammo.btVector3,
    physicsWorld: Ammo.btDiscreteDynamicsWorld
  ) {
    if (changedAxes.length() === 0) return;

    this.rigidBody.activate();

    if (changedAxes.y() !== 0) {
      const position = this.rigidBody.getWorldTransform().getOrigin();
      const to = new Ammo.btVector3(position.x(), -0.1, position.z());

      const rayResult = new Ammo.ClosestRayResultCallback(position, to);

      physicsWorld.rayTest(position, to, rayResult);
      console.log(
        "closest hit fraction is < 0.1",
        rayResult.get_m_closestHitFraction() < 0.1
      );

      if (rayResult.get_m_closestHitFraction() < 0.1)
        this.rigidBody.applyCentralImpulse(new Ammo.btVector3(0, this.mass, 0));
    }

    //Triggerd on player move (WASD, Arrow Keys)
    changedAxes.setY(0);
    changedAxes.op_mul(this.mass * 10);

    this.rigidBody.applyCentralForce(changedAxes);
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
