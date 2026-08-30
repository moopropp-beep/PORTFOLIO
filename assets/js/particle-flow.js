const TAU = Math.PI * 2;
const EYE_RADIUS = 0.13;
const EYEWALL_WIDTH = 0.19;
const OUTER_RADIUS = 1.42;
const BAND_WEIGHTS = [0.11, 0.17, 0.09, 0.19, 0.13, 0.20, 0.11];

function nextRandom(flow) {
  flow._rngState = (Math.imul(flow._rngState, 1664525) + 1013904223) >>> 0;
  return flow._rngState / 0x100000000;
}

function chooseBand(value) {
  let threshold = 0;
  for (let i = 0; i < BAND_WEIGHTS.length; i += 1) {
    threshold += BAND_WEIGHTS[i];
    if (value < threshold) return i;
  }
  return BAND_WEIGHTS.length - 1;
}

function writePosition(flow, index) {
  const radius = flow.radius[index];
  const angle = flow.angle[index];
  const phase = flow.phase[index];
  const offset = index * 3;
  flow.positions[offset] = Math.cos(angle) * radius;
  flow.positions[offset + 1] = Math.sin(angle) * radius;
  flow.positions[offset + 2] = Math.sin(phase + angle * 1.7) * 0.055;
}

export function createHurricaneFlow(count, seed = 23) {
  if (!Number.isFinite(count) || count < 0) {
    throw new RangeError('count must be a finite, non-negative number');
  }
  const size = Math.floor(count);
  const flow = {
    count: size,
    positions: new Float32Array(size * 3),
    radius: new Float32Array(size),
    angle: new Float32Array(size),
    phase: new Float32Array(size),
    band: new Uint8Array(size),
    eyeRadius: EYE_RADIUS,
    eyewallWidth: EYEWALL_WIDTH,
    outerRadius: OUTER_RADIUS,
    _rngState: (Number(seed) >>> 0) || 23,
  };

  const eyewallCount = Math.round(size * 0.24);
  for (let i = 0; i < size; i += 1) {
    const band = chooseBand(nextRandom(flow));
    const radialNoise = nextRandom(flow);
    const angleNoise = nextRandom(flow) - 0.5;
    const phase = nextRandom(flow) * TAU;
    const radius = i < eyewallCount
      ? EYE_RADIUS + EYEWALL_WIDTH * (0.04 + radialNoise * 0.92)
      : EYE_RADIUS + EYEWALL_WIDTH + radialNoise * (OUTER_RADIUS - EYE_RADIUS - EYEWALL_WIDTH);
    const spiralAngle = band * (TAU / 7) + radius * 4.35 + angleNoise * (0.18 + band * 0.018);

    flow.band[i] = band;
    flow.radius[i] = radius;
    flow.angle[i] = ((spiralAngle % TAU) + TAU) % TAU;
    flow.phase[i] = phase;
    writePosition(flow, i);
  }

  return flow;
}

export function getHurricanePositionBuffer(flow) {
  return flow.positions;
}

export function stepHurricaneFlow(flow, deltaSeconds, activeCount = flow.count, speedMultiplier = 1) {
  const dt = Math.min(1 / 20, Math.max(0, Number.isFinite(deltaSeconds) ? deltaSeconds : 0));
  const resolvedSpeedMultiplier = Number.isFinite(speedMultiplier) && speedMultiplier >= 0
    ? speedMultiplier
    : 0;
  const scaledDt = dt * resolvedSpeedMultiplier;
  const resolvedActiveCount = Number.isFinite(activeCount)
    ? Math.min(flow.count, Math.max(0, Math.floor(activeCount)))
    : 0;

  for (let i = 0; i < resolvedActiveCount; i += 1) {
    const radius = flow.radius[i];
    const phase = flow.phase[i];
    const distanceFromEye = Math.max(radius - flow.eyeRadius, 0.04);
    const angularSpeed = Math.min(5.6, 0.9 + 0.72 / distanceFromEye);
    const angularTurbulence = 0.9775 + Math.sin(phase * 1.3 + i * 0.071) * 0.0225;
    const inwardSpeed = 0.035 + 0.018 * Math.sin(phase);
    const nextRadius = radius - inwardSpeed * scaledDt;

    flow.angle[i] = (flow.angle[i] + angularSpeed * angularTurbulence * scaledDt) % TAU;
    flow.phase[i] = (phase + scaledDt * (0.55 + flow.band[i] * 0.025)) % TAU;

    if (nextRadius <= flow.eyeRadius) {
      flow.radius[i] = flow.outerRadius - nextRandom(flow) * 0.12;
      flow.phase[i] = (flow.phase[i] + TAU * (0.3 + nextRandom(flow) * 0.7)) % TAU;
    } else {
      flow.radius[i] = nextRadius;
    }
    writePosition(flow, i);
  }

  return flow;
}
