const FIXED_STEP = 1 / 120;
const MAX_DELTA = 0.1;
const CONTACT_ANGLE = 0.62;
const FINAL_ANGLE = 0.93;
const SETTLE_SECONDS = 0.58;
const FINAL_X = [18, 12, 6];
const FINAL_Y = [-12, -6, 0];

function createMark(index) {
  return {
    angle: 0,
    previousAngle: 0,
    angularVelocity: 0,
    x: 0,
    previousX: 0,
    y: 0,
    previousY: 0,
    active: index === 2,
    sleeping: false,
    _contacted: false,
    _settleTime: 0,
  };
}

export function createQuestionPhysics() {
  return {
    marks: [createMark(0), createMark(1), createMark(2)],
    nextTrigger: 2,
    accumulator: 0,
    elapsed: 0,
    complete: false,
    triggerOrder: [2],
  };
}

function activateNext(state, index) {
  const nextIndex = index - 1;
  if (nextIndex < 0 || state.marks[nextIndex].active) return;
  state.marks[nextIndex].active = true;
  state.nextTrigger = nextIndex;
  state.triggerOrder.push(nextIndex);
}

function settleMark(mark, index, dt) {
  mark._settleTime += dt;
  const progress = Math.min(1, mark._settleTime / SETTLE_SECONDS);
  const eased = 1 - Math.pow(1 - progress, 3);
  // A small reverse velocity provides a readable rebound immediately on contact.
  mark.angularVelocity += (FINAL_ANGLE - mark.angle) * 24 * dt;
  mark.angularVelocity *= Math.exp(-9 * dt);
  mark.angle += mark.angularVelocity * dt;
  mark.x = FINAL_X[index] * eased;
  mark.y = FINAL_Y[index] * eased;

  if (progress === 1) {
    mark.angle = FINAL_ANGLE;
    mark.angularVelocity = 0;
    mark.x = FINAL_X[index];
    mark.y = FINAL_Y[index];
    mark.sleeping = true;
  }
}

function fixedStep(state) {
  for (const mark of state.marks) {
    mark.previousAngle = mark.angle;
    mark.previousX = mark.x;
    mark.previousY = mark.y;
  }

  for (let index = 2; index >= 0; index -= 1) {
    const mark = state.marks[index];
    if (!mark.active || mark.sleeping) continue;

    if (mark._contacted) {
      settleMark(mark, index, FIXED_STEP);
      continue;
    }

    const gravityAcceleration = 7.4 + Math.sin(mark.angle) * 4.2;
    mark.angularVelocity += gravityAcceleration * FIXED_STEP;
    mark.angularVelocity *= Math.exp(-0.72 * FIXED_STEP);
    mark.angle += mark.angularVelocity * FIXED_STEP;

    if (mark.angle >= CONTACT_ANGLE) {
      mark.angle = CONTACT_ANGLE;
      mark.angularVelocity = -0.72;
      mark._contacted = true;
      activateNext(state, index);
    }
  }

  state.elapsed += FIXED_STEP;
  state.complete = state.marks.every(mark => mark.sleeping);
}

export function stepQuestionPhysics(state, deltaSeconds) {
  if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return state;

  state.accumulator += Math.min(deltaSeconds, MAX_DELTA);
  while (state.accumulator + 1e-12 >= FIXED_STEP) {
    fixedStep(state);
    state.accumulator -= FIXED_STEP;
  }
  if (Math.abs(state.accumulator) < 1e-12) state.accumulator = 0;
  return state;
}

export function sampleQuestionPose(state) {
  const alpha = state.complete
    ? 1
    : Math.min(1, Math.max(0, state.accumulator / FIXED_STEP));
  return state.marks.map(mark => ({
    angle: mark.previousAngle + (mark.angle - mark.previousAngle) * alpha,
    x: mark.previousX + (mark.x - mark.previousX) * alpha,
    y: mark.previousY + (mark.y - mark.previousY) * alpha,
  }));
}
