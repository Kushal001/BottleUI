import "./style.css"
import "normalize.css"

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import gsap from "gsap"
import BottleGlb from "./static/Models/Bottle.glb"

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
let model
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xd6d6d3)

// Texture loader
const textureLoader = new THREE.TextureLoader()

// Texture
const bakedRedMetalTexture = textureLoader.load(
  "./static/Textures/TextureRedMetal.jpg"
)
bakedRedMetalTexture.flipY = false

const bakedMusgraveTexture = textureLoader.load(
  "./static/Textures/TextureMusgrave.jpg"
)
bakedMusgraveTexture.flipY = false

const bakedFabricTexture = textureLoader.load(
  "./static/Textures/TextureFabric.jpg"
)
bakedFabricTexture.flipY = false

// baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedFabricTexture })
bakedMaterial.needsUpdate = true

// change material
const redMetalSelector = document.querySelector("#change-red-metal")
const musgraveSelector = document.querySelector("#change-musgrave")
const fabricSelector = document.querySelector("#change-fabric")

redMetalSelector.addEventListener("click", () => {
  changeMaterial("red-metal", bakedRedMetalTexture)
})
musgraveSelector.addEventListener("click", () => {
  changeMaterial("musgrave", bakedMusgraveTexture)
})
fabricSelector.addEventListener("click", () => {
  changeMaterial("fabric", bakedFabricTexture)
})

const changeMaterial = (type = "red-metal", texture = bakedRedMetalTexture) => {
  if (model) {
    const bakedMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    })
    model.traverse((o) => {
      if (o.isMesh) o.material = bakedMaterial
    })
  }
}

/**
 * Models
 */
const gltfLoader = new GLTFLoader()

gltfLoader.load(BottleGlb, (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = bakedMaterial
    // child.material.needsUpdate = true
  })

  model = gltf.scene
  scene.add(model)
})

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

const toggleUI = (ui3d, uiShop) => {
  document.querySelector(".bottle-UI-components").style.display = ui3d
  document.querySelector(".shop-ui").style.display = uiShop
}

const changeCanvasWidth = (width) => {
  // Update sizes
  sizes.width = width
  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

document.querySelector(".btn-shop").addEventListener("click", () => {
  changeCanvasWidth(window.innerWidth / 2)

  // Clear UI
  toggleUI("none", "block")
})

document.querySelector(".view-3d-btn").addEventListener("click", () => {
  changeCanvasWidth(window.innerWidth)

  // Clear UI
  toggleUI("block", "none")
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
