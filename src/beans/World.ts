import { loadModel } from "../Loader";
import Testmodule from "../../assests/models/labyrinth.glb";
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
  BufferGeometry,
  Matrix4,
  Geometry,
} from "three";
import Ammo from "ammojs-typed";
import { State, Flags } from "../utils/Constants";
import {
  TYPE,
  FIT,
  iterateGeometries,
  createCollisionShapes,
} from "three-to-ammo";

export default class World {
  //make cube with three.js
  private cubeMaterial: Material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
  });

  private model: Object3D;
  private hullShape: Ammo.btBvhTriangleMeshShape;
  private scale = { x: 1, y: 1, z: 1 };
  private pos = { x: 0, y: 0, z: 0 };
  private mass = 0;
  private meshes: Mesh[];

  async init(): Promise<World> {
    const gltf = await loadModel(Testmodule);
    this.model = gltf.scene;
    this.meshes = [];

    // this works when coloring the model
    this.model.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = this.cubeMaterial;
        console.log(child);
        this.meshes.push(child);
      }
    });

    console.log(gltf.scene);

    this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);

    return this;
  }

  getModel(): Object3D {
    return this.model;
  }

  initRigidBody(): Ammo.btRigidBody[] {
    console.log(this.meshes);
    const matrixWorld = new Matrix4();

    let rigidbodies: Ammo.btRigidBody[] = [];

    console.log("So many meshes are defined: ", this.meshes.length);

    let vertices,
      matrices,
      indexes = [];
    for (let mesh of this.meshes) {
      let geometry = new Geometry();
      const buffer = <BufferGeometry>mesh.geometry;
      geometry.fromBufferGeometry(buffer);

      let motionState = new Ammo.btDefaultMotionState();
      let localInertia = new Ammo.btVector3(0, 0, 0);

      const shape = new Ammo.btConvexHullShape();
      console.log(geometry.vertices.length);
      geometry.vertices.forEach((vector: Vector3) => {
        // WHY TF DO I HAVE TO SCALE THIS DOWN TO 0.025 !!?
        vector.multiplyScalar(0.025);
        //console.log(vector.x, vector.y, vector.z);
        shape.addPoint(new Ammo.btVector3(vector.x, vector.y, vector.z));
      });

      let rbInfo = new Ammo.btRigidBodyConstructionInfo(
        this.mass,
        motionState,
        shape,
        localInertia
      );

      const rigidBody = new Ammo.btRigidBody(rbInfo);
      //rigidBody.setActivationState(State.DISABLE_DEACTIVATION);
      //rigidBody.setCollisionFlags(Flags.CF_KINEMATIC_OBJECT);
      rigidbodies.push(rigidBody);
      console.log(rigidBody);
    }

    return rigidbodies;
  }
}
