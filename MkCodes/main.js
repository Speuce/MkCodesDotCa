import './style.css'

import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import _ from 'lodash';
import { global } from './global.js';
import { Vector3 } from 'three';

global.vw = window.innerWidth/4.3;
global.vh = window.innerHeight/4.3;
global.constrainingDimension = Math.max(global.vw, global.vh);
global.xdistance = 1.6*global.constrainingDimension;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 5, Math.max(2*global.constrainingDimension, 100));

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#mainc'),
});

function setup(){
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(50);
  renderer.render(scene, camera);
}

function load(){
  const loader = new FontLoader();
  loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json', (loaded_font) => {
    global.font = loaded_font;
    console.log("ready player 1");
    ready();
  });

  const loader2 = new FBXLoader();
  const shipMaterial = new THREE.MeshBasicMaterial({color: 0xFFAB45, wireframe: true});
  loader2.load("./models/ROCKET.fbx", model => {
      model.traverse((child) => {
        if(child.isMesh){
          child.material = shipMaterial;
        }
      });
      const scale = global.constrainingDimension/60;
      model.scale.x = scale;
      model.scale.z = scale;
      model.scale.y = scale;
      model.position.z = 70;
      model.position.y = global.constrainingDimension*0.13;
      model.position.x = global.xdistance*0.8;
      spaceship = model;
      scene.add(model);
      console.log("--- loaded ----");
  });
}

let object1;
let object2;
let spaceship;
let sceneNum = 0;
function onScroll(){

  if(window.scrollY < 1200){
    sceneNum=1;
    scrollScene1();
  }else{
    if(sceneNum == 1){
      endScene1();
    }
    //object2.material.opacity = 0;
    if(window.scrollY < 1800){
      //empty
      sceneNum = 2;
      scrollScene2();
    }else if(window.scrollY < 2978){
      //parametric form of circle
      sceneNum = 3;
      scrollScene3();
    }else{
      if(sceneNum == 3){
        endScene3();
      }
      sceneNum = 4;
      scrollScene4();
    }
  }
  console.log(window.scrollY);
  if(window.scrollY > 10 && window.scrollY < 300){
    document.querySelector("#down-arrow").classList.add("hide-arrow");
  }else if(window.scrollY > 300){
    document.querySelector("#down-arrow").classList.remove("shown");
  }else{
    document.querySelector("#down-arrow").classList.add("shown");
    document.querySelector("#down-arrow").classList.remove("hide-arrow");
  }
}

function scrollScene1(){
  object1.rotation.y = window.scrollY/100;
  object2.rotation.y = window.scrollY/100;
  const opacity = Math.min(1,1-((window.scrollY-500)/700));
  object2.material.opacity = opacity;
  object1.material.opacity = opacity;
  camera.position.z = window.scrollY/10 + 50
  camera.position.x = 0;
  camera.rotation.y = 0;
}

function endScene1(){
  object1.material.opacity = 0;
  object2.material.opacity = 0;
  camera.position.z = 230;
}

function scrollScene2(){
  camera.position.z = window.scrollY/10 + 50
  camera.position.x = 0;
  camera.rotation.y = 0;
}

function scrollScene3(){
  const t = (window.scrollY-1800)/750;
  camera.position.x = global.xdistance*Math.sin(t);
  camera.position.z = 70 + 160*Math.cos(t);

  //also rotate camera
  camera.rotation.y = Math.atan(camera.position.x/(camera.position.z-70));

  console.log(camera.position.x + ":" + camera.position.z + ":" + camera.rotation.y);
  console.log(camera.rotation.y);
}

function endScene3(){
  camera.position.x = global.xdistance;
  camera.position.z = 70;
  camera.rotation.y = Math.PI/2;
  camera.rotation.x = -Math.PI/2;
  camera.rotation.z = Math.PI/2;
  console.log('3:' + camera.rotation.x + "::" +camera.rotation.y + "::" + camera.rotation.z);
}

function scrollScene4(){
  console.log('4:' + camera.rotation.x + "::" +camera.rotation.y + "::" + camera.rotation.z);
  //camera.rotateX(-1/50);
  camera.rotation.y = (Math.PI/2)-(window.scrollY-2978)/500;
}

function generateBinaryFloatingText(number, zoffset, zspread){
  const materials = [new THREE.MeshBasicMaterial({color: 0x2A8542}), new THREE.MeshBasicMaterial({color: 0xBBBBBB})];
  const geometries = [get3DTextGeometry('1', 6, 0.7), get3DTextGeometry('0', 6, 0.7)];
  const spread = global.constrainingDimension;
  const rotationSpread = 0.01;
  let mesh;
  [...Array(number)].forEach(() => {
    mesh = new THREE.Mesh(_.sample(geometries), _.sample(materials));
    mesh.position.set(THREE.MathUtils.randFloatSpread(spread), THREE.MathUtils.randFloatSpread(spread), zoffset + THREE.MathUtils.randFloatSpread(zspread));
    scene.add(mesh);
  });
}

