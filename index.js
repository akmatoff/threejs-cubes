var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x9C91FF, 5, 2550);
scene.background = new THREE.Color(0x101015);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var mouseX = 0, mouseY = 0;

hemiLight = new THREE.HemisphereLight(0x66dbe8, 0xcfd1d0, 4);
scene.add(hemiLight); 

var light = new THREE.PointLight(0x72dbc2, 10, 100);
light.position.set(0, 100, 0);
scene.add(light);

var spotlight = new THREE.SpotLight(0xc1e0e3, 22);
spotlight.castShadow = true;
spotlight.shadow.bias = -0.0001;
spotlight.shadow.mapSize.width = 1024*4;
spotlight.shadow.mapSize.height = 1024*4;
scene.add(spotlight);

var sphereGeometry = new THREE.SphereGeometry(5, 5, 5);
var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

var cubes = [];

var boxGeometry = new THREE.BoxGeometry(35, 35, 35);
var boxMaterial = new THREE.MeshLambertMaterial({color: 0xC3FEB});

var boxGroup = new THREE.Group();

for (let i = 0; i < 1000; i++) {
    var cube = new THREE.Mesh(boxGeometry, boxMaterial);

    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.position.x = Math.random() * 2000 - 1000;
    cube.position.y = Math.random() * 2000 - 1000;
    cube.position.z = Math.random() * 2000 - 1000;

    cube.rotation.x = Math.random() * Math.PI * 2;
    cube.rotation.y = Math.random() * Math.PI * 2;
    cube.add(light);

    boxGroup.add(cube);
    cubes.push(cube);
}

scene.add(boxGroup);
boxGroup.position.y = -100;
boxGroup.position.x = -100;

camera.position.z = 2500;


function render() {
    requestAnimationFrame(render);

    renderer.render(scene, camera);    

    analyser.getByteFrequencyData(fqData);

    spotlight.position.set(
        camera.position.x + 5,
        camera.position.y + 5,
        camera.position.z + 5
    );   

    camera.position.z -= (mouseY - camera.position.y) * 0.001;
    boxGroup.rotation.y += (mouseY - boxGroup.rotation.y) * 0.001 / 1000;
    boxGroup.rotation.x += (mouseX - boxGroup.rotation.x) * 0.001 / 1000;

    cubes.forEach((el) => {
        el.rotation.x += (mouseX - el.rotation.x) * 0.01 / 1000;
        el.rotation.y += (mouseY - el.rotation.y) * 0.01 / 1000;
    });
}

function onMouseMove(e) {
    mouseX = (e.clientX - windowHalfX) * 10;
    mouseY = (e.clientY - windowHalfY) * 10;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

document.addEventListener('mousemove', onMouseMove, false);

window.addEventListener('resize', onWindowResize, false);
render();   