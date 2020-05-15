import {ArrowHelper, Material, Mesh, Scene, Vector3} from "three";

export const destroyElement = (
    scene: Scene,
    mesh: Mesh,
    keepMaterial = false
) => {
    mesh.geometry.dispose();
    if (!keepMaterial) {
        (<Material>mesh.material).dispose();
    }
    mesh.material = undefined;
    mesh.geometry = undefined;
    scene.remove(mesh);
};

export const drawArrow = (
    scene,
    direction: Vector3,
    origin: Vector3,
    decay = 1000
) => {
    const help = new ArrowHelper(direction, origin, 1, 0xffff00);

    scene.add(help);
    setTimeout(() => scene.remove(help), decay);
};

type VectorLike = {
    x: number;
    y: number;
    z: number;
};

export const createVector = (obj: VectorLike): Vector3 => {
    return new Vector3(obj.x, obj.y, obj.z);
};
