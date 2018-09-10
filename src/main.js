import "./css/normalize.min.css";
import "./css/layout.css";
import "./css/socialicons.css"

import * as fp from "lodash/fp"
import * as THREE from "three";
import consts from "./consts";
import {
    innerEarth,
    earthMap,
    earthBuffer,
    outerEarth,
    universe,
    createRings,
    spike,
    createRocket,

} from "./meshes"

import {
    deviceSettings,
    cacheImages,
    cacheFonts,
    colorMix,
    interpolation,
    TWEEN
} from "./util";
import TrackballControls from "./util/TrackballControls";

import State from "./util/state"

let {
    innerWidth: WIDTH,
    innerHeight: HEIGHT
} = window,
 {
    scene,
cameraMaxView,
    camera,
    cameraTarget,
    globeMaxZoom,
    globeMinZoom,
    targetCameraZ,

    renderer,


    rotationObject,
    earthObject,
    toRAD,

    mouse,
    mouse: {
        isMouseDown,
        mouseXOnMouseDown,
        mouseYOnMouseDown,
        targetRotationX,
        targetRotationY,
        targetRotationXOnMouseDown,
        targetRotationYOnMouseDown
    }

} = consts,
container = document.getElementById("interactive"), trackballControls,
    state = new State();
   // rotationObject1

init();

document.body.appendChild(state.dom);
window.addEventListener('resize', onWindowResize, false);
document.getElementById("interactive").addEventListener('mousewheel', onMouseWheel, false);
document.getElementById("interactive").addEventListener('mousedown', onMouseDown, false);
document.getElementById("interactive").addEventListener('mousemove', onMouseMove, false);
document.getElementById("interactive").addEventListener('mouseup', onMouseUp, false);
document.getElementById("interactive").addEventListener('mouseleave', onMouseLeave, false);
async function init() {
    let cacheF = cacheImages();
    let cacheF1 = cacheFonts();
    
    let imgs = await cacheF();
    
    let _initStage = fp.flow(setScene, setCamera, setRender, setLights, animate);
    
    _initStage();
    let fonts = await cacheF1();


    /*    let images = ["dot-inverted.png", "earth-glow.jpg",
        "map_inverted.png", "map.png",
        "star.jpg", "universe.jpg"
    ];*/
    let earthRotation = setEarthObject();

    

    earthRotation.add(innerEarth());
   
    earthRotation.add(earthMap (imgs[3]));
    earthRotation.add(earthBuffer(imgs[2]));

 
   

    await scene.add(universe(imgs[5]))

    await scene.add(createRocket(fonts[2]));
    //   await scene.add(createRsings());
    earthRotation.add(spike());//那个中央环
    await scene.add(earthRotation);
    //  await scene.add(outerEarth(imgs[1]))//地球外面的一些装饰和光
   console.log('ok after add');
   // await scene.add(createRocket(fonts[2]));
     earthRotation.position.set(0,0,0);
    // earthRotation.scale.x = earthRotation.scale.y =earthRotation.scale.z = 20;

    //    earthRotation.add(innerCore());
// earthRotation.position.set(0,0,0);
// earthRotation.scale.x = earthRotation.scale.y =earthRotation.scale.z =   2;


// var Core = innerCore();
// Core.position.set(0,0,0);
// Core.scale.x = Core.scale.y =Core.scale.z =  1;

// scene.add(Core);








  //  await scene.add(rocketObj(fonts[2]));



}

function setScene() {
    scene = new THREE.Scene();
   // scene.fog = new THREE.Fog(0x000000, 0, 500);
    console.log(scene)



}

function setCamera() {
    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, cameraMaxView);//这个最大可能会被超就变黑了
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = targetCameraZ;
    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;
    console.log(camera.position.z);
 //   console.log("this is ok");
//console.log('camera aspect:'+camera.aspect);
    //trackballControls = new TrackballControls(camera)
}

function setRender() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });
  //
//  renderer.sortObjects = true;

    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);


  //
//  renderer.sortObjects = true;


   // renderer1.setClearColor(0xFFFFFF, 1.0);

 //   container.appendChild(renderer1.domElement);
   //
