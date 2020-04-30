import {loadModel} from "../Loader";
import portalModel from "../../assests/portal/portal.glb";
import * as THREE from "three";
import {Object3D} from "three";

export default class Portal{
    private scale = { x: 0, y: 2.5, z: 3 };
    private _pos = { x: 0.58, y: 0.7, z: -21 };

    private model: Object3D;
    async init(): Promise<Portal> {
        const gltf = await loadModel(portalModel);
        this.model = gltf.scene;
        this.model.scale.set(this.scale.x,this.scale.y,this.scale.z);
        this.model.position.set(this._pos.x,this._pos.y,this._pos.z);
        this.setupLights();
        return this;
    }
    private setupLights(){
        let pointLightPortal1 = new THREE.PointLight(0xffffff, 1.8, 10, 2);
        pointLightPortal1.position.set(0.1, 0.5, 0);
        this.model.add(pointLightPortal1);

        let pointLightPortal2 = new THREE.PointLight(0x990e96, 1.5, 12, 2);
        pointLightPortal2.position.set(1, 0.5, 0);
        this.model.add(pointLightPortal2);
    }

    getModel(): Object3D {
        return this.model;
    }

}