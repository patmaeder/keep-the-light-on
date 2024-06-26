import {AmmoDebugDrawer, DefaultBufferSize,} from "ammo-debug-drawer";
import {BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments,} from "three";

export default class DebugDrawer {
    private debugGeometry;
    private debugDrawer;

    constructor() {
    }

    public initDebug(scene, physicsWorld) {
        let debugVertices = new Float32Array(DefaultBufferSize);
        let debugColors = new Float32Array(DefaultBufferSize);
        this.debugGeometry = new BufferGeometry();
        this.debugGeometry.setAttribute(
            "position",
            new BufferAttribute(debugVertices, 3)
        );
        this.debugGeometry.setAttribute(
            "color",
            new BufferAttribute(debugColors, 3)
        );
        let debugMaterial = new LineBasicMaterial({vertexColors: true});
        let debugMesh = new LineSegments(this.debugGeometry, debugMaterial);
        debugMesh.frustumCulled = false;
        scene.add(debugMesh);
        this.debugDrawer = new AmmoDebugDrawer(
            null,
            debugVertices,
            debugColors,
            physicsWorld
        );
        this.debugDrawer.enable();
        this.debugDrawer.setDebugMode(1);

        // setInterval(() => {
        //   let mode = (this.debugDrawer.getDebugMode() + 1) % 3;
        //   this.debugDrawer.setDebugMode(mode);
        // }, 1000);
    }

    animate() {
        if (this.debugDrawer) {
            if (this.debugDrawer.index !== 0) {
                this.debugGeometry.attributes.position.needsUpdate = true;
                this.debugGeometry.attributes.color.needsUpdate = true;
            }
            this.debugDrawer.update();

            this.debugGeometry.setDrawRange(0, this.debugDrawer.index);
        }
    }
}
