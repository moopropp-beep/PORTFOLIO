const hero = document.querySelector('#hero');
const canvas = document.querySelector('#hero-dot-grid');
const cursor = document.querySelector('#hero-cursor');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = window.matchMedia('(pointer: coarse)');

if (hero && canvas && cursor) {
  const context = canvas.getContext('2d');
  const pointer = { x: -9999, y: -9999, active: false };
  const mouse = { x: -100, y: -100, tx: -100, ty: -100, down: 0 };
  let frame = 0;
  let visible = true;
  let last = 0;
  let pulse = 0;
  let width = 0;
  let height = 0;
  const spacing = 60;
  const radius = 350;

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
    context.fillStyle = 'rgba(242, 241, 238, 0.16)';
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
        const alpha = 0.08 + eased * 0.22 + burst * 0.18;
        context.globalAlpha = alpha;
        context.beginPath();
        context.arc(px, py, 1.25 + eased * 0.8, 0, Math.PI * 2);
        context.fill();
      }
    }
    context.globalAlpha = 1;
    mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 12);
    mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 12);
    cursor.style.transform = `translate3d(${mouse.x - 16}px, ${mouse.y - 16}px, 0) scale(${mouse.down ? 0.7 : cursor.dataset.hover === 'true' ? 2.8 : 1})`;
  };

  const onMove = (event) => {
    const bounds = hero.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
    mouse.tx = event.clientX;
    mouse.ty = event.clientY;
    cursor.hidden = false;
  };
  const onLeave = () => {
    pointer.x = -9999;
    pointer.y = -9999;
    pointer.active = false;
    cursor.hidden = true;
  };
  const onDown = () => { mouse.down = 1; pulse = 1; cursor.classList.add('is-down'); };
  const onUp = () => { mouse.down = 0; cursor.classList.remove('is-down'); };
  const onHover = (event) => { cursor.dataset.hover = event.target.closest('a, button, .idea-card') ? 'true' : 'false'; };

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
  window.addEventListener('pointerup', onUp, { passive: true });
  hero.addEventListener('pointerover', onHover, { passive: true });
  reducedMotion.addEventListener('change', motionChange);
  coarsePointer.addEventListener('change', pointerChange);
  if (!reducedMotion.matches && !coarsePointer.matches) frame = requestAnimationFrame(draw);
}
