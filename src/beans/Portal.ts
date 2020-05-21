import {loadModel} from "../Loader";
import portalModel from "../../assets/portal/portal.glb";
import * as THREE from "three";
import {Object3D, Vector3} from "three";

export default class Portal {
    private scale = {x: 2, y: 8, z: 8};
    private _pos = {x: 10.5, y: 0.5, z: -46.78};

    private model: Object3D;

    async init(): Promise<Portal> {
        const gltf = await loadModel(portalModel);
        this.model = gltf.scene;
        this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
        this.model.position.set(this._pos.x, this._pos.y, this._pos.z);
        this.model.rotateOnAxis(new Vector3(0, 1, 0), Math.PI * 1.5);
        this.setupLights();
        return this;
    }

    getModel(): Object3D {
        return this.model;
    }

    private setupLights() {
        //###############################################################################Start: Patrick Mäder
        let pointLightPortal1 = new THREE.PointLight(0xffffff, 1.5, 1.8, 2);
        pointLightPortal1.position.set(0.1, 0.8, -0.1);
        this.model.add(pointLightPortal1);

        let pointLightPortal2 = new THREE.PointLight(0xffffff, 1.5, 4, 2);
        pointLightPortal2.position.set(0.1, 0.5, 0);
        this.model.add(pointLightPortal2);

        let pointLightPortal3 = new THREE.PointLight(0xffffff, 1.5, 1.8, 2);
        pointLightPortal3.position.set(0.1, 0.25, 0.1);
        this.model.add(pointLightPortal3);

        let pointLightPortal4 = new THREE.PointLight(0xffffff, 1.5, 1.8, 2);
        pointLightPortal4.position.set(0.1, 0.4, -0.2);
        this.model.add(pointLightPortal4);

        let pointLightPortal5 = new THREE.PointLight(0xffffff, 1.5, 1.8, 2);
        pointLightPortal5.position.set(0.1, 0.6, 0.15);
        this.model.add(pointLightPortal5);

        let pointLightPortal6 = new THREE.PointLight(0x990e96, 1.7, 8, 2);
        pointLightPortal6.position.set(1, 0.5, 0);
        this.model.add(pointLightPortal6);
        //###############################################################################Ende: Patrick Mäder
    }

}