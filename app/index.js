import * as THREE from '../node_modules/three/build/three.module.js';
import { Sky } from '../node_modules/three/examples/jsm/objects/Sky.js';

var score = 0, block, speed = 2, offset = 4, direction = 0;

const scene = new THREE.Scene();

const clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer();
//document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(5, 3, 5);
camera.lookAt(0, 0, 0);

(window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    const dt = clock.getDelta();
    if(block) {
        if(score % 2 == 0) {
            block.position.x += direction ? -(0.01 * speed * dt * 100) : (0.01 * speed * dt * 100);
            if(block.position.x > offset || block.position.x < -offset) {
                direction = !direction;
            }   
        } else {
            block.position.z += direction ? -(0.01 * speed * dt * 100) : (0.01 * speed * dt * 100);
            if(block.position.z > offset || block.position.z < -offset) {
                direction = !direction;
            } 
        }
    }
}

// Set Controls 

window.addEventListener('keydown', (e) => {
    if(e.code === 'Space') levelUpCheck();
});

// Set Lights

const ambientLight = new THREE.AmbientLight(new THREE.Color('#FFFFFF'), 1);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(new THREE.Color('#FFFFFF'), 1);
light.position.set(3, 5, 0);
light.castShadow = true;
scene.add(light);

// Set Ground

const groundGeometry = new THREE.BoxGeometry(3, 10, 3);
const groundMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color('#292929') });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.position.set(0, -5, 0);
groundMesh.castShadow = true;
scene.add(groundMesh);


// Set Sky

const sky = new Sky();
sky.scale.setScalar(45000); 

sky.turbidity = 0;
sky.rayleigh = 0.5;

const phi = THREE.MathUtils.degToRad(90);
const theta = THREE.MathUtils.degToRad(180);
const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);

sky.material.uniforms = {
    sunPosition: { value: sunPosition },
    turbidity: { value: 0 },
    rayleigh: { value: 0.1 }
}

scene.add(sky);

// Block Invokation

function createBlock() {
    const blockGeometry = new THREE.BoxGeometry(3, 0.5, 3);
    const blockMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(`hsl(${score * 3}, 100%, 50%)`) });
    const blockMesh = new THREE.Mesh(blockGeometry, blockMaterial);
    blockMesh.position.set(0, 0.25 + score / 2, 0);
    scene.add(blockMesh);
    return blockMesh;
}

block = createBlock();

// Level Up Check 

function levelUpCheck() {
    // Check level



    // Scored
    score++;
    sky.material.uniforms.rayleigh.value += 0.001;
    block = createBlock();
    camera.position.y += 0.5;
}

//animate();