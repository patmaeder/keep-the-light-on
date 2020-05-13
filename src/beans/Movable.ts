import {
  PointLight,
  MeshPhongMaterial,
  DoubleSide,
  BoxHelper,
  BoxGeometry,
  Vector3,
  Group,
  Camera,
  Object3D,
  Mesh,
  Material /*default as THREE,*/,
  BufferGeometry,
  Geometry,
  Matrix4,
  Box3,
} from "three";
import Ammo from "ammojs-typed";
import { State } from "../utils/Constants";

export default class Movable {
  //make model with three.js
  private modelMaterial: Material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
  });

  private rigidBody: Ammo.btRigidBody;
  private model: Mesh;
  private scale = { x: 1, y: 1, z: 1 };
  private pos = { x: 0, y: 0, z: 0 };
  private quat = { x: 0, y: 0, z: 0, w: 1 };

  private mass = 10;

  async init(object: Mesh, pos): Promise<Object> {
    this.model = object;
    this.pos = pos;
    this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);

    let pointLight0 = new PointLight(0xfffff, 5, 20);
    pointLight0.position.set(0, 0, 0);

    const PivotPoint = new Object3D();
    PivotPoint.add(pointLight0);
    this.model.add(PivotPoint);
    console.log(pointLight0.getWorldPosition(new Vector3()));

    return this;
  }

  getModel(): Object3D {
    return this.model;
  }

  initRigidBody(): Ammo.btRigidBody {
    let geometry = <Geometry>this.model.geometry;

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(this.pos.x, this.pos.y, this.pos.z));
    transform.setRotation(
      new Ammo.btQuaternion(this.quat.x, this.quat.y, this.quat.z, this.quat.w)
    );
    let motionState = new Ammo.btDefaultMotionState(transform);

    const scale = new Vector3(0, 0, 0).setFromMatrixScale(
      new Matrix4().fromArray(this.model.matrixWorld.elements)
    );

    const shape = new Ammo.btTriangleMesh();

    for (let face of geometry.faces) {
      let a = geometry.vertices[face.a].clone().multiply(scale);
      let b = geometry.vertices[face.b].clone().multiply(scale);
      let c = geometry.vertices[face.c].clone().multiply(scale);

      let va = new Ammo.btVector3(a.x, a.y, a.z);
      let vb = new Ammo.btVector3(b.x, b.y, b.z);
      let vc = new Ammo.btVector3(c.x, c.y, c.z);

      shape.addTriangle(va, vb, vc, true);
    }
    console.log(this.model);

    const appliedScale = new Box3()
      .setFromObject(this.model)
      .getSize(new Vector3(0, 0, 0));

    let colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        appliedScale.x / 2,
        appliedScale.y / 2,
        appliedScale.z / 2
      )
    );

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
