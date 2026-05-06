/* ============================================================
   ORYXEN LABS — render.js
   Carga datos JSON y renderiza contenido dinámicamente
   ============================================================ */

(async function () {
  'use strict';

  async function loadData() {
    try {
      const [projects, stack, config] = await Promise.all([
        fetch('data/projects.json').then(r => r.json()),
        fetch('data/stack.json').then(r => r.json()),
        fetch('data/config.json').then(r => r.json())
      ]);
      return { projects, stack, config };
    } catch (err) {
      console.error('Error cargando datos:', err);
      return null;
    }
  }

  const data = await loadData();
  if (!data) {
    console.error('No se pudieron cargar los datos.');
    return;
  }

  function renderProducts() {
    const container = document.querySelector('.products__grid');
    if (!container) return;

    container.innerHTML = data.projects.products.map((product, idx) => `
      <article class="product-card" data-reveal data-delay="${idx + 1}" ${product.disabled ? 'style="opacity:.7"' : ''} ${product.disabled ? 'aria-label="' + product.ariaLabel + '"' : ''}>
        <span class="product-card__status status--${product.status === 'Live' ? 'live' : 'coming'}">${product.status}</span>
        <span class="product-card__icon" aria-hidden="true">${product.icon}</span>
        <h3 class="product-card__title">${product.title}</h3>
        <p class="product-card__desc">${product.description}</p>
        <div class="product-card__tags">
          ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        ${product.url ? `
          <a href="${product.url}" target="_blank" rel="noopener noreferrer" class="product-card__link" id="link-${product.id}" aria-label="${product.ariaLabel}">
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
  }

  function renderRepositories() {
    const container = document.querySelector('.repo-grid');
    if (!container) return;

    container.innerHTML = data.projects.repositories.map((repo, idx) => `
      <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="repo-card" data-reveal data-delay="${idx + 1}" id="repo-${repo.id}">
        <div class="repo-card__header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            ${getRepoIcon(repo.icon)}
          </svg>
          <span class="repo-card__name">${repo.name}</span>
        </div>
        <p class="repo-card__desc">${repo.description}</p>
        <div class="repo-card__meta">
          <span class="repo-lang"><span class="lang-dot ${repo.languageClass}"></span>${repo.language}</span>
          <span class="repo-stars">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Public
          </span>
        </div>
      </a>
    `).join('');
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
        <span class="stack-cat__label">${cat.label}</span>
        <div class="stack-items">
          ${cat.items.map(item => `<div class="stack-item"><span class="stack-item-emoji">${item.emoji}</span> ${item.text}</div>`).join('')}
        </div>
      </div>
    `).join('');
  }

  renderProducts();
  renderRepositories();
  renderStack();

  window.__ORYXEN_DATA = data;
})();
