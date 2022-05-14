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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 5, Math.max(2*global.constrainingDimension, 1000));
const scene1ToDim = [];
const scene1ToRotate = [];
const scene5ToRotate = [];
const scene5ToMove = [];


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

let mkText;
let mynameObject;
let titleObject;
let spaceship;
let sceneNum = 0;
function onScroll(endScene = false){
  console.log("onscroll: " + window.scrollY + ":" + endScene);
  if(window.scrollY < 1200){
    sceneNum=1;
    scrollScene1();
  }else{
    if(sceneNum == 1 || endScene === true){
      endScene1();
    }
    if(window.scrollY < 1800){
      //empty
      sceneNum = 2;
      scrollScene2();
    }else if(window.scrollY < 2978){
      
      sceneNum = 3;
      scrollScene3();
    }else if(window.scrollY < 3763){
      if(sceneNum == 3 || endScene === true){
        endScene3();
      }
      sceneNum = 4;
      console.log("scrollY: " + window.scrollY);
      scrollScene4();
    }else{
      console.log("endscene: " + (endScene === true))
      if(sceneNum == 4 || endScene === true){
        endScene4();
      }
      sceneNum = 5;
      scrollScene5();
    }
  }

  if(window.scrollY > 10 && window.scrollY < 300){
    document.querySelector("#down-arrow").classList.add("hide-arrow");
    document.querySelector("#navbar").classList.add("hide-navbar");
  }else if(window.scrollY > 300){
    document.querySelector("#down-arrow").classList.remove("shown");
  }else{
    document.querySelector("#down-arrow").classList.add("shown");
    document.querySelector("#down-arrow").classList.remove("hide-arrow");
    document.querySelector("#navbar").classList.remove("hide-navbar");
  }

}

function scrollScene1(){
  const rotationY = window.scrollY/100;
  scene1ToRotate.forEach((item) => {
    item.rotation.y = rotationY;
  });
  const opacity = Math.min(1,1-((window.scrollY-500)/700));
  scene1ToDim.forEach((material) => {
    material.opacity = opacity;
  });
  camera.position.z = window.scrollY/10 + 50
  camera.position.x = 0;
  camera.rotation.y = 0;
}

function endScene1(){
  clearScene1Objects();
  camera.position.z = 230;
}

function clearScene1Objects(){
  scene1ToDim.forEach((material) => {
    material.opacity = 0;
  });
}

function scrollScene2(){
  camera.position.z = window.scrollY/10 + 50
  camera.position.x = 0;
  camera.rotation.y = 0;
  camera.rotation.x = 0;
  camera.rotation.z = 0;
  //console.log('2:' + camera.rotation.x + "::" +camera.rotation.y + "::" + camera.rotation.z);
}

function scrollScene3(){
  //parametric form of circle
  const t = (window.scrollY-1800)/750;
  camera.position.x = global.xdistance*Math.sin(t);
  camera.position.z = 70 + 160*Math.cos(t);

  //also rotate camera
  camera.rotation.y = Math.atan(camera.position.x/(camera.position.z-70));
  camera.rotation.x = 0;
  camera.rotation.z = 0;

  console.log('3:' + camera.rotation.x + "::" +camera.rotation.y + "::" + camera.rotation.z);
}

function endScene3(){
  camera.position.x = global.xdistance;
  camera.position.z = 70;
  camera.rotation.y = Math.PI/2;
  camera.rotation.x = -Math.PI/2;
  camera.rotation.z = Math.PI/2;
  console.log('3(end):' + camera.rotation.x + "::" +camera.rotation.y + "::" + camera.rotation.z);
}

function scrollScene4(){
  console.log('4:' + camera.rotation.x + "::" +camera.rotation.y + "::" + camera.rotation.z);
  //camera.rotateX(-1/50);
  camera.rotation.y = (Math.PI/2)-(window.scrollY-2978)/500;
  camera.position.y = 0;
  console.log(camera.rotation.y);
  console.log(camera.position.x + "::" + camera.position.y + "::" + camera.position.z);
}

function endScene4(){
  camera.position.x = global.xdistance;
  camera.position.z = 70;
  camera.rotation.x = -Math.PI/2;
  camera.rotation.z = Math.PI/2;
  camera.rotation.y = 0;
  console.log('4(end):' + camera.rotation.x + "::" +camera.rotation.y + "::" + camera.rotation.z);
}

