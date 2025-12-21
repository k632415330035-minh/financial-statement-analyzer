// Sidebar & UI utilities
import { save, load } from './utils/helpers.js';

export function bindSidebar() {
  const btn = document.getElementById('toggleSidebar');
  if (!btn) return; // Exit if toggle button doesn't exist

  const stored = load('sidebarCollapsed', false);
  applyCollapsedState(stored);
  btn.addEventListener('click', () => {
    const next = !load('sidebarCollapsed', false);
    save('sidebarCollapsed', next);
    applyCollapsedState(next);
  });
}

function applyCollapsedState(c) {
  const root = document.getElementById('layoutRoot');
  root.dataset.collapsed = String(c);
  const toggleBtn = document.getElementById('toggleSidebar');
  if (toggleBtn) toggleBtn.setAttribute('aria-pressed', String(c));
}

export function bindLogout() {
  document.getElementById('logoutLink')?.addEventListener('click', async e => {
    e.preventDefault();
    if (!confirm('Bạn có chắc muốn đăng xuất?')) return;
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch { }
    window.location.href = '/index.html';
  });
}
