var ctx = new AudioContext();
var audio = document.querySelector("#track");
var audioSrc = ctx.createMediaElementSource(audio);
var analyser = ctx.createAnalyser();

audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);
var fqData = new Uint8Array(analyser.frequencyBinCount);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#36ffBB");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(3, 3, 3);
var material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
for (let i = 0; i < 10; i++) {
    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = (Math.random() - 0.5) * 50;

    scene.add(cube);
}


var light = new THREE.PointLight(0xFFFFFF, 10, 500);
light.position.set(0, 0, 100);
scene.add(light);

camera.position.z = 30;

function render() {
    requestAnimationFrame(render);

    renderer.render(scene, camera);

    analyser.getByteFrequencyData(fqData);

    for (let fq = 0; fq < 256; fq++) {
        scene.children[fq].position.y = fqData[fq] * 0.5 / 25;
        scene.children[fq].position.z = fqData[fq] * 0.5 / 25;
        renderer.setClearColor(fqData[20] * 0xFFFF00);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);
render();   
audio.play();