function scrollScene5(){
  console.log('5:' + camera.rotation.x + "::" +camera.rotation.y + "::" + camera.rotation.z);
  //camera.rotateX(-1/50);
  // camera.rotation.y = (Math.PI/2)-(window.scrollY-2978)/500;
  // console.log(camera.rotation.y);
  camera.position.y = -(window.scrollY-3763)*global.xdistance*0.00015;
  camera.rotation.z = Math.PI/2 - (window.scrollY-3763)*0.00024;
  // camera.position.z = 70 + (window.scrollY-3763)*0.000019*global.xdistance;
  // camera.position.x = global.xdistance + (window.scrollY-3763)*global.xdistance*0.0000016;
  //camera.rotation.y = 0;
  console.log(camera.position.x + "::" + camera.position.y + "::" + camera.position.z);
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


const rotatingObjectMaterial = new THREE.MeshStandardMaterial({color: 0xF1F1F1});
function generateRotatingObjects(number){

  const geometries = [new THREE.IcosahedronBufferGeometry(2), new THREE.IcosahedronBufferGeometry(1.25), new THREE.IcosahedronBufferGeometry(1.5), new THREE.IcosahedronBufferGeometry(1.75)];
  let mesh, x, y;
  let objects = [];
  [...Array(number)].forEach(() => {
    mesh = new THREE.Mesh(_.sample(geometries), rotatingObjectMaterial);
    [x, y] = constrainOutOfBox(THREE.MathUtils.randFloatSpread(global.vw/1.5), THREE.MathUtils.randFloatSpread(global.vh/1.5), 30, 23)
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
    curveSegments: 2,
  });
  geometry.center();
  return geometry;
}


let isocahedrons;
function ready(){
  console.log("ready");
  const textMaterial = new THREE.MeshBasicMaterial({color: 0xFFAB45, wireframe: true});
  scene1ToDim.push(textMaterial);
  scene1ToDim.push(rotatingObjectMaterial);
  mkText = generate3DText('MK', 10, textMaterial);
  mynameObject = generate3DText('Matthew Kwiatkowski', 1.33, textMaterial);
  titleObject = generate3DText('Software Developer', 3, textMaterial);
  const density = Math.round(global.constrainingDimension**2/200);
  generateBinaryFloatingText(density, 70, Math.max(20, window.innerWidth/80));

  mkText.position.y = 8.5;
  mynameObject.position.y = -3.5;
  titleObject.position.y = 0;
  textMaterial.transparent = true;
  rotatingObjectMaterial.transparent = true;

  scene.add(mkText, titleObject, mynameObject);
  scene1ToRotate.push(mkText, titleObject, mynameObject);

  const planet1Material = new THREE.MeshBasicMaterial({color: 0x29ff34, wireframe: true});
  const planet1 =  new THREE.Mesh(new THREE.SphereGeometry( 20 ), planet1Material);
  planet1.position.x = global.xdistance*0.95;
  planet1.rotation.z = Math.PI/2;
  planet1.rotation.y = Math.PI/4;
  //testObject123.rotateOnAxis(new THREE.Vector3(-1, 0, 1), Math.PI/2);
  planet1.position.y = -100;
  planet1.position.z = 90;

  const moon1Material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
  const moon1 =  new THREE.Mesh(new THREE.SphereGeometry( 5 ), moon1Material);
  moon1.rotation.z = Math.PI/2;
  moon1.rotation.y = Math.PI/4;
  //testObject123.rotateOnAxis(new THREE.Vector3(-1, 0, 1), Math.PI/2);
  moon1.position.x = global.xdistance*0.95;
  moon1.position.y = -100;
  moon1.position.z = 90;

  scene5ToMove.push(
    (t) => {
      moon1.position.x = global.xdistance*0.95 + 55*Math.sin(t*0.006 + Math.PI/2);
      moon1.position.y = -100 + 55*Math.cos(t*0.006);
      moon1.position.z = 90 + 35*Math.sin(t*0.006);
    },
  );
  scene5ToRotate.push([moon1, 0.007, new THREE.Vector3(0, 1, 0)]);

  const planet2Material = new THREE.MeshBasicMaterial({color: 0xfffb26, wireframe: true});
  const planet2 =  new THREE.Mesh(new THREE.SphereGeometry( 70 ), planet2Material);

  planet2.rotation.z = Math.PI/2.5;
  planet2.rotation.y = -Math.PI/5;
  //testObject123.rotateOnAxis(new THREE.Vector3(-1, 0, 1), Math.PI/2);
  planet2.position.x = global.xdistance*1.15;
  planet2.position.y = -300;
  planet2.position.z = 40;

  const planet2ring = new THREE.Mesh(new THREE.RingGeometry(73, 100, 100, 10), planet2Material);
  planet2ring.position.x = global.xdistance*1.12;
  planet2ring.position.y = -250;
  planet2ring.position.z = 40;
  planet2ring.rotation.z = -Math.PI/2.5;
  planet2ring.rotation.y = Math.PI/3.5;
  planet2ring.rotation.x = Math.PI/32;

  const planet3Material = new THREE.MeshBasicMaterial({color: 0xff1212, wireframe: true});
  const planet3 =  new THREE.Mesh(new THREE.SphereGeometry( 20 ), planet3Material);

  planet3.rotation.z = Math.PI/2.5;
  planet3.rotation.y = -Math.PI/5;
  //testObject123.rotateOnAxis(new THREE.Vector3(-1, 0, 1), Math.PI/2);
  planet3.position.x = global.xdistance*0.95;
  planet3.position.y = -800;
  planet3.position.z = 40;

  const planet4Material = new THREE.MeshBasicMaterial({color: 0xfab223, wireframe: true});
  const planet4 =  new THREE.Mesh(new THREE.SphereGeometry( 20 ), planet4Material);
  planet4.rotation.z = Math.PI/2.5;
  planet4.rotation.y = -Math.PI/5;
  //testObject123.rotateOnAxis(new THREE.Vector3(-1, 0, 1), Math.PI/2);
  planet4.position.x = global.xdistance*0.85;
  planet4.position.y = -590;
  planet4.position.z = 500;

  const planet5Material = new THREE.MeshBasicMaterial({color: 0x9f55a3, wireframe: true});
  const planet5 =  new THREE.Mesh(new THREE.SphereGeometry( 25 ), planet5Material);
  planet5.rotation.z = Math.PI/2.5;
  planet5.rotation.y = -Math.PI/5;
  //testObject123.rotateOnAxis(new THREE.Vector3(-1, 0, 1), Math.PI/2);
  planet5.position.x = global.xdistance*0.85;
  planet5.position.y = -550;
  planet5.position.z = 220;

  const moon2Material = new THREE.MeshBasicMaterial({color: 0x449bb3, wireframe: true});
  const moon2 =  new THREE.Mesh(new THREE.SphereGeometry( 5 ), moon2Material);
  moon2.rotation.z = Math.PI/2;
  moon2.rotation.y = Math.PI/4;
  //testObject123.rotateOnAxis(new THREE.Vector3(-1, 0, 1), Math.PI/2);
  moon2.position.x = global.xdistance*0.85;
  moon2.position.y = -550;
  moon2.position.z = 220;

  //scene5ToRotate.push([moon1, 0.007, new THREE.Vector3(0, 1, 0)]);

  scene5ToMove.push(
    (t) => {
      planet4.position.y = -590 + 150*Math.sin(t*0.01);
      planet4.position.z = 500+ 300*Math.cos(t*0.01+Math.PI/1.3);

      planet5.position.y = -550 + 30*Math.cos(t*0.01);
      planet5.position.z = 220 + 160*Math.sin(t*0.01);

      moon2.position.x = planet5.position.x + 25*Math.sin(t*0.016 + Math.PI/2);
      moon2.position.y = planet5.position.y + 35*Math.cos(t*0.018);
      moon2.position.z = planet5.position.z + 35*Math.sin(t*0.016);

    },
  );
  
  scene.add(planet1,moon1,planet2, planet2ring, planet3, planet4,  planet5, moon2);
  scene5ToRotate.push([planet1, 0.005, new THREE.Vector3(0, -1, 0)],
  [planet2, 0.001, new THREE.Vector3(0, 1, 0)],
  [planet3, 0.01, new THREE.Vector3(0, 1, 0)], 
  [planet4, 0.02, new THREE.Vector3(0, 1, 0)], 
  [planet5, 0.005, new THREE.Vector3(0, 1, 0)], 
  [planet2ring, 0.001, new THREE.Vector3(0, 0, 1)]);




  isocahedrons = generateRotatingObjects(Math.max(Math.round(density/15), 30));

  const lightSource1 = new THREE.PointLight(0xffffff);
  lightSource1.position.set(0, 0, 20);
  scene.add(lightSource1);
  
  let lastFps = 0;
  let frames = 0;
  let start = Date.now();
  
  window.addEventListener('scroll', onScroll, false); 
  onScroll(true);
  if(sceneNum > 2){
    clearScene1Objects();
  }

  animate();
}
let framez = 0;
let scene5Framez = 0;
function animate(){
  framez+=1;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  //object1.rotation.z += 2;
  if(sceneNum == 1){
    if(isocahedrons){
      let x, y, z;
      isocahedrons.forEach(({mesh, rotate}) => {
        [x, y, z] = rotate;
        mesh.rotation.x += x;
        mesh.rotation.y += y;
        mesh.rotation.z += z;
      });
    }  
  }else if(sceneNum == 3 || sceneNum == 4){
    if(spaceship){
      spaceship.rotation.y += 0.01;
    }

    // scene5ToRotate.forEach((item) => {
    //   item.rotation.x += 0.005;
    // });
    scene5ToRotate.forEach(([item, speed, rotationalAxis]) => {
      item.rotateOnAxis(rotationalAxis, speed);
    });
    scene5ToMove.forEach((item) => {
      item(scene5Framez);
    });
    scene5Framez+=1;
  }else if(sceneNum == 5){
    scene5ToRotate.forEach(([item, speed, rotationalAxis]) => {
      item.rotateOnAxis(rotationalAxis, speed);
    });
    scene5Framez+=1;
    scene5ToMove.forEach((item) => {
      item(scene5Framez);
    });
  }
  // if(framez == 20){
  //   // const secs = (Date.now()-start)/1000;
  //   // lastFps = 20/secs;
  //   framez = 0;
  //   // document.getElementById("header").innerText = Math.round(lastFps*100)/100;
  //   // start = Date.now();
  // }
}

setup();
load();