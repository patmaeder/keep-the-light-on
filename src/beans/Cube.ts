import { loadModel } from "../Loader";
import modelModel from "../../assets/models/cube/cube_white.glb";
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
  ArrowHelper,
  Material /*default as THREE,*/,
  ZeroCurvatureEnding,
  Scene,
} from "three";
import Ammo from "ammojs-typed";
import { State } from "../utils/Constants";

export default class Cube {
  //make model with three.js
  private modelMaterial: Material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
  });

  private camera: Camera;
  private rigidBody: Ammo.btRigidBody;
  private model: Object3D;
  private scale = { x: 1, y: 1, z: 1 };
  private pos = { x: 26, y: 28, z: -16 };
  private quat = { x: 0, y: 0, z: 0, w: 1 };
  private mass = 10;

  async init(camera: Camera): Promise<Cube> {
    const gltf = await loadModel(modelModel);

    this.camera = camera;
    this.model = gltf.scene;
    this.model.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = this.modelMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
    console.log(this.model.position, this.model.scale);

    //create light to shine on environment and on cube
    //strong light
    //Licht aus dem Würfel nach außen heraus
    let pointLight0 = new PointLight(0xfffff, 5, 20);
    pointLight0.position.set(0, 0, 0);
    //Licht von außen auf den Würfel drauf (zum Bestrahlen des Würfels)
    let pointLight11 = new PointLight(0xfffff, 5, 3);
    pointLight11.position.set(0, 0, 3);
    let pointLight12 = new PointLight(0xfffff, 5, 3);
    pointLight12.position.set(3, 0, 0);
    let pointLight13 = new PointLight(0xfffff, 5, 3);
    pointLight13.position.set(-3, 0, 0);
    let pointLight14 = new PointLight(0xfffff, 5, 3);
    pointLight14.position.set(0, 0, -3);
    let pointLight15 = new PointLight(0xfffff, 5, 3);
    pointLight15.position.set(0, 3, 0);
    let pointLight16 = new PointLight(0xfffff, 5, 3);
    pointLight16.position.set(0, -3, 0);

    //medium light
    //Licht aus dem Würfel nach außen heraus
    /*let pointLight0 = new PointLight(0xfffff, 5, 20);
    pointLight0.position.set(0, 0, 0);
          //Licht von außen auf den Würfel drauf (zum Bestrahlen des Würfels)
    let pointLight11 = new PointLight(0xfffff, 3, 3);
    pointLight11.position.set(0, 0, 3);
    let pointLight12 = new PointLight(0xfffff, 3, 3);
    pointLight12.position.set(3, 0, 0);
    let pointLight13 = new PointLight(0xfffff, 3, 3);
    pointLight13.position.set(-3, 0, 0);
    let pointLight14 = new PointLight(0xfffff, 3, 3);
    pointLight14.position.set(0, 0, -3);
    let pointLight15 = new PointLight(0xfffff, 3, 3);
    pointLight15.position.set(0, 3, 0);
    let pointLight16 = new PointLight(0xfffff, 3, 3);
    pointLight16.position.set(0, -3, 0);*/

    //gonna die light
    //Licht aus dem Würfel nach außen heraus
    /*let pointLight0 = new PointLight(0xfffff, 3, 12);
    pointLight0.position.set(0, 0, 0);
          //Licht von außen auf den Würfel drauf (zum Bestrahlen des Würfels)
    let pointLight11 = new PointLight(0xfffff, 1, 3);
    pointLight11.position.set(0, 0, 3);
    let pointLight12 = new PointLight(0xfffff, 1, 3);
    pointLight12.position.set(3, 0, 0);
    let pointLight13 = new PointLight(0xfffff, 1, 3);
    pointLight13.position.set(-3, 0, 0);
    let pointLight14 = new PointLight(0xfffff, 1, 3);
    pointLight14.position.set(0, 0, -3);
    let pointLight15 = new PointLight(0xfffff, 1, 3);
    pointLight15.position.set(0, 3, 0);
    let pointLight16 = new PointLight(0xfffff, 1, 3);
    pointLight16.position.set(0, -3, 0);*/

    //gonna die light in a few secs light
    //Licht aus dem Würfel nach außen heraus
    /*let pointLight0 = new PointLight(0xfffff, 0.5, 12);
    pointLight0.position.set(0, 0, 0);
          //Licht von außen auf den Würfel drauf (zum Bestrahlen des Würfels)
    let pointLight11 = new PointLight(0xfffff, 0.3, 3);
    pointLight11.position.set(0, 0, 3);
    let pointLight12 = new PointLight(0xfffff, 0.3, 3);
    pointLight12.position.set(3, 0, 0);
    let pointLight13 = new PointLight(0xfffff, 0.3, 3);
    pointLight13.position.set(-3, 0, 0);
    let pointLight14 = new PointLight(0xfffff, 0.3, 3);
    pointLight14.position.set(0, 0, -3);
    let pointLight15 = new PointLight(0xfffff, 0.3, 3);
    pointLight15.position.set(0, 3, 0);
    let pointLight16 = new PointLight(0xfffff, 0.3, 3);
    pointLight16.position.set(0, -3, 0);*/

    //Camera + light moves/turns with model move
    const PivotPoint = new Object3D();
    this.model.add(PivotPoint);
    //Licht aus dem Würfel heraus
    PivotPoint.add(pointLight0);
    //Licht, das den Würfel anscheint
    PivotPoint.add(pointLight11);
    PivotPoint.add(pointLight12);
    PivotPoint.add(pointLight13);
    PivotPoint.add(pointLight14);
    PivotPoint.add(pointLight15);
    PivotPoint.add(pointLight16);

    PivotPoint.add(camera);

    return this;
  }

  getModel(): Object3D {
    return this.model;
  }

  move(
    changedAxes: Ammo.btVector3,
    physicsWorld: Ammo.btDiscreteDynamicsWorld,
    scene: Scene
  ) {
    if (changedAxes.length() === 0) return;

    this.rigidBody.activate();

    if (changedAxes.y() !== 0) {
      const position = this.rigidBody.getWorldTransform().getOrigin();
      console.log(position.y());
      const to = new Ammo.btVector3(position.x(), 1, position.z());

      const rayResult = new Ammo.ClosestRayResultCallback(position, to);

      physicsWorld.rayTest(position, to, rayResult);

      const arrow = new ArrowHelper(
        new Vector3(position.x(), position.y(), position.z()),
        new Vector3(
          rayResult.get_m_hitPointWorld().x(),
          rayResult.get_m_hitPointWorld().y(),
          rayResult.get_m_hitPointWorld().z()
        ),
        1,
        0xff0000
      );
      scene.add(arrow);
      setTimeout(() => {
        scene.remove(arrow);
      }, 1500);

      console.log(
        "closest hit fraction is < 0.1",
        rayResult.get_m_closestHitFraction() < 0.1,
        rayResult.get_m_closestHitFraction()
      );

      if (rayResult.get_m_closestHitFraction() < 0.1 || true)
        this.rigidBody.applyCentralImpulse(
          new Ammo.btVector3(0, this.mass / 2, 0)
        );
    }

    //Triggerd on player move (WASD, Arrow Keys)
    changedAxes.setY(0);

    const vectorForward = this.camera.getWorldDirection(new Vector3());
    // cross product will give us a vector that is orthogonal to the other vectors, thus pointing to the right
    const vectorRight = this.camera.up.clone().cross(vectorForward);

    vectorForward.normalize();
    vectorRight.normalize();

    if (changedAxes.x() !== 0) {
      this.rigidBody.applyCentralForce(
        new Ammo.btVector3(vectorRight.x, vectorRight.y, vectorRight.z).op_mul(
          this.mass * 10 * -changedAxes.x()
        )
      );
    }
    if (changedAxes.z() !== 0) {
      this.rigidBody.applyCentralForce(
        new Ammo.btVector3(
          vectorForward.x,
          vectorForward.y,
          vectorForward.z
        ).op_mul(this.mass * 10 * -changedAxes.z())
      );
    }
  }

  initRigidBody(): Ammo.btRigidBody {
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(this.pos.x, this.pos.y, this.pos.z));
    transform.setRotation(
      new Ammo.btQuaternion(this.quat.x, this.quat.y, this.quat.z, this.quat.w)
    );
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(this.scale.x, this.scale.y, this.scale.z)
    );
    //colShape.setMargin(0.1);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(this.mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(
      this.mass,
      motionState,
      colShape,
      localInertia
    );

    this.rigidBody = new Ammo.btRigidBody(rbInfo);
    this.rigidBody.setAngularFactor(new Ammo.btVector3(0, 1, 0));
    this.rigidBody.setDamping(0.65, 1);
    return this.rigidBody;
  }
}
