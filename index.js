var ctx = new AudioContext();
var audio = document.querySelector("#track");
var audioSrc = ctx.createMediaElementSource(audio);
var analyser = ctx.createAnalyser();

var bgContainer = document.querySelector('.bg-container');

audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);
var fqData = new Uint8Array(analyser.frequencyBinCount);

var scene = new THREE.Scene();
scene.fog = new THREE.Fog({color: 0xCC33FF, near: 1.7, far: 1000.5});
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
// renderer.setClearColor("#52c786");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

hemiLight = new THREE.HemisphereLight(0x66dbe8, 0xcfd1d0, 4);
scene.add(hemiLight); 

var light = new THREE.PointLight(0x72dbc2, 10, 100);
light.position.set(0, 100, 0);
scene.add(light);

var spotlight = new THREE.SpotLight(0xc1e0e3, 9);
spotlight.castShadow = true;
spotlight.shadow.bias = -0.0001;
spotlight.shadow.mapSize.width = 1024*4;
spotlight.shadow.mapSize.height = 1024*4;
scene.add(spotlight);

var sphereGeometry = new THREE.SphereGeometry(10, 100, 100);
var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x215105});
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
scene.add(sphere);

camera.position.z = 40;

function render() {
    requestAnimationFrame(render);

    renderer.render(scene, camera);    

    analyser.getByteFrequencyData(fqData);

    spotlight.position.set(
        camera.position.x + 5,
        camera.position.y + 5,
        camera.position.z + 5
    );    

    for (let fq = 0; fq < 256; fq++) {
        sphere.position.z = fqData[fq] * 0.05;
        spotlight.intensity = fqData[fq] * 0.05;
        hemiLight.intensity = 4 + fqData[fq] * 0.02;
        bgContainer.style.filter = "blur(" + fqData[fq] * 0.03 + "px)";
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('mousemove', (e) => {
    bgContainer.style.transform = `translate(-${e.clientX * 0.04 - 1}px, -${e.clientY * 0.04 - 1}px)`;
});

window.addEventListener('resize', onWindowResize, false);
render();   