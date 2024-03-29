import './style.css';
import { createBasicSphereObject, createBasicObject } from './helpers.js';

import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import _ from 'lodash';
import { global } from './global.js';
import { Vector3 } from 'three';


global.vw = window.innerWidth / 4.3;
global.vh = window.innerHeight / 4.3;
global.constrainingDimension = Math.max(global.vw, global.vh);
global.xdistance = 1.6 * global.constrainingDimension;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 5, Math.max(2 * global.constrainingDimension, 1000));
const scene1ToDim = [];
const scene1ToRotate = [];
const scene5ToRotate = [];
const scene5ToMove = [];


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#mainc'),
});

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

}

function setup() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(50);
  renderer.render(scene, camera);
  window.addEventListener('resize', onWindowResize, false);
}

function load() {
  const loader = new FontLoader();
  loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json', (loaded_font) => {
    global.font = loaded_font;
    ready();
  });

  const loader2 = new FBXLoader();
  const shipMaterial = new THREE.MeshBasicMaterial({ color: 0xFFAB45, wireframe: true });
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
    spaceship = model;
    scene.add(model);
    console.log("--- loaded ----");
  });
}

let mkText;
let mynameObject;
let titleObject;
let spaceship;
let sceneNum = 0;
function onScroll(endScene = false) {
  if (window.scrollY < 1200) {
    sceneNum = 1;
    scrollScene1();
  } else {
    if (sceneNum == 1 || endScene === true) {
      endScene1();
    }
    if (window.scrollY < 1800) {
      //empty
      sceneNum = 2;
      scrollScene2();
    } else if (window.scrollY < 2978) {

      sceneNum = 3;
      scrollScene3();
    } else if (window.scrollY < 3763) {
      if (sceneNum == 3 || endScene === true) {
        endScene3();
      }
      sceneNum = 4;
      scrollScene4();
    } else {
      if (sceneNum == 4 || endScene === true) {
        endScene4();
      }
      sceneNum = 5;
      scrollScene5();
    }
  }

  if (window.scrollY > 10 && window.scrollY < 300) {
    document.querySelector("#down-arrow").classList.add("hide-arrow");
    document.querySelector("#navbar").classList.add("hide-navbar");
  } else if (window.scrollY > 300) {
    document.querySelector("#down-arrow").classList.remove("shown");
  } else {
    document.querySelector("#down-arrow").classList.add("shown");
    document.querySelector("#down-arrow").classList.remove("hide-arrow");
    document.querySelector("#navbar").classList.remove("hide-navbar");
  }

}

function scrollScene1() {
  const rotationY = window.scrollY / 100;
  scene1ToRotate.forEach((item) => {
    item.rotation.y = rotationY;
  });
  const opacity = Math.min(1, 1 - ((window.scrollY - 500) / 700));
  scene1ToDim.forEach((material) => {
    material.opacity = opacity;
  });
  camera.position.z = window.scrollY / 10 + 50
  camera.position.x = 0;
  camera.rotation.y = 0;
}

function endScene1() {
  clearScene1Objects();
  camera.position.z = 230;
}

function clearScene1Objects() {
  scene1ToDim.forEach((material) => {
    material.opacity = 0;
  });
}

function scrollScene2() {
  camera.position.z = window.scrollY / 10 + 50
  camera.position.x = 0;
  camera.rotation.y = 0;
  camera.rotation.x = 0;
  camera.rotation.z = 0;
}

function scrollScene3() {
  //parametric form of circle
  const t = (window.scrollY - 1800) / 750;
  camera.position.x = global.xdistance * Math.sin(t);
  camera.position.z = 70 + 160 * Math.cos(t);

  //also rotate camera
  camera.rotation.y = Math.atan(camera.position.x / (camera.position.z - 70));
  camera.rotation.x = 0;
  camera.rotation.z = 0;
}

