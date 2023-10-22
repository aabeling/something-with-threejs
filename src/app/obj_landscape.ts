import {
    Scene
} from "three";
import {
    OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

/**
 * Experiment with displacement map to simulate a terrain with heights.
 * 
 */
export class ObjLandscape {

    constructor(
        private scene: Scene) {
        /* intentionally left blank */
    }

    create() {

        let self = this;
        // https://sbcode.net/threejs/loaders-mtl/
        // https://threejs.org/docs/#examples/en/loaders/MTLLoader
        let mtlLoader = new MTLLoader();
        mtlLoader.load(
            'texturetest.mtl',
            (materials) => {
                materials.preload()
        
                const objLoader = new OBJLoader()
                objLoader.setMaterials(materials)
                objLoader.load(
                    'texturetest.obj',
                    (object) => {
                        self.scene.add(object)
                    },
                    (xhr) => {
                        console.log((xhr.loaded / xhr.total) * 100 + '% of object loaded')
                    },
                    (error) => {
                        console.log('An error happened')
                    }
                )
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% of materials loaded')
            },
            (error) => {
                console.log('An error happened')
            }
        )

    }
}