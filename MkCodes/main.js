import './style.css'

import * as three from 'three';


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

const geometry1 = new three.TorusGeometry(10, 3, 16, 100);
const material1 = new three.MeshBasicMaterial({color: 0xFFAB45, wireframe: true});
const object1 = new three.Mesh(geometry1, material1);

scene.add(object1);

let lastFps = 0;
let frames = 0;
let start = Date.now();
object1.rotation.x = Math.PI;

function scroll2(){
  object1.rotation.y = window.scrollY/100;
  camera.position.z = window.scrollY/10 + 50
}

window.addEventListener('scroll', scroll2, false); 
scroll2();

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
animate();