import { loadModelObj, loadModel } from "../Loader";
import cuby from "../../assets/models/cube/cuby.glb";
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
  set intensity(value: number) {
    this._intensity = value;
    this.lights.forEach(value1 => {
      value1.intensity = this._intensity
    })
  }
  //make model with three.js
  private modelMaterial: Material = new MeshPhongMaterial({
    color: 0xffffff,
    side: DoubleSide,
  });

  private camera: Camera;
  private rigidBody: Ammo.btRigidBody;
  private model: Object3D;
  private scale = { x: 1, y: 1, z: 1 };
  private pos = { x: 70.54938507080078, y: 19.69999122619629, z: -21.15215492248535 };
  private quat = { x: 0, y: 0, z: 0, w: 1 };
  private mass = 10;
  private _intensity: number = 5;
  private lights: Array<PointLight> = [];

  async init(camera: Camera): Promise<Cube> {
    const gltf = await loadModel(cuby);

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
    //Licht aus dem Würfel nach außen heraus
    let intensity: number = 5;
    let pointLight0 = new PointLight(0xfffff, this._intensity, 20);
    pointLight0.position.set(0, 0, 0);
    this.lights.push(pointLight0);
    //Licht von außen auf den Würfel drauf (zum Bestrahlen des Würfels)
    let pointLight11 = new PointLight(0xfffff, this._intensity, 3);
    pointLight11.position.set(0, 0, 3);
    this.lights.push(pointLight11);
    let pointLight12 = new PointLight(0xfffff, this._intensity, 3);
    pointLight12.position.set(3, 0, 0);
    this.lights.push(pointLight12);
    let pointLight13 = new PointLight(0xfffff, this._intensity, 3);
    pointLight13.position.set(-3, 0, 0);
    this.lights.push(pointLight13);
    let pointLight14 = new PointLight(0xfffff, this._intensity, 3);
    pointLight14.position.set(0, 0, -3);
    this.lights.push(pointLight14);
    let pointLight15 = new PointLight(0xfffff, this._intensity, 3);
    pointLight15.position.set(0, 3, 0);
    this.lights.push(pointLight15);
    let pointLight16 = new PointLight(0xfffff, this._intensity, 3);
    pointLight16.position.set(0, -3, 0);
    this.lights.push(pointLight16);

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

  move(changedAxes: Ammo.btVector3) {
    if (changedAxes.length() === 0) return;

    this.rigidBody.activate();

    if (
      changedAxes.y() !== 0 &&
      Math.abs(this.rigidBody.getLinearVelocity().y()) < 0.01
    ) {
      console.log("jump");
      this.rigidBody.applyCentralImpulse(
        new Ammo.btVector3(0, this.mass * 12, 0)
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
    console.log(this.model.position);
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
