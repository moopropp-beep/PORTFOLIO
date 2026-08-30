function locateHeading(markdown, needle, from = 0) {
  if (!needle) return markdown.length;
  const expression = /^#{2,4}\s+.*$/gm;
  expression.lastIndex = from;
  for (const match of markdown.matchAll(expression)) {
    if (match[0].includes(needle)) return match.index;
  }
  return -1;
}

export function extractScriptSections(markdown, specifications) {
  const sections = {};
  for (const [key, specification] of Object.entries(specifications)) {
    const start = locateHeading(markdown, specification.start);
    if (start < 0) { sections[key] = ''; continue; }
    const end = specification.end ? locateHeading(markdown, specification.end, start + 1) : markdown.length;
    sections[key] = markdown.slice(start, end < 0 ? markdown.length : end).trim();
  }
  return sections;
}

const escapeHtml = value => value.replace(/[&<>]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]);
const renderInline = value => escapeHtml(value).replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');

export function renderScriptSection(markdown) {
  const blocks = markdown.split(/\n{2,}/).map(block => block.trim()).filter(Boolean);
  return blocks.map(block => {
    if (/^#{2,4}\s/.test(block)) return `<h4>${renderInline(block.replace(/^#{2,4}\s+/, ''))}</h4>`;
    const lines = block.split('\n');
    if (lines.every(line => /^[-*]\s+/.test(line))) return `<ul>${lines.map(line => `<li>${renderInline(line.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
    return `<p>${renderInline(block).replace(/\n/g, '<br>')}</p>`;
  }).join('');
}
