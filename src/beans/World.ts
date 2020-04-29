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

function createSoftVolume(bufferGeom, mass, pressure) {
  var volume = new Mesh(bufferGeom, new MeshPhongMaterial({ color: 0xffffff }));

  // Volume physic object
  var softBodyHelpers = new Ammo.btSoftBodyHelpers();
  var volumeSoftBody = softBodyHelpers.CreateFromTriMesh(
    physicsWorld.getWorldInfo(),
    bufferGeom.ammoVertices,
    bufferGeom.ammoIndices,
    bufferGeom.ammoIndices.length / 3,
    true
  );

  // var sbConfig = volumeSoftBody.get_m_cfg();
  // sbConfig.set_viterations(40);
  // sbConfig.set_piterations(40);

  // // Soft-soft and soft-rigid collisions
  // sbConfig.set_collisions(0x11);

  // // Friction
  // sbConfig.set_kDF(0.1);
  // // Damping
  // sbConfig.set_kDP(0.01);
  // // Pressure
  // sbConfig.set_kPR(pressure);
  // // Stiffness
  // volumeSoftBody.get_m_materials().at(0).set_m_kLST(0.9);
  // volumeSoftBody.get_m_materials().at(0).set_m_kAST(0.9);

  // volumeSoftBody.setTotalMass(mass, false);
  Ammo.cast(volumeSoftBody, Ammo.btCollisionObject)
    .getCollisionShape()
    .setMargin(margin);
  physicsWorld.addSoftBody(volumeSoftBody, 1, -1);

  // Disable deactivation
  volumeSoftBody.setActivationState(4);
}

export default class World {
  //make cube with three.js
  private cubeMaterial: Material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
  });

  private model: Object3D;
  private hullShape: Ammo.btBvhTriangleMeshShape;
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
    let triangle_mesh;

    gltf.scene.children.forEach((object: Object3D) => {
      if (object.type === "Mesh") {
        const mesh: Mesh = <Mesh>object;
        const buffer: BufferGeometry = <BufferGeometry>mesh.geometry;
        const positions = buffer.attributes.position.array;
        console.log(positions);
        triangle_mesh = new Ammo.btTriangleMesh();

        var triangle;
        var _vec3_1 = new Ammo.btVector3(0, 0, 0);
        var _vec3_2 = new Ammo.btVector3(0, 0, 0);
        var _vec3_3 = new Ammo.btVector3(0, 0, 0);
        for (var i = 0; i < positions.length; i += 9) {
          triangle = positions[i];

          _vec3_1.setX(positions[i]);
          _vec3_1.setY(positions[i + 1]);
          _vec3_1.setZ(positions[i + 2]);

          _vec3_2.setX(positions[i + 3]);
          _vec3_2.setY(positions[i + 4]);
          _vec3_2.setZ(positions[i + 5]);

          _vec3_3.setX(positions[i + 6]);
          _vec3_3.setY(positions[i + 7]);
          _vec3_3.setZ(positions[i + 8]);

          triangle_mesh.addTriangle(_vec3_1, _vec3_2, _vec3_3, true);
        }

        // for (var i = 0; i < positions.length; i += 3) {
        //   vec3.setValue(positions[i], positions[i + 1], positions[i + 2]);
        //   this.hullShape.addPoint(vec3, i == positions.length - 3);
        // }
      }
    });

    this.hullShape = new Ammo.btBvhTriangleMeshShape(triangle_mesh, true, true);
    this.hullShape.setMargin(0);
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
