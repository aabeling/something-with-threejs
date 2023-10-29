import { Scene, Bone, Skeleton, SkeletonHelper, SkinnedMesh, CylinderGeometry, BufferGeometry, MeshPhongMaterial, DoubleSide } from "three";
import { Vector3, Uint16BufferAttribute, Float32BufferAttribute } from "three";

/**
 * Creates the skeleton of a human.
 */
export class SkeletonBuilder {

    constructor(private scene: Scene) { }

    create() {

        this.initBones();
    }

    initBones() {

        const segmentHeight = 8;
        const segmentCount = 4; // number of bones
        const height = segmentHeight * segmentCount;
        const halfHeight = height * 0.5;

        const sizing = {
            segmentHeight: segmentHeight,
            segmentCount: segmentCount,
            height: height,
            halfHeight: halfHeight
        };

        const geometry = this.createGeometry( sizing );
        const bones = this.createBones( sizing );
        const mesh = this.createMesh( geometry, bones );

        mesh.scale.multiplyScalar( 1 );
        this.scene.add( mesh );
    }

    createGeometry( sizing : any) : BufferGeometry {

        const geometry = new CylinderGeometry(
            5, // radiusTop
            5, // radiusBottom
            sizing.height, // height
            20, // radiusSegments
            sizing.segmentCount * 3, // heightSegments
            true // openEnded
        );

        const position = geometry.attributes.position;

        const vertex = new Vector3();

        const skinIndices = [];
        const skinWeights = [];

        for ( let i = 0; i < position.count; i ++ ) {

            vertex.fromBufferAttribute( position, i );

            const y = ( vertex.y + sizing.halfHeight );

            const skinIndex = Math.floor( y / sizing.segmentHeight );
            const skinWeight = ( y % sizing.segmentHeight ) / sizing.segmentHeight;

            skinIndices.push( skinIndex, skinIndex + 1, 0, 0 );
            skinWeights.push( 1 - skinWeight, skinWeight, 0, 0 );

        }

        geometry.setAttribute( 'skinIndex', new Uint16BufferAttribute( skinIndices, 4 ) );
        geometry.setAttribute( 'skinWeight', new Float32BufferAttribute( skinWeights, 4 ) );

        return geometry;

    }

    createBones( sizing : any) {

        const bones = [];

        let prevBone = new Bone();
        bones.push( prevBone );
        prevBone.position.y = - sizing.halfHeight;

        for ( let i = 0; i < sizing.segmentCount; i ++ ) {

            const bone = new Bone();
            bone.position.y = sizing.segmentHeight;
            bones.push( bone );
            prevBone.add( bone );
            prevBone = bone;

        }

        return bones;
    }

    createMesh( geometry : BufferGeometry, bones : Bone[]) {

        const material = new MeshPhongMaterial( {
//             skinning: true,
//             color: 0x156289,
//             emissive: 0x072534,
//             side: DoubleSide,
//             flatShading: true
        } );

        const mesh = new SkinnedMesh( geometry,	material );
        const skeleton = new Skeleton( bones );

        mesh.add( bones[ 0 ] );

        mesh.bind( skeleton );

        const skeletonHelper = new SkeletonHelper( mesh );
        //skeletonHelper.material.linewidth = 2;
        this.scene.add( skeletonHelper );

        return mesh;

    }
}
