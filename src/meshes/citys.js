import dataMap from "../dataMap";
import {
    latLongToVector3
} from "../util"
import * as THREE from "three";

import consts from "../consts";

console.log("datamap",dataMap);
//创建城市group
export default  function createCitys(font){
	var globeCitys = new THREE.Group();//city的总group
    var globeCityNames = new THREE.Group();//name group
    let globeCityVertices = [];
    let position;
    let globeCityBufferGeometry = new THREE.BufferGeometry();
    console.log("in");
    console.log("datamap.legnth",dataMap.length);
    console.log("datamap",dataMap);
	  for ( i = 0; i < dataMap.length-1; i ++ ) {
        console.log("in");
	  	var lat = dataMap[i][2] ,
            lng = dataMap[i][3];
        //  console.log("lat",lat);
        // console.log("lng",lng);
        position = latLongToVector3(lat,lng,consts.globeRadius, 0.3);
        globeCityVertices.push(position);

        //调用文字创建
        let textObj = createText(font,dataMap[i][4] ,position);
        globeCityNames.add(textObj);
	  }
	var positions = new Float32Array(globeCityVertices.length * 3);
    for (var i = 0; i < globeCityVertices.length; i++) {
        positions[i * 3] = globeCityVertices[i].x;
        positions[i * 3 + 1] = globeCityVertices[i].y;
        positions[i * 3 + 2] = globeCityVertices[i].z;
    }
    globeCityBufferGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    // COLOR CHECKERED
    let globeCityMaterial = new THREE.PointsMaterial({
        size: 0.75,
        fog: true,
        vertexColors: THREE.VertexColors,
       depthWrite: false,
       depthTest: false,
        transparent: false,
        opacity: 1,
        color:0xffff00,
        blending: THREE.NoBlending,
        side: THREE.FrontSide,
        fog: false,
        // depthWrite: false,
        // depthTest: false,
      //  renderOrder:3,
    });

var colors = new Float32Array(globeCityVertices.length*3);
var globeCityColors = [];
//可以通过改变颜色或者大小来改变显示效果
 for (var i = 0; i < globeCityVertices.length; i++) {
        //var tempPercentage = generateRandomNumber(80, 90)*0.92 ;//0 位primary 100位 colorDaraken
       // var shadedColor = colorMix(tempPercentage, consts.colorPri);//修改过
       // var shadedColor =  "#000000";
        globeCityColors[i] = new THREE.Color(0xfffff00);
    }
  for (var i = 0; i < globeCityVertices.length; i++) {
   	colors[i * 3] = globeCityColors[i].r;
    colors[i * 3 + 1] = globeCityColors[i].g;
    colors[i * 3 + 2] = globeCityColors[i].b;
    }
    globeCityBufferGeometry.addAttribute('color',new THREE.BufferAttribute(colors,3))
    globeCityBufferGeometry.colorsNeedUpdate = true;

    let globeCityLight = new THREE.Points(globeCityBufferGeometry,globeCityMaterial);
    globeCityLight.sortParticles = true;
    globeCityLight.name = 'globeCityLight';
    globeCitys.add(globeCityLight);
    globeCitys.add(globeCityNames);
    return globeCitys;
}

/*稍后可与rocket的创建字体合并*/
// 创建文字  字体， 城市名
function createText(font,cName,position) {
	var textObj;
    var text = new THREE.FontLoader().load(font.src, function(text) {
        console.log(font.src);
        var gem = new THREE.TextGeometry(cName, {
            size: 10, //字号大小，一般为大写字母的高度
            height: 0, //文字的厚度
            weight: 'normal', //值为'normal'或'bold'，表示是否加粗
            font: text, //字体，默认是'helvetiker'，需对应引用的字体文件
            style: 'normal', //值为'normal'或'italics'，表示是否斜体
            bevelThickness: 1, //倒角厚度
            bevelSize: 1, //倒角宽度
            curveSegments: 30,//弧线分段数，使得文字的曲线更加光滑
            bevelEnabled: true, //布尔值，是否使用倒角，意为在边缘处斜切
        });
        gem.center();
        var mat = new THREE.MeshPhongMaterial( { color:0xffffff,
            shininess:30,
           // specular: 0x101010,
            reflectivity:0,
        //    refractionRation:1 ,
           blending: THREE.NoBlending,
           transparent:false,
          depthWrite: false,
          depthTest: false,
        } );
         textObj = new THREE.Mesh(gem, mat);
        textObj.castShadow = true;
        textObj.position.set(position.x,position.y,position.z);
        textObj.name = cName;
        console.log(textObj);
        // rocketGroup.add(textObj);
     //   textObj.rotation.z = Math.PI*1/2;
    });//不懂为什么要用回调函数
    return textObj;

}