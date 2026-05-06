/* ============================================================
   ORYXEN LABS — Admin Panel
   ============================================================ */

const DEFAULT_PASSWORD = 'oryxen2024';
const DATA_URL = '../data/projects.json';

let currentData = { products: [], repositories: [] };
let tempTags = [];
let isLoggedIn = false;

/* ── Storage Helpers ── */
function getPassword() {
  return localStorage.getItem('oryxen_admin_password') || DEFAULT_PASSWORD;
}

function getGithubConfig() {
  return JSON.parse(localStorage.getItem('oryxen_github_config') || '{}');
}

function saveGithubConfigData(config) {
  localStorage.setItem('oryxen_github_config', JSON.stringify(config));
}

/* ── AUTH ── */
function loginAdmin() {
  const password = document.getElementById('password').value;
  if (password === getPassword()) {
    isLoggedIn = true;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadData();
    loadGithubConfig();
  } else {
    showStatus('Invalid password', 'error');
  }
}

function logoutAdmin() {
  if (confirm('Logout?')) {
    isLoggedIn = false;
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('password').value = '';
  }
}

document.getElementById('login-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  loginAdmin();
});

/* ── PASSWORD CHANGE ── */
function changePassword() {
  const current = document.getElementById('current-password').value;
  const newPwd = document.getElementById('new-password').value;
  const confirm = document.getElementById('confirm-password').value;

  if (current !== getPassword()) {
    showStatus('Current password is incorrect', 'error');
    return;
  }
  if (newPwd.length < 6) {
    showStatus('New password must be at least 6 characters', 'error');
    return;
  }
  if (newPwd !== confirm) {
    showStatus('Passwords do not match', 'error');
    return;
  }

  localStorage.setItem('oryxen_admin_password', newPwd);
  document.getElementById('current-password').value = '';
  document.getElementById('new-password').value = '';
  document.getElementById('confirm-password').value = '';
  showStatus('Password updated successfully!', 'success');
}

/* ── GITHUB CONFIG ── */
function loadGithubConfig() {
  const config = getGithubConfig();
  document.getElementById('gh-owner').value = config.owner || '';
  document.getElementById('gh-repo').value = config.repo || '';
  document.getElementById('gh-branch').value = config.branch || 'main';
  document.getElementById('gh-token').value = config.token || '';
}

function saveGithubConfig() {
  const config = {
    owner: document.getElementById('gh-owner').value.trim(),
    repo: document.getElementById('gh-repo').value.trim(),
    branch: document.getElementById('gh-branch').value.trim() || 'main',
    token: document.getElementById('gh-token').value.trim()
  };

  if (!config.owner || !config.repo || !config.token) {
    showStatus('Fill all GitHub fields', 'error');
    return;
  }

  saveGithubConfigData(config);
  showStatus('GitHub configuration saved', 'success');
}

