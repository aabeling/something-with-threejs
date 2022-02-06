import {
    Scene,  DoubleSide, Mesh, MeshBasicMaterial, MeshPhongMaterial,
    PlaneGeometry, 
    Line, WireframeGeometry, LineBasicMaterial,
    TextureLoader
} from "three";

/**
 * Experiment with displacement map to simulate a terrain with heights.
 * 
 */
export class TerrainBuilder {

    constructor(
        private scene: Scene) {
        /* intentionally left blank */
    }

    create() {

        /* the preetz_heightmap.png has size 1710x797 */
        let terrainWidth = 1710;
        let terrainHeight = 797;

        let planeMap = new TextureLoader().load(
            'heightmap/material.png',
            (texture) => {
                planeMaterial.map = texture;
                console.log("displacementmap loaded");
            },
            undefined,
            (error) => {
                console.error("failed to load displacementmap", error);
            }
        )

        let displacementMap = new TextureLoader().load(
            'heightmap/heightmap.png',
            (texture) => {
                planeMaterial.displacementMap = texture;
                console.log("displacementmap loaded");
            },
            undefined,
            (error) => {
                console.error("failed to load displacementmap", error);
            }
        )

        let planeMaterial = new MeshPhongMaterial();
        planeMaterial.map = planeMap;
        planeMaterial.displacementMap = displacementMap;
        planeMaterial.displacementBias = 0.0;
        planeMaterial.displacementScale = 4.0;
        let planeGeometry = new PlaneGeometry(10, 10, terrainWidth / 10, terrainHeight / 10);
        let plane = new Mesh(planeGeometry, planeMaterial);
        plane.rotation.set(-Math.PI / 2, 0, 0);
    

        this.scene.add(plane);

        /* add wireframe to see the segments of the plane */
        let wireframeGeometry = new WireframeGeometry( planeGeometry );
        let wireframeMaterial = new LineBasicMaterial();
        let wireframe = new Line( wireframeGeometry, wireframeMaterial );
        wireframe.rotation.set(-Math.PI / 2, 0, 0);
        this.scene.add( wireframe );
    }
}