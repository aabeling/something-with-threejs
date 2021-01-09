import { AxesHelper, Clock, Color, DirectionalLight, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { CityBuilder } from './citybuilder';
import { SkeletonBuilder } from './skeletonbuilder';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class App {

  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });
  private controls : any;
  private clock : Clock = new Clock();

  constructor() {

    const axes = new AxesHelper();
    axes.renderOrder = 1;
    this.scene.add(axes);

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.scene.add(light);

    // new CityBuilder(this.scene, 100).create();
    new SkeletonBuilder(this.scene).create();

    this.camera.position.set(0, 500, 1000);
    this.camera.lookAt(new Vector3(0, 0, 0));
    this.camera.zoom = 12;

    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color('rgb(0,0,0)'));

    this.setOrbitControls();

    this.render();
  }

  private setFirstPersonControls() {

    this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);
    this.controls.movementSpeed = 100;
    this.controls.lookSpeed = 0.1;
  }

  private setOrbitControls() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private render() {

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());

    this.adjustCanvasSize();
    const delta = this.clock.getDelta();
    this.controls.update(delta);
  }
}
