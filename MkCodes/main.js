import './style.css'

import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import _ from 'lodash';

const vw = window.innerWidth/5;
const vh = window.innerHeight/5;
console.log(vw + ":::" +vh);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 5, 1.5*vw);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#mainc'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);

renderer.render(scene, camera);

const loader = new FontLoader();
let font;
loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json', (loaded_font) => {
  font = loaded_font;
  console.log("ready player 1");
  ready();
});

let object1;
let object2;

function onScroll(){

  if(window.scrollY < 1200){
    object1.rotation.y = window.scrollY/100;
    object2.rotation.y = window.scrollY/100;
    const opacity = Math.min(1,1-((window.scrollY-500)/700));
    object2.material.opacity = opacity;
    object1.material.opacity = opacity;
    camera.position.z = window.scrollY/10 + 50
    camera.position.x = 0;
    camera.rotation.y = 0;
  }else{
    //object2.material.opacity = 0;
    object1.material.opacity = 0;
    object2.material.opacity = 0;
    if(window.scrollY < 1800){
      //empty
      camera.position.z = window.scrollY/10 + 50
      camera.position.x = 0;
      camera.rotation.y = 0;
    }else if(window.scrollY < 2586){
      //parametric form of circle
      const t = (window.scrollY-1800)/500;
      camera.position.x = 2.125*vw*Math.sin(t);
      camera.position.z = 80 + 150*Math.cos(t);
      console.log(camera.position.x + ":" + camera.position.z);
      //also rotate camera
      camera.rotation.y = Math.atan(camera.position.x/camera.position.z);
      console.log(camera.rotation.y);
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

function generateBinaryFloatingText(number, zoffset, zspread){
  const materials = [new THREE.MeshBasicMaterial({color: 0x2A8542}), new THREE.MeshBasicMaterial({color: 0xBBBBBB})];
  const geometries = [get3DTextGeometry('1', 6, 0), get3DTextGeometry('0', 6, 0)];
  const xspread = vw * 0.95;
  const yspread = vh * 0.95;
  console.log(xspread + ":" + yspread);
  let mesh;
  [...Array(number)].forEach(() => {
    mesh = new THREE.Mesh(_.sample(geometries), _.sample(materials));
    mesh.position.set(THREE.MathUtils.randFloatSpread(xspread), THREE.MathUtils.randFloatSpread(yspread), zoffset + THREE.MathUtils.randFloatSpread(zspread));
    scene.add(mesh);
  });
}


function generate3DText(text, size, material){
  return new THREE.Mesh(get3DTextGeometry(text, size), material);
}

function get3DTextGeometry(text, size, width){
  if (width === undefined) width = Math.min(3, Math.round(size/2));
  const geometry = new TextGeometry(text, {
    font: font,
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

function ready(){
  console.log("ready");
  const textMaterial = new THREE.MeshBasicMaterial({color: 0xFFAB45, wireframe: true});
  object1 = generate3DText('MK', 10, textMaterial);
  object2 = generate3DText('Software Developer', 3, textMaterial);

  generateBinaryFloatingText(Math.round(vw*vh/200), 70, 20);

  object1.position.y = 9;
  object1.material.transparent = true;
  object2.material.transparent = true;

  scene.add(object1);
  scene.add(object2);
  
  let lastFps = 0;
  let frames = 0;
  let start = Date.now();
  
  window.addEventListener('scroll', onScroll, false); 
  onScroll();

  animate();
}

function animate(){
  frames+=1;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  //object1.rotation.z += 2;

  if(frames == 20){
    const secs = (Date.now()-start)/1000;
    lastFps = 20/secs;
    frames = 0;
    document.getElementById("header").innerText = Math.round(lastFps*100)/100;
    start = Date.now();
  }
}