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
  Scene,
} from "three";
import Ammo from "ammojs-typed";
import { State } from "../utils/Constants";
import PhysicsHandler from "../Physics";
import THREE = require("three");

/*
##############Position Rätsel##################
##Rätsel1:dünne tür, die sich aufdreht
x: 28.081180572509766
y: 1.3399999141693115
z: -24.838674545288086

##Rätsel2: cube, den mann verschieben kann um wieder die treppe hochzukommen
x: 15.198495864868164
y: 3.8061068058013916
z: -1.1404633522033691

##Rätsel3: Block zum Runterstoßen, damit Weg fei wird zum Lichtwürfel holen oder runterspringen
x: 40.72705078125
y: 15.548308372497559
z: -29.615190505981445

##Rätsel4: Blockwand zum Hineinschieben, damit Weg frei wird
x: 33.65906524658203
y: 1.339999794960022
z: -25.238832473754883

##Rätsel5: Block durch Tunnel schieben
x: 46.48160171508789
y: 1.339999794960022
z: -40.937355041503906
*/

export default class Movable {
  //make model with three.js
  private modelMaterial: Material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
  });

  private rigidBody: Ammo.btRigidBody;
  private model: Mesh;
  private scale = { x: 1, y: 1, z: 1 };
  private initialPos;
  private quat = { x: 0, y: 0, z: 0, w: 1 };

  private mass;

  init(
    object: Mesh,
    initialPos = { x: 0, y: 0, z: 0 },
    mass: number = 10
  ): Movable {
    this.model = object;
    this.initialPos = initialPos;
    this.mass = mass;
    this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);

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

  static createBox(width, height, depth): Mesh {
    let geometry = new THREE.BoxGeometry(width, height, depth);
    let material = new THREE.MeshPhongMaterial({
      refractionRatio: 0.92,
      reflectivity: 0.5,
      shininess: 30,
      flatShading: true,
      transparent: true,
      color: 0xf58a0c,
      opacity: 0.95,
    });
    let box = new THREE.Mesh(geometry, material);
    box.castShadow = true;
    box.receiveShadow = true;

    return box;
  }

  show(scene: Scene, physics: PhysicsHandler) {
    scene.add(this.model);
    physics.addPhysicsToMesh(this.model, this.initRigidBody());
  }
}
