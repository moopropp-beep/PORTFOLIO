import { flagshipCase, ideas } from './ideas-data.js';
import { extractScriptSections, renderScriptSection } from './case-script.js';

const contactBlock = document.querySelector('#about .about-copy p:last-child');
if (contactBlock) contactBlock.innerHTML = 'CONTACT<br><a href="mailto:moopropp@gmail.com">moopropp@gmail.com</a><br><a href="tel:17686417617">176 8641 7617</a>';

const imageIdeas = ideas.filter(idea => idea.image);
const inspirationIdeas = ideas.filter(idea => !idea.image);
// Image archive keeps the original title hierarchy (the former index < 10 cards); idea-card--new remains reserved for future text variants.
const ideaCount = document.querySelector('.evidence-grid article:last-child strong');
if (ideaCount) ideaCount.textContent = String(ideas.length).padStart(2, '0');

const renderImageIdea = (idea, index) => `
  <article class="idea-card idea-card--legacy" data-idea-id="${idea.id}">
    <div class="idea-card__media has-image" data-asset-slot="idea-${String(index + 1).padStart(2, '0')}"><img src="${idea.image}" alt="《${idea.short}》选题封面" loading="lazy" draggable="false" sizes="(max-width: 760px) 88vw, 720px"></div>
    <div class="idea-card__meta"><p class="idea-card__index">${String(index + 1).padStart(2, '0')} / ${idea.short}</p><p><span>${idea.tier}</span><span>${idea.type}</span></p></div>
    <h3>${idea.title}</h3>
    <dl><div><dt>痛点</dt><dd>${idea.pain}</dd></div><div><dt>形式</dt><dd>${idea.format}</dd></div><div><dt>价值</dt><dd>${idea.value}</dd></div></dl>
  </article>`;

const renderInspiration = (idea, index) => `
  <article class="idea-card idea-card--inspiration" data-idea-id="${idea.id}">
    <div class="idea-card__meta"><p class="idea-card__index">灵感 ${String(index + 1).padStart(2, '0')} / ${idea.short}</p><p><span>${idea.tier}</span><span>${idea.type}</span></p></div>
    <p class="idea-card__question">${idea.title}</p><h3>${idea.short}</h3>
    <dl><div><dt>痛点</dt><dd>${idea.pain}</dd></div><div><dt>形式</dt><dd>${idea.format}</dd></div><div><dt>价值</dt><dd>${idea.value}</dd></div></dl>
  </article>`;

const imageRail = document.querySelector('[data-idea-rail]');
if (imageRail) imageRail.innerHTML = imageIdeas.map(renderImageIdea).join('');
const inspirationRail = document.querySelector('[data-inspiration-rail]');
if (inspirationRail) inspirationRail.innerHTML = inspirationIdeas.map(renderInspiration).join('');

const scriptTargets = [...document.querySelectorAll('[data-script-section]')];
if (scriptTargets.length) {
  fetch(flagshipCase.script)
    .then(response => {
      if (!response.ok) throw new Error(`Script request failed: ${response.status}`);
      return response.text();
    })
    .then(markdown => {
      const sections = extractScriptSections(markdown, flagshipCase.scriptSections);
      for (const target of scriptTargets) {
        target.innerHTML = renderScriptSection(sections[target.dataset.scriptSection] || '');
      }
    })
    .catch(() => {
      for (const target of scriptTargets) target.textContent = '文字稿载入失败，请使用上方“阅读完整文字稿”链接。';
    });
}
