import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. シーン（舞台）を作る
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee); // 背景を薄いグレーに

// 2. カメラを作る（画角, アスペクト比, 描画開始距離, 描画終了距離）
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // カメラを少し後ろに引く

// 3. レンダラー（現像機）を作る
const renderer = new THREE.WebGLRenderer({ 
    antialias: false, // ギザギザ防止をオフにすると少し軽くなる
    powerPreference: "high-performance" // GPUを本気で使わせる
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // HTMLにキャンバスを追加
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 慣性を利かせて滑らかにする
// 4. ライト（照明）を置く（これがないとモデルが真っ黒！）
// 正面からの光
const topLight = new THREE.DirectionalLight(0xffffff, 4);
topLight.position.set(5, 5, 5);
scene.add(topLight);

// 横からの青っぽい補助光（エッジが立ってカッコよくなる）
const sideLight = new THREE.PointLight(0x00ffff, 2);
sideLight.position.set(-5, 2, 0);
scene.add(sideLight);

// 下からの反射光
const backLight = new THREE.PointLight(0xff00ff, 0.8);
backLight.position.set(0, -5, -2);
scene.add(backLight);

// 5. STLモデルを読み込む
let myModel;
const loader = new GLTFLoader(); // GLTFLoaderに変更

// 'models/your-model.stl' の部分は、自分のファイル名に書き換えてね！
loader.load('./models/guitarforschool.glb', function (gltf) {
    
    // GLBの場合は、gltf.scene の中にモデル（メッシュ）がすでに入っています
    const model = gltf.scene;

    // サイズや向きの調整（GLBはBlenderの見た目通りに出やすいです）
    model.scale.set(1, 1, 1); 
    model.position.set(0, -1, 0);
    
    scene.add(model);

    // 全体の変数に代入して、下の animate() で回せるようにする
    myModel = model;

    // Anime.js の演出もそのまま使えます！
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

// パラパラ漫画のループ
function animate() {
    requestAnimationFrame(animate);
    
    // ★読み込みが終わっていたら、少しずつ回し続ける
    if (myModel) {
        myModel.rotation.y += 0.01; 
    }
    controls.update(); // これが必要！
    
    renderer.render(scene, camera);
}
animate();