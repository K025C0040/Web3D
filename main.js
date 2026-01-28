import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//シーン
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xafeeef);//背景　CSSにて
scene.background = null;

//カメラ
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

//レンダラー
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true
});

// サイズ
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//オービット設定
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


//ライト
// key
const topLight = new THREE.DirectionalLight(0xffffff, 3);
topLight.position.set(5, 5, 5);
scene.add(topLight);

// fill
const sideLight = new THREE.PointLight(0xFB377E, 3);
sideLight.position.set(5, 2, 0);
scene.add(sideLight);


//モデル読み込み
let myModel;
const loader = new GLTFLoader();

loader.load('./models/guitarforschool.glb', function (gltf) {
    
    const model = gltf.scene;

    // サイズや向きの調整
    model.scale.set(1, 1, 1); 
    model.position.set(0, -1, 0);
    
    scene.add(model);

    myModel = model;

    //アニメーション
    anime({
        targets: model.scale,
        x: 0.3,
        y: 0.3,
        z: 0.3,
        duration: 2000,
        easing: 'easeOutExpo'
    });

}, undefined, (error) => {
    console.error(error);
});

//ループ
function animate() {
    requestAnimationFrame(animate);
    
    if (myModel) {
        myModel.rotation.y += 0.01; 
    }
    controls.update();
    
    renderer.render(scene, camera);
}
animate();