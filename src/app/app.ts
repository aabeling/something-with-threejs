import { AxesHelper, Clock, Color, DirectionalLight, PerspectiveCamera, Scene, Vector3, WebGLRenderer,
  Vector } from 'three';
import { CityBuilder } from './citybuilder';
import { TerrainBuilder } from './terrainbuilder';
import { ObjLandscape } from './obj_landscape';
import { SkeletonBuilder } from './skeletonbuilder';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';

export class App {

  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(30, innerWidth / innerHeight, 1, 1000);
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });
  private controls!: PointerLockControls;
  private clock : Clock = new Clock();
  private stats : Stats = Stats();

  /* movement inspired by https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html */
  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;
  private canJump = false;
  private velocity = new Vector3();
  private direction = new Vector3(1,0,0);
  private lastRenderTime = performance.now();

  constructor() {

    document.body.appendChild(this.stats.dom)

    const axes = new AxesHelper(10);
    axes.renderOrder = 1;
    this.scene.add(axes);

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.scene.add(light);

    new ObjLandscape(this.scene).create();

    this.camera.position.set(0, 1, 0);
    this.camera.lookAt(new Vector3(1, 1, 0));
    this.camera.zoom = 12;

    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color('rgb(0,0,0)'));

    this.setPointerLockControls();

    let self = this;
    this.renderer.domElement.addEventListener(
      'click',
      function () {
          if (self.controls.isLocked === false) {
            self.controls.lock()
          }
      },
      false
    )

    document.addEventListener('keydown', e => this.onKeyDown(e));
    document.addEventListener('keyup', e => this.onKeyUp(e));

    this.lastRenderTime = performance.now();
    this.animate();
  }

  private onKeyDown(event : KeyboardEvent) {

    switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
        this.moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        this.moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        this.moveBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        this.moveRight = true;
        break;

      case 'Space':
        /* TODO later
        if ( canJump === true ) velocity.y += 350;
        canJump = false;
        break;
        */
    }

  }

  private onKeyUp(event : KeyboardEvent) {

    switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
        this.moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        this.moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        this.moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        this.moveRight = false;
        break;

    }
  }

  private setPointerLockControls() {

    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    
    let render = this.renderer;
    let self = this;
    this.controls.addEventListener( 'lock', function () {

      console.log("display locked");
    
    } );
    
    this.controls.addEventListener( 'unlock', function () {
    
      console.log("display unlocked");
    } );

    
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private animate() {

    requestAnimationFrame(() => this.animate());

    this.move();
    this.render();
    this.stats.update();
  }

  private move() {

    const time = performance.now();

    /* do not move if not locked */
    if (this.controls.isLocked) {
     
      const timeDelta = ( time - this.lastRenderTime ) / 200;

      if (this.moveForward) {
        this.controls.moveForward(timeDelta);
      }

      if (this.moveBackward) {
        this.controls.moveForward(-timeDelta);
      }

      if (this.moveLeft) {
        this.controls.moveRight(-timeDelta);
      }

      if (this.moveRight) {
        this.controls.moveRight(timeDelta);
      }
    }

    this.lastRenderTime = time;
  }

  private render() {

    this.renderer.render(this.scene, this.camera);
    //this.adjustCanvasSize();
  }

}