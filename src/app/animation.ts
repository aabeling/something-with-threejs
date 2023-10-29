/*
 * typescript version of
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_additive_blending.html
 */

import * as THREE from 'three';

import { Scene, WebGLRenderer, PerspectiveCamera, Clock, Color,
 HemisphereLight, DirectionalLight, AxesHelper, SkeletonHelper, Group } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

export class Animation {

  private readonly scene : Scene;
  private renderer : WebGLRenderer;
  private camera : PerspectiveCamera;
  private stats : Stats = Stats();
  private readonly clock = new Clock();

  constructor() {

    const container = document.getElementById('main-canvas') as HTMLCanvasElement;

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;
    container.appendChild( this.renderer.domElement );

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
    this.camera.position.set( - 1, 2, 3 );

    this.scene = new Scene();
    this.scene.background = new Color( 0xa0a0a0 );
		this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

    const hemiLight = new HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
    hemiLight.position.set( 0, 20, 0 );
    this.scene.add( hemiLight );

    const dirLight = new DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( 3, 10, 10 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    this.scene.add( dirLight );

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry( 100, 100 ),
      new THREE.MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add( mesh );

    const axes = new AxesHelper(10);
    axes.renderOrder = 1;
    this.scene.add(axes);

    const controls = new OrbitControls( this.camera, this.renderer.domElement );
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.target.set( 0, 1, 0 );
    controls.update();

    const loader = new GLTFLoader();
//     const loader = new FBXLoader();
    const self = this;
    loader.load( 'Xbot.glb', function ( gltf : GLTF ) {
//     loader.load( 'sophie.fbx', function ( object : Group ) {
      let model = gltf.scene;
//       let model = object;
      // fbx needs scaling
//       model.scale.set(0.01,0.01,0.01)
      self.scene.add( model );


      let skeleton = new SkeletonHelper( model );
      skeleton.visible = true;
      self.scene.add( skeleton );

      model.traverse( function ( object ) {

        if ("Bone" == object.type) {
//           console.log(object);
          if (object.name == 'mixamorigNeck') {
            console.log(object)
            let neck = object as THREE.Bone;
            neck.rotation.x = 0.0;
            neck.rotation.y = 0.0;
            neck.rotation.z = 0.0;
          }
          if (object.name == 'mixamorigLeftArm') {
            let bone = object as THREE.Bone;
            bone.rotation.x = 0.5;
            bone.rotation.y = 1.0;
            bone.rotation.z = 0.0;
          }
        }

      } );
    }, function(progress : ProgressEvent) {
      console.log(`loading progress: ${progress.loaded * 100 / progress.total}%`);
    },
    function(error) {
      console.error("failed to load", error);
    });

    this.stats = Stats();
    container.appendChild(this.stats.dom)

    this.animate();
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
  }

  private render() {

    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }

  private createPanel() {

//     const panel = new GUI( { width: 310 } );
  }
}

