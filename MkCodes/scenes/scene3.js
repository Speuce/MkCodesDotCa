import { Scene } from "../scene.js";
import { MeshBasicMaterial, FBXLoader } from "three"

export class Scene3 extends Scene {
  constructor() {
    super(0, 1200);
  }

  addObjects(scene) {
    const loader2 = new FBXLoader();
    const shipMaterial = new MeshBasicMaterial({ color: 0xFFAB45, wireframe: true });
    loader2.load("/ROCKET.fbx", model => {
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = shipMaterial;
        }
      });
      const scale = global.constrainingDimension / 60;
      model.scale.x = scale;
      model.scale.z = scale;
      model.scale.y = scale;
      model.position.z = 70;
      model.position.y = global.constrainingDimension * 0.13;
      model.position.x = global.xdistance * 0.8;
      this.spaceship = model;
      scene.add(model);
      console.log("--- spaceship ----");
    });
  }

  onStart(camera) {
    camera.rotation.x = 0;
    camera.rotation.z = 0;
  }

  onScroll(scrollY, camera) {
    //parametric form of circle
    const t = (scrollY - 1800) / 750;
    camera.position.x = global.xdistance * Math.sin(t);
    camera.position.z = 70 + 160 * Math.cos(t);

    //also rotate camera
    camera.rotation.y = Math.atan(camera.position.x / (camera.position.z - 70));
  }

  onEnd(camera) {
    camera.position.x = global.xdistance;
    camera.position.z = 70;
    camera.rotation.y = Math.PI / 2;
    camera.rotation.x = -Math.PI / 2;
    camera.rotation.z = Math.PI / 2;
  }
}
