/* ============================================================
   ORYXEN LABS — render.js
   Carga datos JSON y renderiza contenido dinámicamente
   ============================================================ */

(async function () {
  'use strict';

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function safeUrl(url) {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return url;
    } catch (_) {}
    return '#';
  }

  async function loadData() {
    try {
      const [projects, stack] = await Promise.all([
        fetch('data/projects.json').then(r => r.json()),
        fetch('data/stack.json').then(r => r.json())
      ]);
      return { projects, stack };
    } catch (err) {
      console.error('Error loading data:', err);
      return null;
    }
  }

  const FALLBACK_MSG = '<p style="color:var(--text-3);text-align:center;padding:2rem 1rem;font-size:.9rem">Unable to load content — please refresh the page.</p>';

  const data = await loadData();
  if (!data) {
    document.querySelectorAll('.products__grid, .repo-grid, .stack__grid').forEach(el => {
      el.innerHTML = FALLBACK_MSG;
    });
    return;
  }

  function observeNewReveals(container) {
    container.querySelectorAll('[data-reveal]').forEach(el => {
      if (window.__revealIO) {
        window.__revealIO.observe(el);
      } else {
        el.classList.add('revealed');
      }
    });
  }

  function renderProducts() {
    const container = document.querySelector('.products__grid');
    if (!container) return;

    container.innerHTML = data.projects.products.map((product, idx) => `
      <article class="product-card" data-reveal data-delay="${idx + 1}" ${product.disabled ? 'style="opacity:.7"' : ''} ${product.disabled ? `aria-label="${escapeHtml(product.ariaLabel)}"` : ''}>
        <span class="product-card__status status--${product.status === 'Live' ? 'live' : 'coming'}">${escapeHtml(product.status)}</span>
        <span class="product-card__icon" aria-hidden="true">${escapeHtml(product.icon)}</span>
        <h3 class="product-card__title">${escapeHtml(product.title)}</h3>
        <p class="product-card__desc">${escapeHtml(product.description)}</p>
        <div class="product-card__tags">
          ${(product.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
        ${product.url ? `
          <a href="${escapeHtml(safeUrl(product.url))}" target="_blank" rel="noopener noreferrer" class="product-card__link" id="link-${escapeHtml(product.id)}" aria-label="${escapeHtml(product.ariaLabel)}">
            Visit Project
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        ` : `
          <span class="product-card__link" style="color:var(--text-3);cursor:default" aria-hidden="true">In preparation…</span>
        `}
      </article>
    `).join('');
    observeNewReveals(container);
  }

  function renderRepositories() {
    const container = document.querySelector('.repo-grid');
    if (!container) return;

    container.innerHTML = data.projects.repositories.map((repo, idx) => `
      <a href="${escapeHtml(safeUrl(repo.url))}" target="_blank" rel="noopener noreferrer" class="repo-card${repo.comingSoon ? ' repo-card--soon' : ''}" data-reveal data-delay="${idx + 1}" id="repo-${escapeHtml(repo.id)}">
        <div class="repo-card__header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            ${getRepoIcon(repo.icon)}
          </svg>
          <span class="repo-card__name">${escapeHtml(repo.name)}</span>
        </div>
        <p class="repo-card__desc">${escapeHtml(repo.description)}</p>
        <div class="repo-card__meta">
          <span class="repo-lang"><span class="lang-dot ${escapeHtml(repo.languageClass)}"></span>${escapeHtml(repo.language)}</span>
          <span class="repo-stars">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            ${repo.comingSoon ? 'Soon' : 'Public'}
          </span>
        </div>
      </a>
    `).join('');
    observeNewReveals(container);
  }

  function getRepoIcon(type) {
    const icons = {
      'file': '<path d="M3 3h18v18H3z" />',
      'lock': '<rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />',
      'heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />',
      'play': '<polygon points="5 3 19 12 5 21 5 3" />'
    };
    return icons[type] || icons['file'];
  }

  function renderStack() {
    const container = document.querySelector('.stack__grid');
    if (!container) return;

    container.innerHTML = data.stack.categories.map((cat, idx) => `
      <div class="stack-cat" data-reveal data-delay="${idx + 1}">
        <span class="stack-cat__label">${escapeHtml(cat.label)}</span>
        <div class="stack-items">
          ${cat.items.map(item => `<div class="stack-item"><span class="stack-item-emoji">${escapeHtml(item.emoji)}</span> ${escapeHtml(item.text)}</div>`).join('')}
        </div>
      </div>
    `).join('');
    observeNewReveals(container);
  }

  renderProducts();
  renderRepositories();
  renderStack();
})();