async function testGithubConnection() {
  const config = getGithubConfig();
  const statusEl = document.getElementById('gh-test-status');

  if (!config.owner || !config.repo || !config.token) {
    statusEl.textContent = '❌ Save configuration first';
    statusEl.style.color = '#ef4444';
    return;
  }

  statusEl.textContent = '⏳ Testing connection...';
  statusEl.style.color = 'rgba(242,242,248,0.65)';

  try {
    const res = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`, {
      headers: { 'Authorization': `Bearer ${config.token}`, 'Accept': 'application/vnd.github+json' }
    });

    if (res.ok) {
      const repo = await res.json();
      statusEl.textContent = `✅ Connected to ${repo.full_name} (${repo.default_branch})`;
      statusEl.style.color = '#34d399';
    } else if (res.status === 401) {
      statusEl.textContent = '❌ Invalid token (401 Unauthorized)';
      statusEl.style.color = '#ef4444';
    } else if (res.status === 404) {
      statusEl.textContent = '❌ Repository not found (check owner/repo or token permissions)';
      statusEl.style.color = '#ef4444';
    } else {
      statusEl.textContent = `❌ Error: ${res.status} ${res.statusText}`;
      statusEl.style.color = '#ef4444';
    }
  } catch (err) {
    statusEl.textContent = '❌ Network error: ' + err.message;
    statusEl.style.color = '#ef4444';
  }
}

/* ── GITHUB SYNC ── */
async function syncToGithub() {
  const config = getGithubConfig();
  const statusEl = document.getElementById('sync-status');
  const btn = document.getElementById('sync-btn');

  if (!config.owner || !config.repo || !config.token) {
    statusEl.textContent = '❌ Configure GitHub in Settings tab first';
    statusEl.style.color = '#ef4444';
    return;
  }

  if (!confirm(`Push current data to ${config.owner}/${config.repo} (${config.branch})?`)) {
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Syncing...';
  statusEl.textContent = '⏳ Fetching current file SHA...';
  statusEl.style.color = 'rgba(242,242,248,0.65)';

  const path = 'data/projects.json';
  const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
  const headers = {
    'Authorization': `Bearer ${config.token}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json'
  };

  try {
    // 1. Get current file SHA (required for update)
    let sha = null;
    const getRes = await fetch(`${apiUrl}?ref=${config.branch}`, { headers });
    if (getRes.ok) {
      const fileInfo = await getRes.json();
      sha = fileInfo.sha;
    } else if (getRes.status !== 404) {
      throw new Error(`GET failed: ${getRes.status} ${getRes.statusText}`);
    }

    // 2. Encode content to base64 (UTF-8 safe)
    const jsonContent = JSON.stringify(currentData, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(jsonContent)));

    statusEl.textContent = '⏳ Pushing to GitHub...';

    // 3. PUT file
    const timestamp = new Date().toISOString().split('T')[0];
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `chore(admin): update projects data — ${timestamp}`,
        content: base64Content,
        branch: config.branch,
        ...(sha ? { sha } : {})
      })
    });

    if (putRes.ok) {
      const result = await putRes.json();
      statusEl.innerHTML = `✅ Synced! <a href="${result.commit.html_url}" target="_blank" style="color:#8b5cf6;text-decoration:underline;">View commit</a>`;
      statusEl.style.color = '#34d399';
      showStatus('Successfully pushed to GitHub!', 'success');
    } else {
      const err = await putRes.json();
      throw new Error(err.message || `PUT failed: ${putRes.status}`);
    }
  } catch (err) {
    statusEl.textContent = `❌ Sync failed: ${err.message}`;
    statusEl.style.color = '#ef4444';
    showStatus('Sync failed: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Push to GitHub';
  }
}

/* ── DATA LOAD ── */
async function loadData() {
  try {
    // Try localStorage first (recent local edits)
    const local = localStorage.getItem('oryxen_projects_data');
    if (local) {
      currentData = JSON.parse(local);
    } else {
      const res = await fetch(DATA_URL);
      currentData = await res.json();
    }
    renderProductsList();
    renderRepositoriesList();
    showStatus('Data loaded', 'success');
  } catch (err) {
    showStatus('Error: ' + err.message, 'error');
  }
}

function saveData() {
  try {
    localStorage.setItem('oryxen_projects_data', JSON.stringify(currentData));
    showStatus('Saved locally (use Sync to push to GitHub)', 'success');
  } catch (err) {
    showStatus('Error: ' + err.message, 'error');
  }
}

function reloadData() {
  if (confirm('Discard local changes and reload from server?')) {
    localStorage.removeItem('oryxen_projects_data');
    loadData();
  }
}

function resetAllData() {
  if (confirm('⚠️ Clear ALL local data including password and GitHub config? This cannot be undone.')) {
    if (confirm('Are you really sure?')) {
      localStorage.clear();
      alert('Local data cleared. Reloading...');
      location.reload();
    }
  }
}

/* ── UI ── */
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  event.target.classList.add('active');
}

