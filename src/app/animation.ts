/*
 * typescript version of
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_additive_blending.html
 */

import * as THREE from 'three';

import { Scene, WebGLRenderer, PerspectiveCamera, Clock, Color,
 HemisphereLight, DirectionalLight, AxesHelper } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class Animation {

  private readonly scene = new Scene();
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement
  });
  private camera : PerspectiveCamera;
  private stats : Stats = Stats();
  private readonly clock = new Clock();

  constructor() {

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
    this.camera.position.set( - 1, 2, 3 );

    this.scene.background = new Color( 0xa0a0a0 );
		this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

    const hemiLight = new HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
    hemiLight.position.set( 0, 20, 0 );
    this.scene.add( hemiLight );

//     const dirLight = new DirectionalLight( 0xffffff, 3 );
//     dirLight.position.set( 3, 10, 10 );
//     dirLight.castShadow = true;
//     dirLight.shadow.camera.top = 2;
//     dirLight.shadow.camera.bottom = - 2;
//     dirLight.shadow.camera.left = - 2;
//     dirLight.shadow.camera.right = 2;
//     dirLight.shadow.camera.near = 0.1;
//     dirLight.shadow.camera.far = 40;
//     this.scene.add( dirLight );

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
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
    const self = this;
    loader.load( 'Xbot.glb', function ( gltf : GLTF ) {

      let model = gltf.scene;
      self.scene.add( model );

      model.traverse( function ( object ) {

        if ("Bone" == object.type) {
          console.log(object);
          if (object.name == 'mixamorigNeck') {
            console.log(object)
            let neck = object as THREE.Bone;
            neck.rotation.x = 1.0;
            neck.rotation.y = 1.0;
            neck.rotation.z = 0.0;
          }
          if (object.name == 'mixamorigLeftArm') {
            let bone = object as THREE.Bone;
            bone.rotation.x = 1.0;
            bone.rotation.y = 1.0;
            bone.rotation.z = 0.0;
          }
        }

      } );
    }, function(progress) {},
    function(error) {
      console.error("failed to load", error);
    });

    this.stats = Stats();
    this.renderer.domElement.appendChild( this.stats.dom );

    this.animate();
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

}

