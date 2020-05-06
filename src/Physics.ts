import Ammo from "ammojs-typed";
import { Object3D } from "three";

export default class PhysicsHandler {
  private physicsWorld: Ammo.btDiscreteDynamicsWorld;
  private tmpTrans: Ammo.btTransform;
  private objects: Object3D[];

  constructor() {
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
      dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
      overlappingPairCache = new Ammo.btDbvtBroadphase(),
      solver = new Ammo.btSequentialImpulseConstraintSolver();

    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      dispatcher,
      overlappingPairCache,
      solver,
      collisionConfiguration
    );
    this.tmpTrans = new Ammo.btTransform();
    this.objects = [];

    this.physicsWorld.setGravity(new Ammo.btVector3(0, -9.81, 0));
    //this.physicsWorld.setGravity(new Ammo.btVector3(0, 0, 0));
  }

  getPhysicsWorld(): Ammo.btDiscreteDynamicsWorld {
    return this.physicsWorld;
  }

  addPhysicsToMesh(mesh: Object3D, rigidBody: Ammo.btRigidBody) {
    mesh.userData.rigidBody = rigidBody;
    this.physicsWorld.addRigidBody(rigidBody);
    this.objects.push(mesh);
  }

  updatePhysics(deltaTime: number) {
    // Step world
    this.physicsWorld.stepSimulation(deltaTime, 10);
    // Update rigid bodies
    for (let i = 0; i < this.objects.length; i++) {
      let objThree = this.objects[i];
      let objAmmo = objThree.userData.rigidBody;
      let ms = objAmmo.getMotionState();
      if (ms) {
        ms.getWorldTransform(this.tmpTrans);
        let p = this.tmpTrans.getOrigin();
        let q = this.tmpTrans.getRotation();
        objThree.position.set(p.x(), p.y(), p.z());
        objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
        // console.log("motion state", p.x(), p.y(), p.z());
        // console.log("rotation state", q.x(), q.y(), q.z());
      }
    }
  }
}
