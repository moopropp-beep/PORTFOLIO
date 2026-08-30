import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {
  createScatter,
  sampleText,
} from './particle-shapes.js';
import {
  createHurricaneFlow,
  getHurricanePositionBuffer,
  stepHurricaneFlow,
} from './particle-flow.js';
import {
  easeInOutCubic,
  getDockOffset,
  getFrameMorphStrength,
  getParticleState,
  getRotationBehavior,
} from './particle-timeline.js';
import {
  createCompletionDispatcher,
  settleAnimation,
} from './particle-completion.js';

const canvas = document.querySelector('#particleCanvas');
const stageElement = document.querySelector('.particle-stage');
const fallback = document.querySelector('.particle-name-fallback');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!canvas || !stageElement || !fallback) {
  throw new Error('Particle hero markup is incomplete.');
}

const dispatchCompleteOnce = createCompletionDispatcher(stageElement);

function dispatchParticleHeroComplete(runtime = window.__particleHero) {
  if (runtime?.completionDispatched) return;
  if (dispatchCompleteOnce() && runtime) runtime.completionDispatched = true;
}

function showFallbackAndComplete() {
  canvas.hidden = true;
  fallback.hidden = false;
  const fallbackAnimation = fallback.animate(
    [{ opacity: 0, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 350, fill: 'both', easing: 'ease-out' },
  );
  settleAnimation(fallbackAnimation, 350).then(() => dispatchParticleHeroComplete());
}

function createDotTexture() {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 64;
  textureCanvas.height = 64;
  const context = textureCanvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(.24, 'rgba(255,255,255,.96)');
  gradient.addColorStop(.62, 'rgba(255,255,255,.28)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(textureCanvas);
}

function resizeRenderer(runtime) {
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(bounds.width));
  const height = Math.max(1, Math.round(bounds.height));
  runtime.renderer.getSize(runtime.rendererSize);
  if (runtime.rendererSize.x !== width || runtime.rendererSize.y !== height) {
    runtime.renderer.setSize(width, height, false);
    runtime.camera.aspect = width / height;
    runtime.camera.updateProjectionMatrix();
    return true;
  }
  return false;
}

function trackPerformance(runtime, now) {
  if (runtime.lastFrameAt) runtime.frameTimes.push(now - runtime.lastFrameAt);
  runtime.lastFrameAt = now;

  if (runtime.frameTimes.length < 90 || runtime.performanceAdjusted) return;

  const averageMs = runtime.frameTimes.reduce((sum, value) => sum + value, 0) / runtime.frameTimes.length;
  if (averageMs > 33.34) {
    runtime.particleCount = Math.floor(runtime.particleCount * .6);
    runtime.cloud.geometry.setDrawRange(0, runtime.particleCount);
  }
  runtime.performanceAdjusted = true;
  runtime.frameTimes.length = 0;
}

function morphParticles(runtime, target, strength) {
  const positions = runtime.cloud.geometry.attributes.position.array;
  for (let index = 0; index < runtime.particleCount * 3; index += 1) {
    positions[index] += (target[index] - positions[index]) * strength;
  }
  runtime.cloud.geometry.attributes.position.needsUpdate = true;
}

function renderFrame(now) {
  const runtime = window.__particleHero;
  if (!runtime || runtime.paused) return;

  trackPerformance(runtime, now);

  const deltaSeconds = runtime.lastRenderedAt
    ? (now - runtime.lastRenderedAt) / 1000
    : 0;
  runtime.lastRenderedAt = now;

  const state = getParticleState(now - runtime.startedAt, runtime.durationScale);
  if (state.shape === 'tornado') {
    stepHurricaneFlow(runtime.hurricane, deltaSeconds, runtime.particleCount, 2);
    runtime.cloud.geometry.attributes.position.needsUpdate = true;
  } else {
    const targetKey = state.shape === 'docking' || state.shape === 'docked'
      ? 'name'
      : state.shape;
    const target = runtime.shapes[targetKey];
    const baseStrength = state.shape === 'docked' ? 1 : .09;
    const morphStrength = state.shape === 'docked'
      ? 1
      : getFrameMorphStrength(baseStrength, deltaSeconds);
    morphParticles(runtime, target, morphStrength);
  }

  const rotation = getRotationBehavior(state.shape);
  if (rotation.reset) {
    runtime.cloud.rotation.x *= .78;
    runtime.cloud.rotation.y *= .78;
    runtime.cloud.rotation.z *= .78;
  }

  if (state.shape === 'docking' || state.shape === 'docked') {
    const progress = state.shape === 'docked' ? 1 : easeInOutCubic(state.progress);
    const scale = 1 - progress * .66;
    runtime.cloud.scale.setScalar(scale);
    runtime.cloud.position.x = progress * runtime.dockOffset.x;
    runtime.cloud.position.y = progress * runtime.dockOffset.y;
  }

  runtime.renderer.render(runtime.scene, runtime.camera);

  if (state.shape !== 'docked') {
    runtime.frameId = requestAnimationFrame(renderFrame);
  } else {
    runtime.finished = true;
    dispatchParticleHeroComplete(runtime);
  }
}

function initializeParticleHero() {
  if (reducedMotion) {
    showFallbackAndComplete();
    return;
  }

  const mobile = window.innerWidth < 800;
  const particleCount = mobile ? 5200 : 11000;
  const durationScale = mobile ? 3.2 / 5.2 : 1;
  const dockOffset = getDockOffset(mobile);
  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
  } catch (error) {
    console.warn('WebGL unavailable; showing the static name fallback.', error);
    showFallbackAndComplete();
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
  camera.position.z = 5.25;

  const shapes = {
    scatter: createScatter(particleCount, 17),
    name: sampleText('和氏璧', particleCount, { size: 176, seed: 47 }),
  };
  const hurricane = createHurricaneFlow(particleCount, 23);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(getHurricanePositionBuffer(hurricane), 3));
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    map: createDotTexture(),
    alphaTest: .05,
    transparent: true,
    opacity: .9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    size: mobile ? .026 : .021,
    sizeAttenuation: true,
  });
  const cloud = new THREE.Points(geometry, material);
  scene.add(cloud);

  window.__particleHero = {
    renderer,
    scene,
    camera,
    cloud,
    rendererSize: new THREE.Vector2(),
    shapes,
    hurricane,
    particleCount,
    durationScale,
    dockOffset,
    startedAt: performance.now(),
    lastFrameAt: 0,
    lastRenderedAt: 0,
    frameTimes: [],
    performanceAdjusted: false,
    finished: false,
    completionDispatched: false,
    paused: false,
    pausedAt: 0,
    frameId: 0,
  };

  stageElement.classList.add('particle-ready');
  resizeRenderer(window.__particleHero);
  window.__particleHero.frameId = requestAnimationFrame(renderFrame);
}

document.addEventListener('visibilitychange', () => {
  const runtime = window.__particleHero;
  if (!runtime || runtime.finished) return;

  if (document.hidden) {
    runtime.paused = true;
    runtime.pausedAt = performance.now();
    cancelAnimationFrame(runtime.frameId);
  } else {
    runtime.startedAt += performance.now() - runtime.pausedAt;
    runtime.paused = false;
    runtime.lastFrameAt = 0;
    runtime.lastRenderedAt = 0;
    runtime.frameId = requestAnimationFrame(renderFrame);
  }
});

initializeParticleHero();

window.addEventListener('resize', () => {
  const runtime = window.__particleHero;
  if (!runtime) return;
  const resized = resizeRenderer(runtime);
  if (resized && runtime.finished) {
    runtime.renderer.render(runtime.scene, runtime.camera);
  }
});
