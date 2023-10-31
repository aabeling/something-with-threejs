import { Group, Object3D, Bone } from 'three';

/**
 * Provides a selectbox for the bones and sliders to change the
 * bone's rotation.
 */
export class Gui {

  readonly dom : HTMLDivElement;
  private model : Group = new Group();
  private selectElem : HTMLSelectElement;
  private xSlider : HTMLInputElement;
  private ySlider : HTMLInputElement;
  private zSlider : HTMLInputElement;

  constructor() {

    this.dom = document.createElement('div');
    this.dom.style.cssText = 'position:fixed;top:0;right:200px;cursor:pointer;z-index:10000';

    this.selectElem = document.createElement('select');
    this.selectElem.name = 'bones';
    this.selectElem.id = 'bones';
    this.selectElem.addEventListener('change', () => this.onBoneChanged(this.selectElem.value));
    this.dom.appendChild(this.selectElem);

    const sliders = document.createElement('div');
    this.dom.appendChild(sliders);

    this.xSlider = document.createElement('input');
    this.xSlider.type = 'range';
    this.xSlider.min = '-180';
    this.xSlider.max = '180';
    this.xSlider.value = '0';
    this.xSlider.addEventListener('input', () => this.onSliderChanged('x', this.xSlider.value));
    sliders.appendChild(this.xSlider);
    sliders.appendChild(document.createElement('br'));

    this.ySlider = document.createElement('input');
    this.ySlider.type = 'range';
    this.ySlider.min = '-180';
    this.ySlider.max = '180';
    this.ySlider.value = '0';
    this.ySlider.addEventListener('input', () => this.onSliderChanged('y', this.ySlider.value));
    sliders.appendChild(this.ySlider);
    sliders.appendChild(document.createElement('br'));

    this.zSlider = document.createElement('input');
    this.zSlider.type = 'range';
    this.zSlider.min = '-180';
    this.zSlider.max = '180';
    this.zSlider.value = '0';
    this.zSlider.addEventListener('input', () => this.onSliderChanged('z', this.zSlider.value));
    sliders.appendChild(this.zSlider);
  }

  updateModel(model : Group) {

    this.model = model;

    const self = this;
    model.traverse( function ( object : Object3D ) {

      if ("Bone" == object.type) {
        const option = document.createElement("option");
        option.value = object.name;
        option.text = object.name;
        self.selectElem.add(option);
      }
    } );
  }

  /**
   * Updates the slider values with the rotation values from the
   * currently selected bone.
   */
  private onBoneChanged = (name : String) => {

    let bone : Bone | null = this.findSelectedBone();
    if (bone !== null) {
      this.xSlider.value = String(bone.rotation.x * 180.0 / Math.PI);
      this.ySlider.value = String(bone.rotation.y * 180.0 / Math.PI);
      this.zSlider.value = String(bone.rotation.z * 180.0 / Math.PI);
    }
  }

  /**
   * Updates the rotation for the currently selected bone
   * from a slider value.
   */
  private onSliderChanged = (axis : String, value : String) => {

    let bone : Bone | null = this.findSelectedBone();
    if (bone !== null) {
      if (axis == 'x') {
        bone.rotation.x = Number(value) * Math.PI / 180.0;
      }
      if (axis == 'y') {
        bone.rotation.y = Number(value) * Math.PI / 180.0;
      }
      if (axis == 'z') {
        bone.rotation.z = Number(value) * Math.PI / 180.0;
      }
    }
  }

  /**
   * Returns the currenlty selected bone from the model
   */
  private findSelectedBone() : Bone | null {

    let result : Bone | null = null;
    let self = this;
    this.model.traverse( function ( object : Object3D ) {
      if ("Bone" == object.type) {
        if (object.name == self.selectElem.value) {
          result = object as Bone;
        }
      }
    } );

    return result;
  }
}
