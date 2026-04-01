/* ===== StudyShare — Pure JS ===== */

// ——— Auth helpers ———
const AUTH_KEY = 'studyshare_user';

const USERS = {
  'user@test.com':       { password: '1234', role: 'user',       name: 'User123' },
  'admin@test.com':      { password: '1234', role: 'admin',      name: 'Anonymous' },
  'superadmin@test.com': { password: '1234', role: 'superadmin', name: 'XYZ' },
};

const ROLE_DASHBOARDS = {
  user: 'dashboard.html',
  admin: 'admin.html',
  superadmin: 'superadmin.html',
};

function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}
function setUser(u) { localStorage.setItem(AUTH_KEY, JSON.stringify(u)); }
function logout() { localStorage.removeItem(AUTH_KEY); window.location.href = 'index.html'; }

function getHomePage() {
  const u = getUser();
  if (!u) return 'index.html';
  return ROLE_DASHBOARDS[u.role] || 'index.html';
}

function navigateHome(e) {
  if (e) e.preventDefault();
  window.location.href = getHomePage();
}

function navigateManageContent(e) {
  if (e) e.preventDefault();
  const u = getUser();
  if (!u) { window.location.href = 'login.html'; return; }
  if (u.role === 'superadmin') window.location.href = 'superadmin.html';
  else if (u.role === 'admin') window.location.href = 'admin.html';
  else window.location.href = 'browse.html';
}

function requireAuth(allowedRoles) {
  const u = getUser();
  if (!u) { window.location.href = 'login.html'; return null; }
  if (allowedRoles && !allowedRoles.includes(u.role)) {
    window.location.href = ROLE_DASHBOARDS[u.role] || 'login.html';
    return null;
  }
  return u;
}

// ——— Toast ———
function showToast(title, desc) {
  let t = document.getElementById('toast-container');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast-container';
    t.className = 'toast-container';
    t.innerHTML = '<div class="toast-content"><div class="toast-title"></div><div class="toast-desc"></div></div>';
    document.body.appendChild(t);
  }
  t.querySelector('.toast-title').textContent = title;
  t.querySelector('.toast-desc').textContent = desc || '';
  t.classList.remove('toast-destructive');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function showToastError(title, desc) {
  showToast(title, desc);
  const t = document.getElementById('toast-container');
  if (t) t.classList.add('toast-destructive');
}

// ——— Navbar ———
function initNavbar() {
  const user = getUser();
  const authEl = document.getElementById('nav-auth');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // Make logo role-aware
  const brand = document.querySelector('.navbar-brand');
  if (brand) {
    brand.setAttribute('href', '#');
    brand.addEventListener('click', function(e) { navigateHome(e); });
  }

  // Update nav links based on role
  const navLinks = document.getElementById('nav-links');
  if (navLinks && user) {
    if (user.role === 'admin') {
      navLinks.innerHTML = '<a href="admin.html">Dashboard</a><a href="#" onclick="navigateManageContent(event)">Manage Content</a>';
    } else if (user.role === 'superadmin') {
      navLinks.innerHTML = '<a href="superadmin.html">Dashboard</a><a href="#" onclick="navigateManageContent(event)">Manage Users</a>';
    } else {
      navLinks.innerHTML = '<a href="index.html">Home</a><a href="browse.html">Browse</a><a href="upload.html">Upload</a><a href="dashboard.html">Dashboard</a>';
    }
  }

  if (authEl && user) {
    authEl.innerHTML = `
      <span class="nav-user-info">${user.name} <span class="role-badge">(${user.role})</span></span>
      <button onclick="logout()" class="btn btn-ghost btn-sm" style="gap:0.25rem">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Logout
      </button>
    `;
  }

  // Highlight current page
  if (navLinks) {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href !== '#' && href === current) a.classList.add('active');
    });
  }

  // Hamburger
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const showing = mobileMenu.classList.toggle('show');
      if (showing && !mobileMenu.dataset.init) {
        mobileMenu.dataset.init = '1';
        const links = document.getElementById('nav-links');
        const auth = document.getElementById('nav-auth');
        if (links) { const c = links.cloneNode(true); c.style.display = 'flex'; mobileMenu.appendChild(c); }
        if (auth) { const c = auth.cloneNode(true); c.style.display = 'flex'; mobileMenu.appendChild(c); }
      }
    });
  }
}

