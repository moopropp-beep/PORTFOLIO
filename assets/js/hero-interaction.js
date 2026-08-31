const hero = document.querySelector('#hero');
const canvas = document.querySelector('#hero-dot-grid');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = window.matchMedia('(pointer: coarse)');

if (hero && canvas) {
  const context = canvas.getContext('2d');
  const pointer = { x: -9999, y: -9999, active: false };
  const mouse = { tx: -100, ty: -100 };
  let frame = 0;
  let visible = true;
  let last = 0;
  let pulse = 0;
  let width = 0;
  let height = 0;
  const spacing = 56;
  const radius = 180;
  const baseAlpha = 0.2;

  const resize = () => {
    const bounds = hero.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  const draw = (time) => {
    frame = requestAnimationFrame(draw);
    if (!visible || reducedMotion.matches || coarsePointer.matches) return;
    const dt = Math.min((time - last) / 1000 || 0, 0.04);
    last = time;
    pulse = Math.max(0, pulse - dt / 0.7);
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#f2f1ee';
    context.strokeStyle = 'rgba(160, 205, 235, 0.09)';
    context.lineWidth = 0.5;
    context.beginPath();
    for (let y = 0; y <= height; y += spacing) {
      context.moveTo(0, y);
      context.lineTo(width, y);
    }
    for (let x = 0; x <= width; x += spacing) {
      context.moveTo(x, 0);
      context.lineTo(x, height);
    }
    context.stroke();
    context.shadowColor = 'rgba(145, 205, 255, 0.7)';
    context.shadowBlur = 5;
    for (let y = -spacing; y < height + spacing; y += spacing) {
      for (let x = -spacing; x < width + spacing; x += spacing) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / radius);
        const eased = influence * influence;
        const angle = Math.atan2(dy, dx);
        const burst = pulse * Math.max(0, 1 - Math.hypot(x - mouse.tx, y - mouse.ty) / 420);
        const offset = eased * 16 + burst * 22;
        const px = x + Math.cos(angle) * offset;
        const py = y + Math.sin(angle) * offset;
        const alpha = baseAlpha * 0.24 + eased * 0.62 + burst * 0.28;
        context.globalAlpha = alpha;
        context.beginPath();
        context.arc(px, py, 1.8 + eased * 1.15, 0, Math.PI * 2);
        context.fill();
      }
    }
    context.globalAlpha = 1;
    context.shadowBlur = 0;
  };

  const onMove = (event) => {
    const bounds = hero.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
    mouse.tx = event.clientX;
    mouse.ty = event.clientY;
  };
  const onLeave = () => {
    pointer.x = -9999;
    pointer.y = -9999;
    pointer.active = false;
  };
  const onDown = () => { pulse = 1; };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) stop();
    else if (!frame && !reducedMotion.matches && !coarsePointer.matches) { last = performance.now(); frame = requestAnimationFrame(draw); }
  }, { threshold: 0.05 });
  const motionChange = () => { if (reducedMotion.matches || coarsePointer.matches) { stop(); context.clearRect(0, 0, width, height); } else if (visible && !frame) { frame = requestAnimationFrame(draw); } };
  const pointerChange = () => motionChange();
  const observerResize = new ResizeObserver(resize);
  resize();
  observerResize.observe(hero);
  observer.observe(hero);
  hero.addEventListener('pointermove', onMove, { passive: true });
  hero.addEventListener('pointerleave', onLeave, { passive: true });
  hero.addEventListener('pointerdown', onDown, { passive: true });
  reducedMotion.addEventListener('change', motionChange);
  coarsePointer.addEventListener('change', pointerChange);
  if (!reducedMotion.matches && !coarsePointer.matches) frame = requestAnimationFrame(draw);
}
