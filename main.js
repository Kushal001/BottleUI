import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as dat from "dat.gui"

// Debug
const gui = new dat.GUI()

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xd6d6d3)

// Texture loader
const textureLoader = new THREE.TextureLoader()

// Texture
const bakedTexture = textureLoader.load("./MusgraveBottleBake.jpg")
bakedTexture.flipY = false

// baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

/**
 * Models
 */
const gltfLoader = new GLTFLoader()

gltfLoader.load("./BottleJoined.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = bakedMaterial
  })

  scene.add(gltf.scene)
})

// // Test
// const mesh = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1),
//   new THREE.MeshBasicMaterial()
// )

// scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)

camera.position.set(0, 0.25, 3.5)
scene.add(camera)

// Debug
gui.add(camera.position, "x").min(0).max(20).step(0.25).name("XCameraPosition")
gui.add(camera.position, "y").min(0).max(20).step(0.25).name("YCameraPosition")
gui.add(camera.position, "z").min(0).max(20).step(0.25).name("ZCameraPosition")

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
