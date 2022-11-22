import { Scene } from "../scene.js";
import { MeshStandardMaterial } from "three"

export class Scene1 extends Scene {
    constructor() {
        super(0, 1200);
        this.rotatingObjectMaterial = new MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.75, metalness: 1 });
        this.textMaterial = new THREE.MeshStandardMaterial({ color: 0xFFAB45, roughness: 0.35, metalness: 0.5 });
        this.toDim = [this.textMaterial, this.rotatingObjectMaterial];
    }

    addObjects(scene) {
        const density = Math.round(global.constrainingDimension ** 2 / 200);
        createText(density);
        this.isocahedrons = generateRotatingObjects(Math.max(Math.round(density / 15), 30));
    }

    createText(density, scene) {
        mkText = generate3DText('MK', 10, textMaterial);
        mynameObject = generate3DText('Matthew Kwiatkowski', 1.33, textMaterial);
        titleObject = generate3DText('Software Developer', 3, textMaterial);

        generateBinaryFloatingText(density, 70, Math.max(20, window.innerWidth / 80));
        mkText.position.y = 8.5;
        mynameObject.position.y = -3.5;
        titleObject.position.y = 0;
        textMaterial.transparent = true;
        rotatingObjectMaterial.transparent = true;

        scene.add(mkText, titleObject, mynameObject);
        scene1ToRotate.push(mkText, titleObject, mynameObject);
    }

    onScroll(scrollY, camera) {
        const rotationY = scrollY / 100;
        scene1ToRotate.forEach((item) => {
            item.rotation.y = rotationY;
        });
        const opacity = Math.min(1, 1 - ((scrollY - 500) / 700));
        scene1ToDim.forEach((material) => {
            material.opacity = opacity;
        });
        camera.position.z = scrollY / 10 + 50
        camera.position.x = 0;
        camera.rotation.y = 0;
    }

    onEnd(camera) {
        camera.position.z = 230;
        scene1ToDim.forEach((material) => {
            material.opacity = 0;
        });
    }

    generateRotatingObjects(number) {
        const geometries = [new THREE.IcosahedronBufferGeometry(2), new THREE.IcosahedronBufferGeometry(1.25), new THREE.IcosahedronBufferGeometry(1.5), new THREE.IcosahedronBufferGeometry(1.75)];
        let mesh, x, y;
        let objects = [];
        [...Array(number)].forEach(() => {
            mesh = new THREE.Mesh(_.sample(geometries), rotatingObjectMaterial);
            [x, y] = constrainOutOfBox(THREE.MathUtils.randFloatSpread(global.vw / 1.5), THREE.MathUtils.randFloatSpread(global.vh / 1.5), 30, 23)
            if (!objects.some(({ mesh, rotate }) => isWithinDistance(mesh.position.x, x, mesh.position.y, y, 5))) {
                mesh.position.set(x, y, -15 + THREE.MathUtils.randFloatSpread(5));
                scene.add(mesh);
                objects.push({ mesh, rotate: [THREE.MathUtils.randFloatSpread(0.03), THREE.MathUtils.randFloatSpread(0.03), THREE.MathUtils.randFloatSpread(0.03)] });
            }
        });
        return objects;
    }

    animate() {
        if (this.isocahedrons) {
            let x, y, z;
            isocahedrons.forEach(({ mesh, rotate }) => {
                [x, y, z] = rotate;
                mesh.rotation.x += x;
                mesh.rotation.y += y;
                mesh.rotation.z += z;
            });
        }
    }
}
