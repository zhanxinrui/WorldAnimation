import "./css/normalize.min.css";
import "./css/layout.css";
import "./css/socialicons.css"

import * as fp from "lodash/fp"
import * as THREE from "three";
import consts from "./consts";
import  OrbitControls from "./util/OrbitControls";
import {
    innerEarth,
    earthMap,
    earthBuffer,
    createRocket,
    createCitys
} from "./meshes"

import {
    cacheImages,
    cacheFonts,
    TWEEN,
} from "./util";
import State from "./util/state"
let {
    innerWidth: WIDTH,
    innerHeight: HEIGHT
} = window,
 {
    scene,
    camera,
    targetCameraZ,
    renderer,
    rotationObject,
    globeRadius,
    mouse: {
        isMouseDown,
        mouseXOnMouseDown,
        mouseYOnMouseDown,
        targetRotationX,
        targetRotationY,
        targetRotationXOnMouseDown,
        targetRotationYOnMouseDown,
        mouseXOnWorldCS, //世界坐标系下的x,y坐标
        mouseYOnWorldCS
    },
    touch:{
        isTouchDown,
        touchXOnTouchDown,
        touchYOnTouchDown,
        targetRotationXOnTouchDown,
        targetRotationYOnTouchDown,
        touchDisOnTouchDown,
        touchDisOnTouchMove,
        touchXOnWorldCS,
        touchYOnWorldCS
    },
} = consts,
container = document.getElementById("interactive"),
state = new State(),
rocketObj,
controls,
clock = new THREE.Clock(),
delta = clock.getDelta();//获取时间差
init();

document.body.appendChild(state.dom);
window.addEventListener('resize', onWindowResize, false);

async function init() {

    let cacheF = cacheImages();
    let cacheF1 = cacheFonts();
    let imgs = await cacheF();
    let universeUrl = imgs[5];
    container.setAttribute('style', 'background: url('+universeUrl.src+')center  fixed no-repeat;  ');
    let _initStage = fp.flow(setScene, setCamera, setRender, setLights, setOrbitControl,animate);
    _initStage();
    let fonts = await cacheF1();

    let earthRotation = setEarthObject();
    earthRotation.add(innerEarth());
    earthRotation.add(earthMap (imgs[3]));//每个img都是一个dom元素，传进去通过.src获取路径
    earthRotation.add(earthBuffer(imgs[2]));

   var cityObj = createCitys(fonts[3]);
    earthRotation.add(cityObj);
    rocketObj = createRocket(fonts[2]);
    rocketObj.name = "Rocket";
    await scene.add(rocketObj);
    await scene.add(earthRotation);
   createPath();
}

function setScene() {
    scene = new THREE.Scene();
}

function setCamera() {
    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 10000);//可能是因为相机是透视的，所以不能完全遮盖住
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = targetCameraZ;

}

function setRender() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true //透明的话，画布就可以可以显示出css
    });

    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0xffffff, 0);  
    container.appendChild(renderer.domElement);
}
var light1,light2,light3,light4,light5,light6;
function setLights() {
    light1 = new THREE.DirectionalLight(0xFFFFFF,0.41);
    light2 = new THREE.DirectionalLight(0xFFFFFF,0.41);
    light3 = new THREE.DirectionalLight(0xFFFFFF,0.41);
    light4 = new THREE.DirectionalLight(0xFFFFFF,0.41);
    light5 = new THREE.DirectionalLight(0xFFFFFF,0.41);
    light6 = new THREE.DirectionalLight(0xFFFFFF,0.41);
    light1.position.set(0, 0, 1000);
    light2.position.set(0,0,-1000);
    light3.position.set(1000, 0,0);
    light4.position.set(-1000,0,0);
    light5.position.set(0, 1000,0);
    light6.position.set(0,-1000,0);
    scene.add(light1);
    scene.add(light2);
    scene.add(light3);
    scene.add(light4);
    scene.add(light5);
    scene.add(light6);
}


function setEarthObject() {
    rotationObject = new THREE.Group();
    rotationObject.name = 'rotationObject';
    return rotationObject
}



function animate() {
    requestAnimationFrame(animate);
    controls.update(delta);
    TWEEN.update();
    state.update()
    render();
}

function render() {
 renderer.render(scene, camera);
}
function setOrbitControl(){
    controls = new OrbitControls( camera, renderer.domElement );

    controls.target.set( 0,0,0);//controls的焦点
  // 使动画循环使用时阻尼或自转 意思是否有惯性 
  controls.enableDamping = false; 
  
  //动态阻尼系数 就是鼠标拖拽旋转灵敏度 
  controls.dampingFactor = 0.000000005; 
  //是否可以缩放 
  controls.enableZoom = true; 
  //是否自动旋转 
  controls.autoRotate = false; 
  controls.autoRotateSpeed = 0.1;
  //设置相机距离原点的最远距离 
  controls.minDistance = 500; 
  //设置相机距离原点的最远距离 
  controls.maxDistance = 2600; 
  //是否开启右键拖拽 
  controls.enablePan = true; 
  //最大仰视角和俯视角
  controls.minPolarAngle = 0; // radians
  controls.maxPolarAngle = Math.PI; // radians
  //是否自动旋转，自动旋转速度。默认每秒30圈
  controls.enableRotate  = true;
  controls.rotateSpeed  = 0.1; // 30 seconds per round when fps is 60
// How far you can orbit horizontally, upper and lower limits.
// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].

// Set to false to disable use of the keys
//是否能使用键盘
this.enableKeys = true;

// The four arrow keys
//默认键盘控制上下左右的键
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

// Mouse buttons
//鼠标点击按钮
	this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
//水平方向视角限制
controls.minAzimuthAngle = - Infinity; // radians
controls.maxAzimuthAngle = Infinity; // radians

}
function onWindowResize() {
    let {
        innerWidth: width,//就是把window的innerWidth传给width变量
        innerHeight: height
    } = window
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}

function createPath(){
    var px = [];
    var pz = [];
    var ry = [];
    for(let i = 0 ; i<180 ; i++){
        var theta = Math.PI/2+(2*i*Math.PI/50);
        px.push( Math.cos(theta) * (globeRadius+200));
        pz.push(Math.sin(theta)*(globeRadius+200));
        ry.push(-(2*i*Math.PI/50));
    }
var option = {
    x:rocketObj.position.x,
    z:rocketObj.position.z,
    ry:rocketObj.rotation.y
}
    var tween = new TWEEN.Tween(option).to({
        x:px,
        z:pz,
        ry:ry
}, 30000)
.onUpdate(function() {
    rocketObj.position.x = this.x;
    rocketObj.position.z = this.z;
    rocketObj.rotation.y = this.ry;
})
.delay(1000)
.repeat(Infinity)
.start();

}