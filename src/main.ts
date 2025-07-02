import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { showPopup } from './Popup';

const scene = new THREE.Scene()

// Light map
new RGBELoader().load('img/satara.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture
  scene.background = texture
  scene.backgroundBlurriness = 1
})

// Building 1
const building1 = new GLTFLoader()
building1.load('models/PortBuilding_1.glb', (gltf) => {
  const building1 = gltf.scene
  scene.add(gltf.scene)
  building1.position.set(0, 0.6, 0)
})

// Building 2
const building2 = new GLTFLoader()
building2.load('models/PortBuilding_2.glb', (gltf) => {
  const building2 = gltf.scene
  scene.add(gltf.scene)
  building2.position.set(0, 0.35, 8)
})

// Road 1
const road1 = new GLTFLoader()
road1.load('models/Road_1.glb', (gltf) => {
  const road1 = gltf.scene
  scene.add(gltf.scene)
  road1.position.set(5, 1, 5)
})

// Tree 1
const tree1 = new GLTFLoader()
tree1.load('models/Tree_1.glb', (gltf) => {
  const tree1 = gltf.scene
  scene.add(gltf.scene)
  tree1.position.set(8, 1, 10)
})

// Tree 2
const tree2 = new GLTFLoader()
tree2.load('models/Tree_1.glb', (gltf) => {
  const tree2 = gltf.scene
  scene.add(gltf.scene)
  tree2.position.set(8, 1, 4.5)
})

// Tree 3
const tree3 = new GLTFLoader()
tree3.load('models/Tree_1.glb', (gltf) => {
  const tree3 = gltf.scene
  scene.add(gltf.scene)
  tree3.position.set(8, 1, -1)
})

// Floor
const floorGeometry = new THREE.BoxGeometry(100, 100, 2);
const floorMaterial = new THREE.MeshStandardMaterial({color: 0xaaaaaa, roughness: 0.5});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.set(Math.PI / 2,0,0);
scene.add(floor);

// Rectangle light
const rectWidth = 1.68;
const rectHeight = 3.5;
const rectIntensity = 10;
const rectLight = new THREE.RectAreaLight(0x63B0EF, rectIntensity, rectWidth, rectHeight);
rectLight.position.set(0, 7.5, 4.35);
rectLight.rotation.y = 4.71
scene.add(rectLight);

// Rectangle light boxgeometry
const cubeGeometry = new THREE.BoxGeometry(1.6, 3.5, 0);
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0x64B0EF});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.copy(rectLight.position)
cube.rotation.y = 4.71
scene.add(cube);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(10, 10, 5)

// Automatic resolution
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 3, 0)

// Create an HTML element to display cursor position
const cursorPositionDiv = document.createElement('div');
cursorPositionDiv.style.position = 'absolute';
cursorPositionDiv.style.top = '10px';
cursorPositionDiv.style.right = '10px'; // Move to the right corner
cursorPositionDiv.style.color = 'white';
cursorPositionDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
cursorPositionDiv.style.padding = '10px';
cursorPositionDiv.style.borderRadius = '5px';
cursorPositionDiv.style.fontFamily = 'Arial, sans-serif';
cursorPositionDiv.style.zIndex = '1000';
document.body.appendChild(cursorPositionDiv);

// Plane for detecting cursor position in 3D space
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Horizontal plane at y = 0
const planeIntersectPoint = new THREE.Vector3();

// Update cursor position on mouse move
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Use raycaster to find intersection with the plane
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, planeIntersectPoint);

  // Update the HTML element with the cursor position
  cursorPositionDiv.innerHTML = `
    <strong>Cursor Position:</strong><br>
    X: ${planeIntersectPoint.x.toFixed(2)}<br>
    Y: ${planeIntersectPoint.y.toFixed(2)}<br>
    Z: ${planeIntersectPoint.z.toFixed(2)}
  `;
});

// Performance stats
const stats = new Stats()
document.body.appendChild(stats.dom)