// ——— Dummy Data ———
const materials = [
  { id:1,  title:"Introduction to Data Structures",           author:"User123",   category:"Computer Science", type:"PDF",  downloads:1240, rating:4.8 },
  { id:2,  title:"Organic Chemistry Notes — Semester 2",      author:"Anonymous", category:"Chemistry",        type:"DOCX", downloads:890,  rating:4.5 },
  { id:3,  title:"Calculus III Complete Guide",                author:"XYZ",       category:"Mathematics",      type:"PDF",  downloads:2100, rating:4.9 },
  { id:4,  title:"World History: Modern Era Presentation",    author:"User456",   category:"History",          type:"PPT",  downloads:560,  rating:4.2 },
  { id:5,  title:"Machine Learning Fundamentals",             author:"Anonymous", category:"Computer Science", type:"PDF",  downloads:3200, rating:4.7 },
  { id:6,  title:"Biology Lab Manual — Genetics",             author:"User789",   category:"Biology",          type:"PDF",  downloads:780,  rating:4.4 },
  { id:7,  title:"Microeconomics Lecture Notes",               author:"XYZ",       category:"Economics",        type:"DOCX", downloads:1050, rating:4.6 },
  { id:8,  title:"English Literature — Shakespeare Analysis", author:"User123",   category:"Literature",       type:"PDF",  downloads:430,  rating:4.1 },
  { id:9,  title:"Physics — Quantum Mechanics Introduction",  author:"Anonymous", category:"Physics",          type:"PPT",  downloads:1680, rating:4.8 },
  { id:10, title:"Digital Marketing Handbook",                 author:"User456",   category:"Business",         type:"PDF",  downloads:920,  rating:4.3 },
  { id:11, title:"Statistics for Data Science",                author:"XYZ",       category:"Mathematics",      type:"PDF",  downloads:1450, rating:4.7 },
  { id:12, title:"Environmental Science Study Guide",          author:"User789",   category:"Environmental",    type:"DOCX", downloads:670,  rating:4.0 },
];

const categories = ["All","Computer Science","Mathematics","Chemistry","Physics","Biology","History","Economics","Literature","Business","Environmental"];

const dummyUsers = [
  { name:"User123",   email:"user1@example.com", uploads:15, downloads:320, joined:"2024-01-15" },
  { name:"Anonymous", email:"user2@example.com", uploads:8,  downloads:180, joined:"2024-03-22" },
  { name:"XYZ",       email:"user3@example.com", uploads:22, downloads:560, joined:"2023-11-01" },
  { name:"User456",   email:"user4@example.com", uploads:3,  downloads:90,  joined:"2024-06-10" },
  { name:"User789",   email:"user5@example.com", uploads:12, downloads:410, joined:"2024-02-28" },
];

const typeIcons = { PDF:'PDF', DOCX:'DOCX', PPT:'PPT' };

function renderCard(m) {
  return `<a href="#" class="material-card" onclick="event.preventDefault()">
    <div class="card-top">
      <span class="card-type-icon" style="font-size:0.75rem;font-weight:600;color:var(--primary);text-transform:uppercase">${typeIcons[m.type]||m.type}</span>
      <span class="card-badge">${m.category}</span>
    </div>
    <div class="card-title">${m.title}</div>
    <p class="card-author">by ${m.author}</p>
    <div class="card-meta">
      <span class="card-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        ${m.downloads}
      </span>
      <span class="card-meta-item">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" style="opacity:0.6;color:var(--primary)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        ${m.rating.toFixed(1)}
      </span>
      <span class="card-meta-item"><span class="type-label">${m.type}</span></span>
    </div>
  </a>`;
}

