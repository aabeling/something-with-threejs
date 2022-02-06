import {
    Scene
} from "three";
import {
    OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader'

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
        let loader = new OBJLoader();
        loader.load('landscape.obj',
            function(object) {
                self.scene.add(object);
                console.log("landscape added to scene");
            },
            function(xhr) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            function(error) {
                console.log( 'An error happened' );
            });
    }
}