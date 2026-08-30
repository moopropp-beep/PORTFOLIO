const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cards = [...document.querySelectorAll('[data-idea-rail] .idea-card, [data-inspiration-rail] .idea-card')];

const showCard = card => card.classList.add('is-floated');

if (reducedMotion || !('IntersectionObserver' in window)) {
  cards.forEach(showCard);
} else {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      showCard(entry.target);
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  cards.forEach(card => observer.observe(card));
}
