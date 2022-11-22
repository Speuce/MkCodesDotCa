import { Scene } from "../scene.js";
import { MeshStandardMaterial } from "three"

export class Scene5 extends Scene {
  constructor() {
    super(0, 1200);
  }

  addObjects(scene) {

  }

  onStart(camera) {
    camera.position.y = 0;
  }

  onScroll(scrollY, camera) {
    camera.position.y = -(scrollY - 3763) * global.xdistance * 0.00015;
    camera.rotation.z = Math.PI / 2 - (scrollY - 3763) * 0.00024;
  }

  onEnd(camera) {
    camera.position.x = global.xdistance;
    camera.position.z = 70;
    camera.rotation.x = -Math.PI / 2;
    camera.rotation.z = Math.PI / 2;
    camera.rotation.y = 0;
  }
}