// //第一个参数是剔除哪个面  CullFaceNone 不剔除 CullFaceBack剔除后面 CullFaceFront 前面 CullFaceFrontBack都
// //第二个指定顺时针还是逆时针  CCW是 counter-clock-wise逆时针 
}
var light;
function setLights() {
    let colorBase = new THREE.Color(new THREE.Color(consts.colorPrimary));
    let {
        lights: {
            lightShieldIntensity,
            lightShieldDistance,
            lightShieldDecay
        }
    } = consts;

    // let lightShield1 = new THREE.PointLight(colorBase,
    //     lightShieldIntensity, lightShieldDistance, lightShieldDecay);
    // lightShield1.position.x = -50;
    // lightShield1.position.y = 150;
    // lightShield1.position.z = 75;
    // lightShield1.name = 'lightShield1';
    // scene.add(lightShield1);

    // let lightShield2 = new THREE.PointLight(colorBase,
    //     lightShieldIntensity, lightShieldDistance, lightShieldDecay);
    // lightShield2.position.x = 100;
    // lightShield2.position.y = 50;
    // lightShield2.position.z = 50;
    // lightShield2.name = 'lightShield2';
    // scene.add(lightShield2);

    // let lightShield3 = new THREE.PointLight(colorBase,
    //     lightShieldIntensity, lightShieldDistance, lightShieldDecay);
    // lightShield3.position.x = 0;
    // lightShield3.position.y = -300;
    // lightShield3.position.z = 50;
    // lightShield3.name = 'lightShield3';
    // scene.add(lightShield3);

    light = new THREE.DirectionalLight(0xFFFFFF,0.71);
    light.position.set(0, 0, 1000);
    scene.add(light);
   
}


function setEarthObject() {
    rotationObject = new THREE.Group();
    rotationObject.name = 'rotationObject';
    rotationObject.rotation.x = targetRotationX;
    rotationObject.rotation.y = targetRotationY;

    // earthObject = new THREE.Group();
    // earthObject.name = 'earthObject';
    // earthObject.rotation.y = -90 * toRAD;
    // rotationObject.add(earthObject);

    return rotationObject

}

function addAxis() {
    scene.add(new THREE.AxesHelper(600))
}

function animate() {
    requestAnimationFrame(animate);
    render();

}

function render() {
 renderer.render(scene, camera);
    TWEEN.update();
   // renderer1.setFaceCulling(THREE.CullFaceBack,THREE.FrontFaceDirectionCW);//剔除正面或者反面
    //trackballControls.update();
    state.update()
    // console.log(scene.getObjectByName("rotationObject"));
    if (targetCameraZ < globeMaxZoom) targetCameraZ = globeMaxZoom;
    if (targetCameraZ > globeMinZoom) targetCameraZ = globeMinZoom;

    camera.position.z = interpolation(camera.position.z, targetCameraZ, 1);


    // if (targetRotationX > 75 * toRAD) targetRotationX = 75 * toRAD;
    // if (targetRotationX < -75 * toRAD) targetRotationX = -75 * toRAD;

    if (scene.getObjectByName("rotationObject")) {

        rotationObject.rotation.y +=0.005;

    }


    if (isMouseDown) return;
  //var globeEarthObject=  scene.getObjectByName("rotationObject")

    // //targetRotationY += 0.002
    // rotationObject.rotation.z +=0.1;
    // rotationObject.rotation.y +=0.1;
    // rotationObject.rotation.x +=0.1;


}

function onWindowResize() {
    let {
        innerWidth: width,//就是把window的innerWidth传给width变量
        innerHeight: height
    } = window
    // console.log(window.innerWidth);
    // console.log(window.innerHeight);
    // console.log(camera.aspect);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}

function onMouseWheel(event) {
    event.preventDefault();
    targetCameraZ -= event.wheelDeltaY * 0.5;
    cameraMaxView=targetCameraZ*0.93;//和targetCameraZ一致
    camera.far = cameraMaxView;//保证能看到的只有半个球
    camera.updateProjectionMatrix();//更改了camera参数必须使用这个更新
}

function onMouseDown(event) {
    event.preventDefault();
    isMouseDown = true;

    mouseXOnMouseDown = event.clientX - WIDTH / 2;
    mouseYOnMouseDown = event.clientY - HEIGHT / 2;

    targetRotationXOnMouseDown = targetRotationX;
    targetRotationYOnMouseDown = targetRotationY;
}

function onMouseMove(event) {
    if (!isMouseDown) return

    let mouseX = event.clientX - WIDTH / 2
    let mouseY = event.clientY - HEIGHT / 2;

    targetRotationX = targetRotationXOnMouseDown + (mouseY - mouseYOnMouseDown) * .0025;
    targetRotationY = targetRotationYOnMouseDown + (mouseX - mouseXOnMouseDown) * .0025;
    rotationObject.rotation.x = interpolation(rotationObject.rotation.x, targetRotationX, .1);
    rotationObject.rotation.y = interpolation(rotationObject.rotation.y, targetRotationY, .1);

}

function onMouseUp(event) {
    event.preventDefault();
    isMouseDown = false;
}

function onMouseLeave(event) {
    event.preventDefault();
    if (isMouseDown) {
        isMouseDown = false;
    }
}