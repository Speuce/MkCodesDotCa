import { Scene } from "../scene.js";
import { MeshStandardMaterial } from "three"

export class Scene4 extends Scene {
  constructor() {
    super(0, 1200);
  }

  addObjects(scene) {

  }

  onStart(camera) {
    camera.position.y = 0;
  }

  onScroll(scrollY, camera) {
    camera.rotation.y = (Math.PI / 2) - (scrollY - 2978) / 500;
  }
}
