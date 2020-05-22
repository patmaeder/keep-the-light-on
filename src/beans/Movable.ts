import { Box3, DoubleSide, Geometry, Material, Matrix4, Mesh, MeshPhongMaterial, Object3D, Scene, Vector3, } from "three";
import Ammo from "ammojs-typed";
import PhysicsHandler from "../Physics";
import THREE = require("three");

//###############################################################################Start: Calvin Reibenspieß
export default class Movable {
    private static material = new THREE.MeshPhongMaterial({
        refractionRatio: 0.92,
        reflectivity: 0.5,
        shininess: 30,
        flatShading: true,
        transparent: true,
        color: 0xf58a0c,
        opacity: 0.95,
    });
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

    static createBox(width, height, depth): Mesh {
        let geometry = new THREE.BoxGeometry(width, height, depth);
        let box = new THREE.Mesh(geometry, Movable.material);
        box.castShadow = true;
        box.receiveShadow = true;
        return box;
    }

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

    show(scene: Scene, physics: PhysicsHandler) {
        scene.add(this.model);
        physics.addPhysicsToMesh(this.model, this.initRigidBody());
    }
}
//###############################################################################Start: Calvin Reibenspieß
