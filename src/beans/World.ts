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
  Face3,
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
  private scale = { x: 6, y: 6, z: 6 };
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
        //console.log(child);
        this.meshes.push(child);
      }
    });

    //console.log(gltf.scene);

    this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);

    return this;
  }

  getModel(): Object3D {
    return this.model;
  }

  initRigidBody(): Ammo.btRigidBody {
    this.model.updateMatrixWorld();

    //console.log(this.meshes);

    console.log("So many meshes are defined: ", this.meshes.length);

    let vertices,
      matrices,
      indexes = [];

    const compoundShape = new Ammo.btCompoundShape();

    for (let mesh of this.meshes) {
      let geometry = new Geometry();
      const buffer = <BufferGeometry>mesh.geometry;
      geometry.fromBufferGeometry(buffer);

      const scale = new Vector3(0, 0, 0).setFromMatrixScale(
        new Matrix4().fromArray(mesh.matrixWorld.elements)
      );

      // const shape = new Ammo.btConvexHullShape();

      // for (let i = 0; i + 1 < geometry.vertices.length; i += 1) {
      //   let a = geometry.vertices[i].multiply(scale)
      //   let va = new Ammo.btVector3(a.x, a.y, a.z);
      //   shape.addPoint(va);
      // }

      // let motionState = new Ammo.btDefaultMotionState();
      // let localInertia = new Ammo.btVector3(0, 0, 0);

      // let rbInfo = new Ammo.btRigidBodyConstructionInfo(
      //   this.mass,
      //   motionState,
      //   shape,
      //   localInertia
      // );

      // const rigidBody = new Ammo.btRigidBody(rbInfo);
      // //rigidBody.setActivationState(State.DISABLE_DEACTIVATION);
      // rigidBody.setCollisionFlags(Flags.CF_KINEMATIC_OBJECT);
      // rigidbodies.push(rigidBody);

      console.log(geometry.faces);
      const shape = new Ammo.btTriangleMesh();

      console.log(geometry.faces);
      for (let face of geometry.faces) {
        let a = geometry.vertices[face.a];
        let b = geometry.vertices[face.b];
        let c = geometry.vertices[face.c];

        let va = new Ammo.btVector3(
          a.x * scale.x,
          a.y * scale.y,
          a.z * scale.z
        );
        let vb = new Ammo.btVector3(
          b.x * scale.x,
          b.y * scale.y,
          b.z * scale.z
        );
        let vc = new Ammo.btVector3(
          c.x * scale.x,
          c.y * scale.y,
          c.z * scale.z
        );

        shape.addTriangle(va, vb, vc, false);
      }

      const localTransform = new Ammo.btTransform();
      localTransform.setIdentity();
      localTransform.setOrigin(new Ammo.btVector3(0, 0, 0));

      const collisionShape = new Ammo.btBvhTriangleMeshShape(shape, false);
      collisionShape.setMargin(0.1);

      compoundShape.addChildShape(localTransform, collisionShape);
    }

    let motionState = new Ammo.btDefaultMotionState();
    let localInertia = new Ammo.btVector3(0, 0, 0);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(
      this.mass,
      motionState,
      compoundShape,
      localInertia
    );

    const rigidBody = new Ammo.btRigidBody(rbInfo);
    //rigidBody.setActivationState(State.DISABLE_DEACTIVATION);
    rigidBody.setCollisionFlags(Flags.CF_KINEMATIC_OBJECT);

    return rigidBody;
  }
}
