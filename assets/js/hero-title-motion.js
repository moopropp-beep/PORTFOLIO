import {
  createQuestionPhysics,
  sampleQuestionPose,
  stepQuestionPhysics,
} from './question-physics.js';

const ACT_DELAY = 160;
const LAYOUT_DURATION = 650;
const PHYSICS_DELAY = 180;
const WATCHDOG_TIMEOUT = 6500;

export function createSecondActTrigger({ onStart, schedule, cancel, timeout }) {
  let started = false;
  const timer = schedule(start, timeout);

  function start() {
    if (started) return false;
    started = true;
    cancel(timer);
    onStart();
    return true;
  }

  return { start, get started() { return started; } };
}

function renderMarks(marks, pose, unitScale) {
  marks.forEach((mark, index) => {
    const item = pose[index];
    mark.style.transform = `translate(${item.x * unitScale}px, ${item.y * unitScale}px) rotate(${item.angle}rad)`;
  });
}

export function createHeroTitleMotionController({
  root,
  marks,
  announcement,
  reducedMotion = false,
  createPhysics = createQuestionPhysics,
  stepPhysics = stepQuestionPhysics,
  samplePose = sampleQuestionPose,
  getUnitScale = () => parseFloat(getComputedStyle(root).fontSize) || 16,
  setTimeout = globalThis.setTimeout.bind(globalThis),
  clearTimeout = globalThis.clearTimeout.bind(globalThis),
  requestAnimationFrame = globalThis.requestAnimationFrame?.bind(globalThis),
  now = () => performance.now(),
  addResizeListener = handler => window.addEventListener('resize', handler, { passive: true }),
}) {
  const state = { started: false, physics: null, unitScale: getUnitScale(), lastFrame: 0 };

  const draw = () => {
    if (!state.physics) return;
    renderMarks(marks, samplePose(state.physics), state.unitScale);
  };

  const frame = timestamp => {
    const delta = state.lastFrame ? (timestamp - state.lastFrame) / 1000 : 0;
    state.lastFrame = timestamp;
    stepPhysics(state.physics, delta);
    draw();
    if (!state.physics.complete) requestAnimationFrame(frame);
    else root.classList.add('second-act-final');
  };

  const startPhysics = () => {
    state.physics = createPhysics();
    state.lastFrame = now();
    draw();
    requestAnimationFrame(frame);
  };

  const completeWithoutMotion = () => {
    root.classList.add('second-act-active', 'second-act-final');
    state.physics = createPhysics();
    let guard = 0;
    while (!state.physics.complete && guard < 2400) {
      stepPhysics(state.physics, 1 / 120);
      guard += 1;
    }
    draw();
  };

  const beginSecondAct = () => {
    state.started = true;
    root.removeEventListener('particlehero:complete', onComplete);
    announcement.textContent = '等等，什么？？？';
    if (reducedMotion) {
      completeWithoutMotion();
      return;
    }
    setTimeout(() => {
      root.classList.add('second-act-active');
      setTimeout(() => setTimeout(startPhysics, PHYSICS_DELAY), LAYOUT_DURATION);
    }, ACT_DELAY);
  };

  const trigger = createSecondActTrigger({
    onStart: beginSecondAct,
    schedule: setTimeout,
    cancel: clearTimeout,
    timeout: WATCHDOG_TIMEOUT,
  });
  const onComplete = () => trigger.start();

  root.addEventListener('particlehero:complete', onComplete);
  addResizeListener(() => {
    state.unitScale = getUnitScale();
    draw();
  });

  return { state, draw };
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('.particle-hero');
  const marks = root ? [...root.querySelectorAll('.question-mark')] : [];
  const announcement = root?.querySelector('.hero-second-act-announcement');
  if (root && announcement && marks.length === 3) {
    createHeroTitleMotionController({
      root,
      marks,
      announcement,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      getUnitScale: () => parseFloat(getComputedStyle(root.querySelector('.question-display')).fontSize) / 100,
    });
  }
}
