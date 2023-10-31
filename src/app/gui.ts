export class Gui {

  readonly dom : HTMLElement;

  constructor() {

    this.dom = document.createElement('div');
    this.dom.style.cssText = 'position:fixed;top:0;right:200px;cursor:pointer;opacity:0.9;z-index:10000';
    this.dom.innerText = "Hallo";
  }
}
