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
  private hullShape: Ammo.btConvexHullShape;
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

    var modelScale = 50;
    console.log(gltf.scene);

    this.hullShape = new Ammo.btConvexHullShape();
    this.hullShape.setMargin(0);

    let vec3 = new Ammo.btVector3();

    gltf.scene.children.forEach((object: Object3D) => {
      if (object.type === "Mesh") {
        const mesh: Mesh = <Mesh>object;
        const buffer: BufferGeometry = <BufferGeometry>mesh.geometry;
        const positions = buffer.attributes.position.array;

        for (var i = 0; i < positions.length; i += 3) {
          vec3.setValue(positions[i], positions[i + 1], positions[i + 2]);
          this.hullShape.addPoint(vec3, i == positions.length - 3);
        }
        /*         const matrixWorld = new Matrix4();
        const vertices = [];
        const matrices = [];
        const indexes = [];

        iterateGeometries(mesh, {}, (vertexArray, matrixArray, indexArray) => {
          vertices.push(vertexArray);
          matrices.push(matrixArray);
          indexes.push(indexArray);
        });
        console.log("creating new shape");
        this.hullShape = createCollisionShapes(
          vertices,
          matrices,
          indexes,
          matrixWorld.elements,
          { type: TYPE.MESH }
        ); */
      }
    });
    console.log(this.hullShape);
    //this.hullShape.setLocalScaling(vec3);
    //this.hullShape.initializePolyhedralFeatures(0);

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

    console.log(this.model);

    let localInertia = new Ammo.btVector3(0, 0, 0);

    // this.hullShape.calculateLocalInertia(
    //   this.mass,
    //   new Ammo.btVector3(0, 0, 0)
    // );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(
      this.mass,
      motionState,
      this.hullShape,
      localInertia
    );

    const physicsBody = new Ammo.btRigidBody(rbInfo);

    // kinematic object which are physics not applied to
    physicsBody.setActivationState(State.DISABLE_DEACTIVATION);
    physicsBody.setCollisionFlags(Flags.CF_KINEMATIC_OBJECT);

    return physicsBody;
  }
}
