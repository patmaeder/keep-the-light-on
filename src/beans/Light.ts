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
  BufferGeometry,
  Geometry,
  Matrix4,
} from "three";
import Ammo from "ammojs-typed";
import { State } from "../utils/Constants";

export default class Light {
  //make model with three.js
  private modelMaterial: Material = new MeshPhongMaterial({
    opacity: 0.3,
    transparent: true,
    color: 0xffff,
    side: DoubleSide,
  });

  private rigidBody: Ammo.btRigidBody;
  private model: Mesh;
  private light: PointLight;
  private scale = {x: 1, y: 1, z: 1};
  private pos = {x: 1, y: 0, z: 0};
  private quat = {x: 0, y: 0, z: 0, w: 1};
  private mass = 10;

  async init(object: Mesh, pos, light): Promise<Object> {
    this.light=light;
    this.model = object;
    this.pos = pos;
    this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
    light.position.set(0, 0, 0);
    const PivotPoint = new Object3D();
    PivotPoint.add(light);
    this.model.add(PivotPoint);
    //Licht aus dem Würfel heraus
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

    let colShape = new Ammo.btBoxShape(
        new Ammo.btVector3(this.scale.x, this.scale.y, this.scale.z)
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