function generateRotatingObjects(number){
  const material = new THREE.MeshStandardMaterial({color: 0xF1F1F1});
  const geometries = [new THREE.IcosahedronBufferGeometry(2), new THREE.IcosahedronBufferGeometry(1.25), new THREE.IcosahedronBufferGeometry(1.5), new THREE.IcosahedronBufferGeometry(1.75)];
  let mesh, x, y;
  let objects = [];
  [...Array(number)].forEach(() => {
    mesh = new THREE.Mesh(_.sample(geometries), material);
    [x, y] = constrainOutOfBox(THREE.MathUtils.randFloatSpread(global.vw/2), THREE.MathUtils.randFloatSpread(global.vh/2), 30, 23)
    if(!objects.some(({mesh, rotate}) => isWithinDistance(mesh.position.x, x, mesh.position.y, y, 5))){
      mesh.position.set(x, y,-15 + THREE.MathUtils.randFloatSpread(5));
      scene.add(mesh);
      objects.push({mesh, rotate: [THREE.MathUtils.randFloatSpread(0.03), THREE.MathUtils.randFloatSpread(0.03), THREE.MathUtils.randFloatSpread(0.03)]});
    }
  });
  return objects;
}

function isWithinDistance(x1, x2, y1, y2, distance){
  let squaredDistance2 = Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2);
  return squaredDistance2 < Math.pow(distance,2);
}

/**
 * Draws a box ±rangeX, ±rangeY.
 * If the valueX/Y is within the box, returns a point outside the box.
 */
function constrainOutOfBox(valueX, valueY, rangeX, rangeY){
  const withinXBounds = (Math.abs(valueX) < rangeX);
  const withinYBounds = (Math.abs(valueY) < rangeY);
  if(withinXBounds && withinYBounds){
    if((rangeX - Math.abs(valueX)) < (rangeY - Math.abs(valueY))){
      return [Math.sign(valueX)*rangeX, valueY];
    }else{
      return [valueX, Math.sign(valueY)*rangeY];
    }
  }
  return [valueX, valueY];
}


function generate3DText(text, size, material){
  return new THREE.Mesh(get3DTextGeometry(text, size), material);
}

function get3DTextGeometry(text, size, width){
  if (width === undefined) width = Math.min(3, Math.round(size/2));
  const geometry = new TextGeometry(text, {
    font: global.font,
    size: size,
    height: width,
    curveSegments: size,
    bevelThickness: 10,
    bevelSize: Math.round(size*0.8),
    bevelOffset: 0,
    bevelSegments: 5,
  });
  geometry.center();
  return geometry;
}


let isocahedrons;
function ready(){
  console.log("ready");
  const textMaterial = new THREE.MeshBasicMaterial({color: 0xFFAB45, wireframe: true});
  object1 = generate3DText('MK', 10, textMaterial);
  object2 = generate3DText('Software Developer', 3, textMaterial);
  const density = Math.round(global.constrainingDimension**2/200);
  generateBinaryFloatingText(density, 70, Math.max(20, window.innerWidth/80));

  object1.position.y = 9;
  object1.material.transparent = true;
  object2.material.transparent = true;

  scene.add(object1);
  scene.add(object2);

  isocahedrons = generateRotatingObjects(Math.max(Math.round(density/20), 20));
  console.log(isocahedrons);

  const lightSource1 = new THREE.PointLight(0xffffff);
  lightSource1.position.set(0, 0, 20);
  scene.add(lightSource1);
  
  let lastFps = 0;
  let frames = 0;
  let start = Date.now();
  
  window.addEventListener('scroll', onScroll, false); 
  onScroll();

  animate();
}
let framez = 0;
function animate(){
  framez+=1;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  //object1.rotation.z += 2;
  if(sceneNum >= 3 && spaceship){
    spaceship.rotation.y += 0.01;
    //spaceship.rotation.z += 0.01;
  }
  if(sceneNum == 1 && isocahedrons){
    let x, y, z;
    isocahedrons.forEach(({mesh, rotate}) => {
      [x, y, z] = rotate;
      mesh.rotation.x += x;
      mesh.rotation.y += y;
      mesh.rotation.z += z;
    });
  }
  if(framez == 20){
    console.log("frame");
    // const secs = (Date.now()-start)/1000;
    // lastFps = 20/secs;
    framez = 0;
    // document.getElementById("header").innerText = Math.round(lastFps*100)/100;
    // start = Date.now();
  }
}

setup();
load();