// ——— Page initializers ———

function initHome() {
  const grid = document.getElementById('featured-grid');
  if (grid) grid.innerHTML = materials.slice(0, 8).map(renderCard).join('');
  const catWrap = document.getElementById('category-pills');
  if (catWrap) catWrap.innerHTML = categories.filter(c=>c!=='All').map(c =>
    `<a href="browse.html?category=${encodeURIComponent(c)}" class="category-pill">${c}</a>`
  ).join('');
}

function initLogin() {
  const form = document.getElementById('login-form');
  const roleButtons = document.querySelectorAll('.role-toggle button');
  let selectedRole = 'user';

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRole = btn.dataset.role;
      const labels = { user:'User', admin:'Admin', superadmin:'Super Admin' };
      document.getElementById('submit-btn').textContent = `Sign in as ${labels[selectedRole]}`;
    });
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const account = USERS[email];
    if (account && account.password === password && account.role === selectedRole) {
      setUser({ email, role: selectedRole, name: account.name });
      showToast('Welcome back!', `Logged in as ${selectedRole}`);
      setTimeout(() => window.location.href = ROLE_DASHBOARDS[selectedRole], 600);
    } else {
      showToastError('Login failed', 'Invalid credentials. Please try again.');
    }
  });
}

function initSignup() {
  const form = document.getElementById('signup-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Account created!', 'Redirecting to login...');
    setTimeout(() => window.location.href = 'login.html', 1200);
  });
}

function initBrowse() {
  const grid = document.getElementById('browse-grid');
  const filterBar = document.getElementById('filter-bar');
  const searchInput = document.getElementById('browse-search');
  const countEl = document.getElementById('results-count');
  const noResults = document.getElementById('no-results');
  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get('category') || 'All';

  function render() {
    const query = (searchInput?.value || '').toLowerCase();
    const filtered = materials.filter(m => {
      const matchQ = m.title.toLowerCase().includes(query) || m.author.toLowerCase().includes(query);
      const matchC = activeCategory === 'All' || m.category === activeCategory;
      return matchQ && matchC;
    });
    if (grid) {
      grid.innerHTML = filtered.map(renderCard).join('');
      grid.style.display = filtered.length ? '' : 'none';
    }
    if (noResults) noResults.style.display = filtered.length ? 'none' : 'block';
    if (countEl) countEl.textContent = `${filtered.length} result${filtered.length!==1?'s':''} found`;
    filterBar?.querySelectorAll('.category-pill').forEach(p => p.classList.toggle('active', p.textContent === activeCategory));
  }

  if (filterBar) {
    filterBar.innerHTML = categories.map(c => `<button class="category-pill${c===activeCategory?' active':''}">${c}</button>`).join('');
    filterBar.addEventListener('click', e => {
      if (e.target.classList.contains('category-pill')) { activeCategory = e.target.textContent; render(); }
    });
  }
  searchInput?.addEventListener('input', render);
  render();
}

function initDashboard() {
  const user = requireAuth(['user']);
  if (!user) return;
  const nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.textContent = user.name || 'User123';
  // Populate bookmarked grid
  const grid = document.getElementById('bookmarked-grid');
  if (grid) grid.innerHTML = materials.slice(0, 6).map(renderCard).join('');
}

