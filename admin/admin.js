const ADMIN_PASSWORD = 'oryxen2024';
const DATA_URL = '../data/projects.json';

let currentData = { products: [], repositories: [] };
let tempTags = [];
let isLoggedIn = false;

function loginAdmin() {
  const password = document.getElementById('password').value;
  if (password === ADMIN_PASSWORD) {
    isLoggedIn = true;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadData();
  } else {
    showStatus('Invalid password', 'error');
  }
}

function logoutAdmin() {
  if (confirm('Logout?')) {
    isLoggedIn = false;
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
  }
}

document.getElementById('login-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  loginAdmin();
});

async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    currentData = await res.json();
    renderProductsList();
    renderRepositoriesList();
    showStatus('Data loaded', 'success');
  } catch (err) {
    showStatus('Error: ' + err.message, 'error');
  }
}

async function saveData() {
  try {
    localStorage.setItem('oryxen_projects_data', JSON.stringify(currentData));
    showStatus('Data saved (localStorage)', 'success');
  } catch (err) {
    showStatus('Error: ' + err.message, 'error');
  }
}

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
  if (idx >= 0) {
    currentData.products[idx] = product;
  } else {
    currentData.products.push(product);
  }

  saveData();
  document.getElementById('prod-title').value = '';
  document.getElementById('prod-id').value = '';
  document.getElementById('prod-icon').value = '';
  document.getElementById('prod-desc').value = '';
  document.getElementById('prod-url').value = '';
  tempTags = [];
  renderTags();
  toggleForm('add-product');
  renderProductsList();
  showStatus('Product saved!', 'success');
}

function deleteProduct(id) {
  if (confirm('Delete?')) {
    currentData.products = currentData.products.filter(p => p.id !== id);
    saveData();
    renderProductsList();
    showStatus('Deleted', 'success');
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
      <p style="font-size:0.85rem;color:rgba(242,242,248,0.5)">Status: ${p.status} | Tags: ${p.tags.join(', ') || 'None'}</p>
      <div class="card-actions">
        <button class="secondary" onclick="alert('Edit coming soon')">Edit</button>
        <button class="danger" onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

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

  const repo = { id, icon, name, description: desc, language: lang, languageClass: `lang-${lang.toLowerCase()}`, url };
  const idx = currentData.repositories.findIndex(r => r.id === id);
  if (idx >= 0) currentData.repositories[idx] = repo;
  else currentData.repositories.push(repo);

  saveData();
  toggleForm('add-repo');
  renderRepositoriesList();
  showStatus('Repository saved!', 'success');
}

function deleteRepository(id) {
  if (confirm('Delete?')) {
    currentData.repositories = currentData.repositories.filter(r => r.id !== id);
    saveData();
    renderRepositoriesList();
    showStatus('Deleted', 'success');
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
        <button class="secondary" onclick="alert('Edit coming soon')">Edit</button>
        <button class="danger" onclick="deleteRepository('${r.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

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

function reloadData() {
  loadData();
}
