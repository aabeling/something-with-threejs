import { Color, DirectionalLight, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { Brick } from './brick';

export class App {

  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });

  private brick: Brick;

  constructor() {

    const color = 0xFFFFFF;
  const intensity = 1;
  const light = new DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  this.scene.add(light);

    this.brick = new Brick(100, new Color('rgb(50,50,0)'));
    this.scene.add(this.brick);

    this.camera.position.set(200, 200, 200);
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color('rgb(0,0,0)'));

    this.render();
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
    this.brick.rotateY(0.03);
  }
}
