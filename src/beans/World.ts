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
} from "three";
import Ammo from "ammojs-typed";
import { State, Flags } from "../utils/Constants";
import { TYPE, iterateGeometries, createCollisionShapes } from "three-to-ammo";

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
    // this.model.traverse((child) => {
    //   if (child instanceof Mesh) {
    //     child.material = this.cubeMaterial;
    //   }
    // });

    console.log(gltf.scene);

    gltf.scene.children.forEach((object: Object3D) => {
      if (object.type === "Mesh") {
        const mesh: Mesh = <Mesh>object;
        const buffer: BufferGeometry = <BufferGeometry>mesh.geometry;

        // var volume = new Mesh(
        //   buffer,
        //   new MeshPhongMaterial({ color: 0xffffff })
        // );

        this.meshes.push(mesh);
      } else if (object.type === "Group") {
      }
    });

    // this.hullShape = new Ammo.btBvhTriangleMeshShape(triangle_mesh, true, true);
    // this.hullShape.setMargin(0);
    // console.log(this.hullShape);
    // this.hullShape.setLocalScaling(vec3);
    // this.hullShape.initializePolyhedralFeatures(0);

    this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);

    return this;
  }

  getModel(): Object3D {
    return this.model;
  }

  initRigidBody(): Ammo.btRigidBody[] {
    console.log(this.meshes);

    let rigidbodies: Ammo.btRigidBody[] = [];

    console.log("So many meshes are defined: ", this.meshes.length);

    for (let mesh of this.meshes) {
      let hull = new Ammo.btConvexHullShape();

      console.log(mesh);
      const buffer = <BufferGeometry>mesh.geometry;
      const triangles = buffer.index.array;
      console.log(triangles.length, triangles.length % 2, triangles.length % 3);
      for (let i = 0; i < triangles.length; i += 3) {
        //if (i + 2 >= triangles.length) continue;

        console.log(triangles[i], triangles[i + 1], triangles[i + 2]);
        hull.addPoint(
          new Ammo.btVector3(triangles[i], triangles[i + 1], triangles[i + 2])
        );
      }
      console.log("Mesh done: ", hull);

      let transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(
        new Ammo.btVector3(this.pos.x, this.pos.y, this.pos.z)
      );

      let motionState = new Ammo.btDefaultMotionState(transform);

      console.log(this.model);

      let localInertia = new Ammo.btVector3(0, 0, 0);

      hull.calculateLocalInertia(this.mass, new Ammo.btVector3(0, 0, 0));

      let rbInfo = new Ammo.btRigidBodyConstructionInfo(
        this.mass,
        motionState,
        hull,
        localInertia
      );

      const physicsBody = new Ammo.btRigidBody(rbInfo);

      // kinematic object which are physics not applied to
      physicsBody.setActivationState(State.DISABLE_DEACTIVATION);
      physicsBody.setCollisionFlags(Flags.CF_KINEMATIC_OBJECT);

      rigidbodies.push(physicsBody);
    }

    return rigidbodies;
  }
}
