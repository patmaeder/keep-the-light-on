//###############################################################################Start: Alischa Thomas
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
  Box3,
} from "three";
import Ammo from "ammojs-typed";
import { State } from "../utils/Constants";

export default class Light {
  private rigidBody: Ammo.btRigidBody;
  private model: Mesh;
  private light: PointLight;
  private scale = { x: 1, y: 1, z: 1 };
  private initialPos = { x: 0, y: 0, z: 0 };
  private quat = { x: 0, y: 0, z: 0, w: 1 };
  private mass = 10;

  async init(object: Mesh, initialPos, light): Promise<Light> {
    this.light = light;
    this.model = object;
    this.initialPos = initialPos;
    this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
    this.model.add(light);

    //set the light to the cube's origin
    light.position.set(0, 0, 0);

    console.log(light.getWorldPosition(new Vector3()));
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
    transform.setOrigin(
      new Ammo.btVector3(
        this.initialPos.x,
        this.initialPos.y,
        this.initialPos.z
      )
    );
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

    // box extends are defined as half the box width. Passing the whole width will make them "float". Beware! Different implementation in Movable.ts
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

//###############################################################################Ende: Alischa Thomas

