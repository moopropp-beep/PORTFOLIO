function createRng(seed) {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(1664525, value) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function createScatter(count, seed = 1) {
  const random = createRng(seed);
  const points = new Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const radius = Math.pow(random(), 0.7);
    const angle = random() * Math.PI * 2;
    points[index * 3] = Math.cos(angle) * radius * 2.2;
    points[index * 3 + 1] = (random() * 2 - 1) * 1.45;
    points[index * 3 + 2] = Math.sin(angle) * radius * 1.1;
  }

  return points;
}

export function sampleMask(rgba, width, height, count, seed = 1) {
  const visible = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (rgba[(y * width + x) * 4 + 3] > 90) visible.push([x, y]);
    }
  }

  if (!visible.length) return createScatter(count, seed);

  const random = createRng(seed);
  const points = new Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const [x, y] = visible[Math.floor(random() * visible.length)];
    points[index * 3] = (x / width - 0.5) * 3.1;
    points[index * 3 + 1] = (0.5 - y / height) * 1.55;
    points[index * 3 + 2] = (random() - 0.5) * 0.08;
  }

  return points;
}

export function sampleText(text, count, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = options.width || 900;
  canvas.height = options.height || 320;
  const context = canvas.getContext('2d', { willReadFrequently: true });

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#fff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `${options.weight || 600} ${options.size || 190}px "Microsoft YaHei", "PingFang SC", sans-serif`;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  return sampleMask(pixels, canvas.width, canvas.height, count, options.seed || 1);
}
