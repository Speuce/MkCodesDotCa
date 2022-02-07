import './style.css'

import * as three from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';


console.log('test');

const scene = new three.Scene();
const camera = new three.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);

const renderer = new three.WebGLRenderer({
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
function scroll2(){
  object1.rotation.y = window.scrollY/100;
  object2.rotation.y = window.scrollY/100;
  console.log(window.scrollY);
  camera.position.z = window.scrollY/10 + 50
  if(window.scrollY > 10 && window.scrollY < 300){
    document.querySelector("#down-arrow").classList.add("hide-arrow");
  }else if(window.scrollY > 300){
    document.querySelector("#down-arrow").classList.remove("shown");
  }else{
    document.querySelector("#down-arrow").classList.add("shown");
    document.querySelector("#down-arrow").classList.remove("hide-arrow");
  }
}


function generate3DText(text, size, material){
  const geometry = new TextGeometry(text, {
    font: font,
    size: size,
    height: Math.min(3, Math.round(size/2)),
    curveSegments: size,
    bevelThickness: 10,
    bevelSize: Math.round(size*0.8),
    bevelOffset: 0,
    bevelSegments: 5,
  });
  geometry.center();
  return new three.Mesh(geometry, material);
}

function ready(){
  console.log("ready");
  const textMaterial = new three.MeshBasicMaterial({color: 0xFFAB45, wireframe: true});
  object1 = generate3DText('MK', 10, textMaterial);
  object2 = generate3DText('Software Developer', 3, textMaterial);

  object1.position.y = 9;

  scene.add(object1);
  scene.add(object2);
  
  let lastFps = 0;
  let frames = 0;
  let start = Date.now();
  
  window.addEventListener('scroll', scroll2, false); 
  scroll2();

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