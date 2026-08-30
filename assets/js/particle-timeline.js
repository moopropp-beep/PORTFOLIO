export function getParticleState(elapsedMs, durationScale = 1) {
  const time = elapsedMs / durationScale;

  if (time < 2200) {
    return { shape: 'tornado', progress: time / 2200 };
  }
  if (time < 3000) {
    return { shape: 'scatter', progress: (time - 2200) / 800 };
  }
  if (time < 4400) {
    return { shape: 'name', progress: (time - 3000) / 1400 };
  }
  if (time < 5200) {
    return { shape: 'docking', progress: (time - 4400) / 800 };
  }
  return { shape: 'docked', progress: 1 };
}

export function easeInOutCubic(value) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

export function getDockOffset(isMobile) {
  return isMobile
    ? { x: .82, y: -1.16 }
    : { x: 1.75, y: -1.08 };
}

export function getRotationBehavior() {
  return { spin: 0, reset: true };
}

export function getFrameMorphStrength(baseStrength, deltaSeconds) {
  const delta = Number.isFinite(deltaSeconds) && deltaSeconds > 0 ? deltaSeconds : 0;
  const base = Math.max(0, Math.min(1, baseStrength));
  return 1 - Math.pow(1 - base, delta * 60);
}
