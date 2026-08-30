const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) document.documentElement.classList.add('motion-ready');
const reveals = [...document.querySelectorAll('.reveal')];

const observer = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) entry.target.classList.add('is-visible');
}, { threshold: 0.16 });
reveals.forEach(element => observer.observe(element));

if (!reducedMotion) {
  const parallaxItems = [...document.querySelectorAll('[data-shift]')];
  const hero = document.querySelector('#hero');
  let heroVisible = true;
  let scheduled = false;
  const render = () => {
    if (!heroVisible) { scheduled = false; return; }
    const offset = Math.min(scrollY, innerHeight * 1.25);
    for (const item of parallaxItems) item.style.transform = `translate3d(${offset * Number(item.dataset.shift)}px, 0, 0)`;
    scheduled = false;
  };
  const heroObserver = new IntersectionObserver(entries => {
    heroVisible = entries[0]?.isIntersecting ?? false;
    if (heroVisible && !scheduled) { scheduled = true; requestAnimationFrame(render); }
  });
  if (hero) heroObserver.observe(hero);
  addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(render); }
  }, { passive: true });
  requestAnimationFrame(render);
}