function endScene3() {
  camera.position.x = global.xdistance;
  camera.position.z = 70;
  camera.rotation.y = Math.PI / 2;
  camera.rotation.x = -Math.PI / 2;
  camera.rotation.z = Math.PI / 2;
}

function scrollScene4() {
  camera.rotation.y = (Math.PI / 2) - (window.scrollY - 2978) / 500;
  camera.position.y = 0;
}

function endScene4() {
  camera.position.x = global.xdistance;
  camera.position.z = 70;
  camera.rotation.x = -Math.PI / 2;
  camera.rotation.z = Math.PI / 2;
  camera.rotation.y = 0;
}

function scrollScene5() {
  camera.position.y = -(window.scrollY - 3763) * global.xdistance * 0.00015;
  camera.rotation.z = Math.PI / 2 - (window.scrollY - 3763) * 0.00024;
}

function generateBinaryFloatingText(number, zoffset, zspread) {
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


const rotatingObjectMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.75, metalness: 1 });
function generateRotatingObjects(number) {

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

function isWithinDistance(x1, x2, y1, y2, distance) {
  let squaredDistance2 = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
  return squaredDistance2 < Math.pow(distance, 2);
}

/**
 * Draws a box ±rangeX, ±rangeY.
 * If the valueX/Y is within the box, returns a point outside the box.
 */
function constrainOutOfBox(valueX, valueY, rangeX, rangeY) {
  const withinXBounds = (Math.abs(valueX) < rangeX);
  const withinYBounds = (Math.abs(valueY) < rangeY);
  if (withinXBounds && withinYBounds) {
    if ((rangeX - Math.abs(valueX)) < (rangeY - Math.abs(valueY))) {
      return [Math.sign(valueX) * rangeX, valueY];
    } else {
      return [valueX, Math.sign(valueY) * rangeY];
    }
  }
  return [valueX, valueY];
}


function generate3DText(text, size, material) {
  return new THREE.Mesh(get3DTextGeometry(text, size), material);
}

function get3DTextGeometry(text, size, width, bevel) {
  if (width === undefined) width = 1.5;
  if (bevel === undefined) bevel = true;
  const geometry = new TextGeometry(text, {
    font: global.font,
    size: size,
    height: width,
    curveSegments: 2,
    bevelEnabled: bevel,
    bevelThickness: 0.5,
    bevelSize: 0.3,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  geometry.center();
  return geometry;
}

/**
 * Creates the text in the scenes
 */
function createText(density) {
  const textMaterial = new THREE.MeshStandardMaterial({ color: 0xFFAB45, roughness: 0.35, metalness: 0.5 });
  scene1ToDim.push(textMaterial);
  scene1ToDim.push(rotatingObjectMaterial);

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

function createLight() {
  const lightSource1 = new THREE.SpotLight(0x9f9f9f, 2.5, 0, Math.PI / 2, 0.9);
  lightSource1.position.set(0, 7, 50);
  scene.add(lightSource1);
}
let isocahedrons;

function ready() {
  const density = Math.round(global.constrainingDimension ** 2 / 200);
  createText(density);
  isocahedrons = generateRotatingObjects(Math.max(Math.round(density / 15), 30));

  //Create Planets and Moons
  const planet1 = createBasicSphereObject(20, 0x29ff34, global.xdistance * 0.95, -100, 90, 0, Math.PI / 4, Math.PI / 2);
  const moon1 = createBasicSphereObject(5, 0xffffff, global.xdistance * 0.95, -100, 90, 0, Math.PI / 4, Math.PI / 2);
  const planet2 = createBasicSphereObject(70, 0xfffb26, global.xdistance * 1.15, -300, 40, 0, -Math.PI / 5, Math.PI / 2.5);
  const planet2ring = createBasicObject(new THREE.RingGeometry(73, 100, 100, 10)
    , 0xfffb26, global.xdistance * 1.12, -250, 40, Math.PI / 32, Math.PI / 3.5, -Math.PI / 2.5);
  const planet3 = createBasicSphereObject(20, 0xff1212, global.xdistance * 0.95, -800, 40, 0, -Math.PI / 5, Math.PI / 2.5);
  const planet4 = createBasicSphereObject(20, 0xfab223, global.xdistance * 0.85, -590, 500, 0, -Math.PI / 5, Math.PI / 2.5);
  const planet5 = createBasicSphereObject(25, 0x9f55a3, global.xdistance * 0.85, -550, 220, 0, -Math.PI / 5, Math.PI / 2.5);
  const moon2 = createBasicSphereObject(5, 0x449bb3, global.xdistance * 0.85, -550, 220, 0, Math.PI / 4, Math.PI / 4);
  scene.add(planet1, moon1, planet2, planet2ring, planet3, planet4, planet5, moon2);

  scene5ToMove.push(
    (t) => {
      moon1.position.x = global.xdistance * 0.95 + 55 * Math.sin(t * 0.006 + Math.PI / 2);
      moon1.position.y = -100 + 55 * Math.cos(t * 0.006);
      moon1.position.z = 90 + 35 * Math.sin(t * 0.006);
    },
  );
  scene5ToRotate.push([moon1, 0.007, new THREE.Vector3(0, 1, 0)]);

  scene5ToMove.push(
    (t) => {
      planet4.position.y = -590 + 150 * Math.sin(t * 0.01);
      planet4.position.z = 500 + 300 * Math.cos(t * 0.01 + Math.PI / 1.3);

      planet5.position.y = -550 + 30 * Math.cos(t * 0.01);
      planet5.position.z = 220 + 160 * Math.sin(t * 0.01);

      moon2.position.x = planet5.position.x + 25 * Math.sin(t * 0.016 + Math.PI / 2);
      moon2.position.y = planet5.position.y + 35 * Math.cos(t * 0.018);
      moon2.position.z = planet5.position.z + 35 * Math.sin(t * 0.016);

    },
  );

  scene5ToRotate.push([planet1, 0.005, new THREE.Vector3(0, -1, 0)],
    [planet2, 0.001, new THREE.Vector3(0, 1, 0)],
    [planet3, 0.01, new THREE.Vector3(0, 1, 0)],
    [planet4, 0.02, new THREE.Vector3(0, 1, 0)],
    [planet5, 0.005, new THREE.Vector3(0, 1, 0)],
    [planet2ring, 0.001, new THREE.Vector3(0, 0, 1)]);


  let lastFps = 0;
  let frames = 0;
  let start = Date.now();

  window.addEventListener('scroll', onScroll, false);
  onScroll(true);
  if (sceneNum > 2) {
    clearScene1Objects();
  }

  animate();
}
let framez = 0;
let scene5Framez = 0;
function animate() {
  framez += 1;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (sceneNum == 1) {
    if (isocahedrons) {
      let x, y, z;
      isocahedrons.forEach(({ mesh, rotate }) => {
        [x, y, z] = rotate;
        mesh.rotation.x += x;
        mesh.rotation.y += y;
        mesh.rotation.z += z;
      });
    }
  } else if (sceneNum == 3 || sceneNum == 4) {
    if (spaceship) {
      spaceship.rotation.y += 0.01;
    }
    scene5ToRotate.forEach(([item, speed, rotationalAxis]) => {
      item.rotateOnAxis(rotationalAxis, speed);
    });
    scene5ToMove.forEach((item) => {
      item(scene5Framez);
    });
    scene5Framez += 1;
  } else if (sceneNum == 5) {
    scene5ToRotate.forEach(([item, speed, rotationalAxis]) => {
      item.rotateOnAxis(rotationalAxis, speed);
    });
    scene5Framez += 1;
    scene5ToMove.forEach((item) => {
      item(scene5Framez);
    });
  }
}

setup();
load();