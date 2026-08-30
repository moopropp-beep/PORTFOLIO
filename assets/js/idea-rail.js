const rail = document.querySelector('[data-idea-rail]');
const previous = document.querySelector('[data-rail-prev]');
const next = document.querySelector('[data-rail-next]');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (rail) {
  const dragThreshold = 5;
  const step = direction => rail.scrollBy({ left: direction * Math.min(rail.clientWidth * .78, 620), behavior: reducedMotion ? 'auto' : 'smooth' });
  previous?.addEventListener('click', () => step(-1));
  next?.addEventListener('click', () => step(1));
  rail.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
  });

  let pointerDown = false, dragging = false, wasDragged = false, startX = 0, startScroll = 0;
  rail.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') return;
    pointerDown = true; dragging = false; wasDragged = false;
    startX = event.clientX; startScroll = rail.scrollLeft;
  });
  rail.addEventListener('pointermove', event => {
    if (!pointerDown) return;
    const movement = event.clientX - startX;
    if (!dragging && Math.abs(movement) < dragThreshold) return;
    if (!dragging) {
      dragging = true;
      rail.setPointerCapture(event.pointerId);
      rail.classList.add('is-dragging');
    }
    event.preventDefault();
    rail.scrollLeft = startScroll - movement;
  });
  const release = event => {
    if (!pointerDown) return;
    pointerDown = false; wasDragged = dragging; dragging = false;
    rail.classList.remove('is-dragging');
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
  };
  rail.addEventListener('pointerup', release);
  rail.addEventListener('pointercancel', release);
  rail.addEventListener('dragstart', event => event.preventDefault());
  rail.addEventListener('click', event => {
    if (wasDragged) { event.preventDefault(); event.stopPropagation(); wasDragged = false; }
  }, true);
}
