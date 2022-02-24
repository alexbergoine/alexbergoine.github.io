import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { MyUtils } from '../lib/utilities.js';
import * as dat from '../lib/dat.gui.module.js';

let camera, scene, renderer;
let cameraControls;
let currentMat;
let gui;
let texturesDir = './assets/';
let textureFiles = ['beach.jpg', 'baloons.jpg', 'flowers.jpg', 'baseball.png', 'dots.jpg'];
let textures;
let nbrLayers;
let cake;
let root;



function createScene() {

   textures = new Map();
    for (let file of textureFiles) {
        let texture = new THREE.TextureLoader().load(texturesDir + file);
        let textureName = file.slice(0, -4);
        textures.set(textureName, texture);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    }
    nbrLayers = controls.nbrLayers;
    currentMat = new THREE.MeshLambertMaterial({map: textures.get('flowers')});
     cake = cakeBuilder(controls.nbrLayers, controls.scale);
    let light = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light.position.set(20, 10, 40);
    let light2 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light2.position.set(-20, 10, -40);
    let ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);
    scene.add(cake); 
}

function cakeBuilder(nbrLayers,  sfactor) {

    let radius = 1.0;
    let nbrSides = 20;
    let height = .5
    let ypos = height / 2.0;
    let sf = sfactor;
     root = new THREE.Object3D();
    for (let i = 0; i < nbrLayers; i++) {
        let geom = new THREE.CylinderGeometry(radius, radius, height, nbrSides);
        
        let cyl = new THREE.Mesh(geom, currentMat);
        cyl.position.y = ypos;
        cyl.scale.set(sf, 1, sf);
        root.add(cyl);
        ypos += height;
        sf *= sfactor;
    }
    return root;
}

let controls = new function() {
    this.nbrLayers = 5;
    this.scale = 0.8;
    this.texture = 'flowers';


}

function initGui() {
    gui = new dat.GUI();
    gui.add(controls, 'nbrLayers', 1, 5).step(1).onChange(update);
   
    gui.add(controls, 'scale', 0.7, 0.9).onChange(update);
    let textureNames = textureFiles.map(file => file.slice(0, -4));
    gui.add(controls, 'texture', textureNames).onChange(updateTexture);
   
   
}
function updateTexture(textureName) {
    let texture = textures.get(textureName);
   currentMat.map = texture;
}



function update() {
   
    if (cake)
        scene.remove(cake);
    cake = cakeBuilder(controls.nbrLayers, controls.scale);
    scene.add(cake);
}

function init() {

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
    renderer.setAnimationLoop(function () {
        update();  // update animation
        cameraControls.update();
        renderer.render(scene, camera);
    });
    let canvasRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.enableDamping = true; 
    cameraControls.dampingFactor = 0.02;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

init();
createScene();
initGui();
