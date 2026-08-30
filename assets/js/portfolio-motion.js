const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) document.documentElement.classList.add('motion-ready');
const reveals = [...document.querySelectorAll('.reveal')];

const observer = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) entry.target.classList.add('is-visible');
}, { threshold: 0.16 });
reveals.forEach(element => observer.observe(element));

if (!reducedMotion) {
  const heroLines = [...document.querySelectorAll('.hero-title__line')];
  const hero = document.querySelector('#hero');
  let heroVisible = true;
  let scheduled = false;
  const render = () => {
    if (!heroVisible) { scheduled = false; return; }
    const offset = Math.min(Math.max(scrollY, 0), innerHeight * 1.15);
    heroLines.forEach((line, index) => {
      const direction = index % 2 === 0 ? -1 : 1;
      line.style.transform = `translate3d(${direction * offset * 0.18}px, 0, 0)`;
    });
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