function initAdmin() {
  const user = requireAuth(['admin','superadmin']);
  if (!user) return;
  const nameEl = document.getElementById('admin-name');
  if (nameEl) nameEl.textContent = user.name || 'Anonymous';

  // Pending
  const pendingTbody = document.getElementById('pending-tbody');
  if (pendingTbody) pendingTbody.innerHTML = materials.slice(0,5).map(m => `<tr>
    <td>${m.title}</td><td style="color:var(--muted-foreground)">${m.author}</td><td style="color:var(--muted-foreground)">${m.category}</td>
    <td><div class="actions-cell">
      <button class="btn btn-icon btn-ghost" style="color:var(--primary)" title="View"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
      <button class="btn btn-icon btn-ghost" style="color:var(--primary)" title="Approve" onclick="this.closest('tr').remove();showToast('Approved','')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></button>
      <button class="btn btn-icon btn-ghost" style="color:var(--destructive)" title="Reject" onclick="this.closest('tr').remove();showToast('Rejected','')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div></td>
  </tr>`).join('');

  // Content
  const contentTbody = document.getElementById('content-tbody');
  if (contentTbody) contentTbody.innerHTML = materials.map(m => `<tr>
    <td>${m.title}</td><td style="color:var(--muted-foreground)">${m.author}</td><td style="color:var(--muted-foreground)">${m.downloads}</td><td style="color:var(--muted-foreground)">${m.rating}</td>
    <td><div class="actions-cell">
      <button class="btn btn-sm btn-outline">Edit</button>
      <button class="btn btn-sm btn-destructive" onclick="this.closest('tr').remove();showToast('Removed','')">Remove</button>
    </div></td>
  </tr>`).join('');

  // Users
  const usersTbody = document.getElementById('users-tbody');
  if (usersTbody) usersTbody.innerHTML = dummyUsers.map(u => `<tr>
    <td>${u.name}</td><td style="color:var(--muted-foreground)">${u.email}</td><td style="color:var(--muted-foreground)">${u.uploads}</td><td style="color:var(--muted-foreground)">${u.joined}</td>
  </tr>`).join('');
}

function initSuperAdmin() {
  const user = requireAuth(['superadmin']);
  if (!user) return;
  const nameEl = document.getElementById('sa-name');
  if (nameEl) nameEl.textContent = user.name || 'Anonymous';

  // Manage users table
  const usersTbody = document.getElementById('sa-users-tbody');
  if (usersTbody) usersTbody.innerHTML = dummyUsers.map(u => `<tr>
    <td>${u.name}</td><td style="color:var(--muted-foreground)">${u.email}</td><td style="color:var(--muted-foreground)">${u.uploads}</td><td style="color:var(--muted-foreground)">${u.downloads}</td><td style="color:var(--muted-foreground)">${u.joined}</td>
    <td><div class="actions-cell">
      <button class="btn btn-sm btn-outline">Edit</button>
      <button class="btn btn-sm btn-destructive" onclick="this.closest('tr').remove();showToast('User removed','')">Remove</button>
    </div></td>
  </tr>`).join('');
}

function initUpload() {
  const user = requireAuth();
  if (!user) return;
  const form = document.getElementById('upload-form');
  const zone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');

  zone?.addEventListener('click', () => fileInput?.click());
  zone?.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-active'); });
  zone?.addEventListener('dragleave', () => zone.classList.remove('drag-active'));
  zone?.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag-active'); });
  fileInput?.addEventListener('change', () => {
    if (fileInput.files[0]) {
      zone.querySelector('p').textContent = `Selected: ${fileInput.files[0].name}`;
    }
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Upload successful!', 'Your material is now available.');
    form.reset();
  });
}

// ——— Tabs ———
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabBar => {
    const tabs = tabBar.querySelectorAll('.tab');
    const parent = tabBar.parentElement;
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = parent.querySelector(`#${tab.dataset.tab}`);
        if (target) target.classList.add('active');
      });
    });
  });
}

// Helper for super admin quick actions
function switchTab(tabId) {
  const parent = document.querySelector('.tabs')?.parentElement;
  if (!parent) return;
  parent.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabId);
  });
  parent.querySelectorAll('.tab-content').forEach(c => {
    c.classList.toggle('active', c.id === tabId);
  });
}

// ——— Boot ———
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTabs();

  const page = document.body.dataset.page;
  if (page === 'home')       initHome();
  if (page === 'login')      initLogin();
  if (page === 'signup')     initSignup();
  if (page === 'browse')     initBrowse();
  if (page === 'dashboard')  initDashboard();
  if (page === 'admin')      initAdmin();
  if (page === 'superadmin') initSuperAdmin();
  if (page === 'upload')     initUpload();
});
