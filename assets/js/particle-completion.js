export function createCompletionDispatcher(target) {
  let dispatched = false;
  return () => {
    if (dispatched) return false;
    dispatched = true;
    target.dispatchEvent(new CustomEvent('particlehero:complete', { bubbles: true }));
    return true;
  };
}

export function settleAnimation(animation, fallbackMs, schedule = setTimeout) {
  return new Promise(resolve => {
    let settled = false;
    const complete = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    schedule(complete, fallbackMs);
    const finished = animation?.finished;
    if (finished && typeof finished.then === 'function') {
      finished.then(complete, complete);
    }
  });
}
