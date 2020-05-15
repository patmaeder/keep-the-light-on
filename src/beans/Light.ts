//###############################################################################Start: Alischa Thomas
import {
  PointLight,
  Object3D,
  Mesh,
  SphereGeometry,
  MeshPhongMaterial,
  MeshBasicMaterial,
} from "three";

export default class Light {
  private model: Mesh;
  private light: PointLight;
  private scale = { x: 1, y: 1, z: 1 };
  private initialPos = { x: 0, y: 0, z: 0 };

  async init(object: Mesh, initialPos, light): Promise<Light> {
    this.light = light;
    this.model = object;
    this.initialPos = initialPos;
    this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
    this.model.add(light);

    this.model.position.set(initialPos.x, initialPos.y + 0.25, initialPos.z);

    //set the light to the cube's origin
    light.position.set(0, 0, 0);

    //Licht aus dem Würfel heraus
    return this;
  }

  getModel(): Object3D {
    return this.model;
  }
}

//###############################################################################Ende: Alischa Thomas

