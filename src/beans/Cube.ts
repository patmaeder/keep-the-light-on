import {loadModel} from "../Loader";
import cuby from "../../assets/models/cube/cuby.glb";
import moving from "../../assets/music/bewegen/move.mp3";
import jumping from "../../assets/music/springen/spring-sound.mp3";
import {Camera, DoubleSide, Material, Mesh, MeshPhongMaterial, Object3D, PointLight, Vector3,} from "three";
import Ammo from "ammojs-typed";
import Sound from "../effects/Sound";


export default class Cube {
    //make model with three.js
    private modelMaterial: Material = new MeshPhongMaterial({
        color: 0xffffff,
        side: DoubleSide,
    });
    private movingSound: Sound;
    private jumpingSound: Sound;
    private camera: Camera;
    private rigidBody: Ammo.btRigidBody;
    private model: Object3D;
    private scale = {x: 1, y: 1, z: 1};
    private pos = {
        x: 70.54938507080078,
        y: 19.69999122619629,
        z: -21.15215492248535,
    };
    private quat = {x: 0, y: 0, z: 0, w: 1};
    private mass = 10;
    private lights: Array<PointLight> = [];
    private vector1: Vector3;
    private vector2: Vector3;
    private vectorBt: Ammo.btVector3;

    constructor() {
        this.vector1 = new Vector3();
        this.vector2 = new Vector3();
        this.vectorBt = new Ammo.btVector3();
    }

    private _intensity: number = 5;

    set intensity(value: number) {
        this._intensity = value;
        this.lights.forEach(value1 => {
            value1.intensity = this._intensity
        })
    }

    async init(camera: Camera): Promise<Cube> {
        this.movingSound = new Sound(camera, moving);
        this.movingSound.setVolume(0.1);
        this.movingSound.setLoop(true)
        this.movingSound.pause();
        this.jumpingSound = new Sound(camera, jumping);
        this.jumpingSound.setVolume(0.1);
        this.jumpingSound.setLoop(false)
        this.jumpingSound.pause();


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

        //###############################################################################Start: Alischa Thomas
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

    //###############################################################################Ende: Alischa Thomas


    getModel(): Object3D {
        return this.model;
    }

    move(changedAxes: Number[]) {
        if (!changedAxes[0] && !changedAxes[1] && !changedAxes[2]){
            this.movingSound.pause()
            return;
        }

        this.rigidBody.activate();

        if (
            changedAxes[1] !== 0 &&
            Math.abs(this.rigidBody.getLinearVelocity().y()) < 0.01
        ) {
            this.rigidBody.applyCentralImpulse(
                new Ammo.btVector3(0, this.mass * 12, 0)
            );
            if(!this.jumpingSound.isPlaying()){
                this.jumpingSound.play();
            }
        }

        //Triggerd on player move (WASD, Arrow Keys)
        const vectorForward = this.camera.getWorldDirection(this.vector1);
        // cross product will give us a vector that is orthogonal to the other vectors, thus pointing to the right
        const vectorRight = this.vector2.copy(this.camera.up).cross(vectorForward);

        vectorForward.normalize();
        vectorRight.normalize();

        if (changedAxes[0] !== 0) {
            this.vectorBt.setValue(vectorRight.x, vectorRight.y, vectorRight.z);
            this.rigidBody.applyCentralForce(
                this.vectorBt.op_mul(this.mass * 10 * -changedAxes[0])
            );
        }
        if (changedAxes[2] !== 0) {
            this.vectorBt.setValue(vectorForward.x, vectorForward.y, vectorForward.z);
            this.rigidBody.applyCentralForce(
                this.vectorBt.op_mul(this.mass * 10 * -changedAxes[2])
            );
        }
        if(changedAxes[2] !== 0 || changedAxes[0] !== 0 ){
            if(!this.movingSound.isPlaying()){
                this.movingSound.play();
            }
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