class Box extends THREE.Mesh {
  constructor() {
    super();

    // Make box1 a flat rectangle: width=0.2, height=3, depth=2
    //this.geometry = new THREE.BoxGeometry(0.1, 3.5, 1.7);
    //this.material = new THREE.MeshStandardMaterial({color: new THREE.Color('red').convertSRGBToLinear()});

    // Flat rectangle geometry (unchanged)
    this.geometry = new THREE.BoxGeometry(0.1, 3.5, 1.7);
    // Make the box completely invisible but still interactive
    this.material = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0, transparent: true });
    this.visible = false; // Hide the mesh from rendering, but keep it in raycasting
    this.material.visible = true; // Material must be visible for raycasting to work
  }

  onPointerOver() {
    // Do not change material on hover to keep it invisible
  }

  onClick() {
    if (isPopupOpen) return; // Prevent action if popup is open

    // Hardcoded box1 position (since it never moves)
    const box1X = 0, box1Y = 7.5, box1Z = 4.3;
    // Zoom in a little more: move camera closer to box1 (e.g., 2.5 units to the right instead of 5)
    const targetPosition = new THREE.Vector3(box1X + 2.5, box1Y, box1Z);
    const targetLookAt = new THREE.Vector3(box1X, box1Y, box1Z);

    // Disable controls during animation
    controls.enabled = false;

    const initialPosition = camera.position.clone();
    // Get the current controls target (where the camera is currently looking)
    const initialTarget = controls.target.clone();

    const duration = 1.5; // seconds
    let startTime: number | null = null;

    function animateCamera(time: number) {
      if (startTime === null) startTime = time;
      const elapsed = (time - startTime) / 1000;
      const t = Math.min(elapsed / duration, 1);

      // Interpolate position and controls target
      camera.position.copy(initialPosition.clone().lerp(targetPosition, t));
      controls.target.copy(initialTarget.clone().lerp(targetLookAt, t));
      controls.update();

      if (t < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        camera.position.copy(targetPosition);
        controls.target.copy(targetLookAt);
        controls.update();
        controls.enabled = true;
        // Show popup after animation
        showPopup();
        isPopupOpen = true;
        // Also listen for popup close directly (in case popup is closed by other means)
        const popupDiv = document.getElementById('custom-popup');
        if (popupDiv) {
          const closeBtn = popupDiv.querySelector('#popup-close');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => {
              setTimeout(() => {
                isPopupOpen = false;
              }, 0);
            }, { once: true });
          }
        }
      }
    }
    requestAnimationFrame(animateCamera);
  }
}

const box1 = new Box();
box1.position.set(0, 7.5, 4.35); // Set the initial position of box1
scene.add(box1);

// Add raycaster and mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Track mouse position
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Track popup state
let isPopupOpen = false;

// Listen for popup close to re-enable clicks
document.addEventListener('click', (event) => {
  const popupDiv = document.getElementById('custom-popup');
  if (popupDiv && popupDiv.style.display === 'block') {
    const closeBtn = popupDiv.querySelector('#popup-close');
    if (closeBtn && event.target === closeBtn) {
      // Wait for the popup to actually hide, then re-enable clicks
      setTimeout(() => {
        isPopupOpen = false;
      }, 0);
    }
  }
});

// Style the GUI to position it in the middle top of the screen
const guiContainer = document.querySelector('.dg') as HTMLElement;
if (guiContainer) {
  guiContainer.style.position = 'absolute';
  guiContainer.style.top = '10px';
  guiContainer.style.left = '50%';
  guiContainer.style.transform = 'translateX(-50%)';
  guiContainer.style.zIndex = '1000';
}

// Display coordinates in the console for copying
function logBox1Position() {
  console.log(`Box1 Position: x=${box1.position.x}, y=${box1.position.y}, z=${box1.position.z}`);
}
window.addEventListener('keydown', (event) => {
  if (event.key === 'p') { // Press 'P' to log the position
    logBox1Position();
  }
});

// Animation update
function animate() {
  requestAnimationFrame(animate);

  // Update raycaster for hover effects
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(box1);

  if (intersects.length > 0) {
    box1.onPointerOver();
  } else {
    box1.material = new THREE.MeshStandardMaterial({color: new THREE.Color('red').convertSRGBToLinear()});
  }

  controls.update();

  renderer.render(scene, camera);

  stats.update();
}
animate();

// Add click event listener
window.addEventListener('click', () => {
  if (isPopupOpen) return; // Prevent click-through when popup is open
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections
  const intersects = raycaster.intersectObjects([box1]);

  if (intersects.length > 0) {
    // Trigger the onClick function
    box1.onClick();
  }
});