function toggleForm(formId) {
  const form = document.getElementById(formId + '-form');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function showStatus(msg, type) {
  const el = document.getElementById('status-msg');
  el.textContent = msg;
  el.className = `status-msg show ${type}`;
  setTimeout(() => el.classList.remove('show'), 5000);
}

/* ── TAGS ── */
function addTag(type) {
  const input = document.getElementById(`${type}-tag-input`);
  const tag = input.value.trim();
  if (tag && !tempTags.includes(tag)) {
    tempTags.push(tag);
    renderTags(type);
    input.value = '';
  }
}

function removeTag(index) {
  tempTags.splice(index, 1);
  renderTags('product');
}

function renderTags(type = 'product') {
  const container = document.getElementById(`${type}-tags-list`);
  if (!container) return;
  container.innerHTML = tempTags.map((tag, idx) => `
    <div class="tag">${tag}<button type="button" onclick="removeTag(${idx})">×</button></div>
  `).join('');
}

/* ── PRODUCTS ── */
function saveProduct() {
  const title = document.getElementById('prod-title').value.trim();
  const id = document.getElementById('prod-id').value.trim();
  const status = document.getElementById('prod-status').value;
  const icon = document.getElementById('prod-icon').value.trim();
  const desc = document.getElementById('prod-desc').value.trim();
  const url = document.getElementById('prod-url').value.trim();

  if (!title || !id || !icon || !desc) {
    showStatus('Fill required fields', 'error');
    return;
  }

  const product = {
    id, status, icon, title,
    description: desc,
    tags: tempTags,
    url: url || null,
    ariaLabel: document.getElementById('prod-label').value.trim() || `Visit ${title}`,
    disabled: status === 'Coming Soon'
  };

  const idx = currentData.products.findIndex(p => p.id === id);
  if (idx >= 0) currentData.products[idx] = product;
  else currentData.products.push(product);

  saveData();
  ['prod-title', 'prod-id', 'prod-icon', 'prod-desc', 'prod-url', 'prod-label'].forEach(i => {
    document.getElementById(i).value = '';
  });
  tempTags = [];
  renderTags();
  toggleForm('add-product');
  renderProductsList();
}

function deleteProduct(id) {
  if (confirm('Delete?')) {
    currentData.products = currentData.products.filter(p => p.id !== id);
    saveData();
    renderProductsList();
  }
}

function renderProductsList() {
  const container = document.getElementById('products-list');
  if (!currentData.products.length) {
    container.innerHTML = '<p>No products yet</p>';
    return;
  }
  container.innerHTML = currentData.products.map(p => `
    <div class="card">
      <h3>${p.icon} ${p.title}</h3>
      <p style="color:rgba(242,242,248,0.65);margin-bottom:0.5rem">${p.description}</p>
      <p style="font-size:0.85rem;color:rgba(242,242,248,0.5)">Status: ${p.status} | Tags: ${(p.tags||[]).join(', ') || 'None'}</p>
      <div class="card-actions">
        <button class="danger" onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

/* ── REPOS ── */
function saveRepository() {
  const name = document.getElementById('repo-name').value.trim();
  const id = document.getElementById('repo-id').value.trim();
  const desc = document.getElementById('repo-desc').value.trim();
  const lang = document.getElementById('repo-language').value.trim();
  const icon = document.getElementById('repo-icon').value;
  const url = document.getElementById('repo-url').value.trim();

  if (!name || !id || !desc || !lang || !url) {
    showStatus('Fill all fields', 'error');
    return;
  }

  const repo = { id, icon, name, description: desc, language: lang, languageClass: `lang-${lang.toLowerCase().split(/[\s/]/)[0]}`, url };
  const idx = currentData.repositories.findIndex(r => r.id === id);
  if (idx >= 0) currentData.repositories[idx] = repo;
  else currentData.repositories.push(repo);

  saveData();
  ['repo-name', 'repo-id', 'repo-desc', 'repo-language', 'repo-url'].forEach(i => {
    document.getElementById(i).value = '';
  });
  toggleForm('add-repo');
  renderRepositoriesList();
}

function deleteRepository(id) {
  if (confirm('Delete?')) {
    currentData.repositories = currentData.repositories.filter(r => r.id !== id);
    saveData();
    renderRepositoriesList();
  }
}

function renderRepositoriesList() {
  const container = document.getElementById('repos-list');
  if (!currentData.repositories.length) {
    container.innerHTML = '<p>No repositories yet</p>';
    return;
  }
  container.innerHTML = currentData.repositories.map(r => `
    <div class="card">
      <h3>${r.name}</h3>
      <p style="color:rgba(242,242,248,0.65);margin-bottom:0.5rem">${r.description}</p>
      <p style="font-size:0.85rem">Language: ${r.language}</p>
      <div class="card-actions">
        <button class="danger" onclick="deleteRepository('${r.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

/* ── IMPORT/EXPORT ── */
function exportData() {
  const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `oryxen-data-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  showStatus('Exported!', 'success');
}

function importData() {
  const file = document.getElementById('import-file').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      currentData = JSON.parse(e.target.result);
      saveData();
      renderProductsList();
      renderRepositoriesList();
      showStatus('Imported!', 'success');
    } catch (err) {
      showStatus('Invalid JSON', 'error');
    }
  };
  reader.readAsText(file);
}
