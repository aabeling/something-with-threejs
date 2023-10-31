/*
 * typescript version of
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_additive_blending.html
 */

import { Scene, WebGLRenderer, PerspectiveCamera, Clock, Color, Fog,
 HemisphereLight, DirectionalLight, AxesHelper, SkeletonHelper, Group, Bone,
 Mesh, PlaneGeometry, MeshPhongMaterial, Object3D } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { Gui } from './gui';

/**
 * Kind of a jointed doll (german: Gliederpuppe) with controls for all bones.
 */
export class Animation {

  private readonly scene : Scene;
  private renderer : WebGLRenderer;
  private camera : PerspectiveCamera;
  private stats : Stats = new Stats();
  private gui : Gui;
  private readonly clock = new Clock();
  private model : Group = new Group();

  constructor() {

    const container = document.getElementById('main-canvas') as HTMLCanvasElement;

    /*
     * Prepare scene
     */
    this.scene = new Scene();
    this.scene.background = new Color( 0xa0a0a0 );
		this.scene.fog = new Fog( 0xa0a0a0, 1, 10 );

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

    const mesh = new Mesh(
      new PlaneGeometry( 100, 100 ),
      new MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add( mesh );

    const axes = new AxesHelper(10);
    axes.renderOrder = 1;
    this.scene.add(axes);

    this.gui = new Gui();

    this.loadGltf();

    /* prepare renderer */
    this.renderer = new WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;
    container.appendChild( this.renderer.domElement );

    /* prepare camera */
    this.camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
    this.camera.position.set( 1, 2, 3 );

    /* prepare controls */
    const controls = new OrbitControls( this.camera, this.renderer.domElement );
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.target.set( 0, 1, 0 );
    controls.update();

    this.stats = new Stats();
    container.appendChild(this.stats.dom)

    container.appendChild(this.gui.dom);

    this.animate();

    window.addEventListener( 'resize', this.onWindowResize );
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
  }

  private render() {

    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }

  private loadGltf() {

    const loader = new GLTFLoader();
    const self = this;
    loader.load( 'Ybot.glb', function ( gltf : GLTF ) {
      let model = gltf.scene;
      self.addModel(model);
      self.gui.updateModel(model);
    }, function(progress : ProgressEvent) {
      console.log(`loading progress: ${progress.loaded * 100 / progress.total}%`);
    },
    function(error) {
      console.error("failed to load", error);
    });
  }

  private loadFbx() {

    const loader = new FBXLoader();
    const self = this;
    loader.load( 'Ybot.fbx', function ( object : Group ) {
      let model = object;
      // fbx needs scaling
      model.scale.set(0.01,0.01,0.01)
      self.addModel(model);
      self.model = model;
    }, function(progress : ProgressEvent) {
      console.log(`loading progress: ${progress.loaded * 100 / progress.total}%`);
    },
    function(error) {
      console.error("failed to load", error);
    });
  }

  private addModel( model : Group) {

    this.scene.add( model );

    let skeleton = new SkeletonHelper( model );
    skeleton.visible = true;
    this.scene.add( skeleton );

    /* move some bones just to test */
    model.traverse( function ( object : Object3D ) {
      object.castShadow = true;
    } );
  }

  private onWindowResize = () => {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }
}

