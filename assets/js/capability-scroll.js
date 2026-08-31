const folds = [...document.querySelectorAll('.capability-fold')];
if (folds.length) {
  const activate = active => {
    for (const fold of folds) {
      fold.open = fold === active;
      fold.classList.toggle('is-keywords-only', fold === active);
      const summary = fold.querySelector('summary');
      summary?.setAttribute('aria-label', `${summary.innerText.replace(/[＋×]/g, '').trim()}，${fold.open ? '当前已自动展开' : '继续滚动自动展开'}`);
    }
  };

  for (const fold of folds) {
    const summary = fold.querySelector('summary');
    summary?.addEventListener('click', event => event.preventDefault());
  }

  const observer = new IntersectionObserver(entries => {
    const activeEntry = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => Math.abs(a.boundingClientRect.top - innerHeight * .28) - Math.abs(b.boundingClientRect.top - innerHeight * .28))[0];
    if (activeEntry) activate(activeEntry.target);
  }, { rootMargin: '-20% 0px -64% 0px', threshold: 0 });

  folds.forEach(fold => observer.observe(fold));
  activate(folds.find(fold => fold.open) || folds[0]);
}
