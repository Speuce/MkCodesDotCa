import { Scene } from "../scene.js";
import { MeshStandardMaterial } from "three"

export class Scene2 extends Scene {
  constructor() {
    super(0, 1200);
    this.rotatingObjectMaterial = new MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.75, metalness: 1 });
    this.textMaterial = new THREE.MeshStandardMaterial({ color: 0xFFAB45, roughness: 0.35, metalness: 0.5 });
    this.toDim = [this.textMaterial, this.rotatingObjectMaterial];
  }

  addObjects(scene) {

  }

  generateBinaryFloatingText(scene, number, zoffset, zspread) {
    const materials = [new THREE.MeshBasicMaterial({ color: 0x2A8542 }), new THREE.MeshBasicMaterial({ color: 0xBBBBBB })];
    const geometries = [get3DTextGeometry('1', 6, 0.7, false), get3DTextGeometry('0', 6, 0.7, false)];
    const spread = global.constrainingDimension;
    const rotationSpread = 0.01;
    let mesh;
    [...Array(number)].forEach(() => {
      mesh = new THREE.Mesh(_.sample(geometries), _.sample(materials));
      mesh.position.set(THREE.MathUtils.randFloatSpread(spread), THREE.MathUtils.randFloatSpread(spread), zoffset + THREE.MathUtils.randFloatSpread(zspread));
      scene.add(mesh);
    });
  }

  onStart(camera) {
    camera.position.x = 0;
    camera.rotation.y = 0;
    camera.rotation.x = 0;
    camera.rotation.z = 0;
  }

  onScroll(scrollY, camera) {
    camera.position.z = scrollY / 10 + 50
  }
}
