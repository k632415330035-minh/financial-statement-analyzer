// Navigation - Handle routing logic
import { routes } from './router.js';
import { initOverview } from './controllers/overviewController.js';
import { init as initHouseholds } from './controllers/householdsController.js';
import { initResidents } from './controllers/residentsController.js';
import { initTemporary } from './controllers/temporaryController.js';
import { initAbsent } from './controllers/absentController.js';
import { initFeedback } from './controllers/feedbackController.js';
import { loadProfile, bindEditProfileModal } from './controllers/profileController.js';

const controllers = {
  overview: initOverview,
  households: initHouseholds,
  residents: initResidents,
  temporary: initTemporary,
  absent: initAbsent,
  feedback: initFeedback,
  profile: async () => {
    console.log('[Navigation] Initializing profile page');
    loadProfile();
    console.log('[Navigation] Profile loaded, binding modal...');
    bindEditProfileModal();
    console.log('[Navigation] Profile modal bound');
  }
};

function setActiveMenu(route) {
  document.querySelectorAll('.menu__item[data-route]').forEach(a => {
    a.classList.toggle('is-active', a.dataset.route === route);
    if (a.dataset.route === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

async function loadPageContent(route) {
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;
  
  const pageUrl = routes[route]?.page;
  if (!pageUrl) {
    console.warn(`No page found for route: ${route}`);
    return;
  }
  
  try {
    const response = await fetch(pageUrl);
    const html = await response.text();
    mainContent.innerHTML = html;
  } catch (error) {
    console.error(`Error loading page ${pageUrl}:`, error);
    mainContent.innerHTML = '<div class="error">Không thể tải trang</div>';
  }
}

export async function navigate(route = 'overview') {
  const routeConfig = routes[route];
  if (!routeConfig) {
    route = 'overview';
  }
  
  setActiveMenu(route);
  document.getElementById('viewTitle').textContent = routes[route].title;
  
  // Load page HTML
  await loadPageContent(route);
  
  // Initialize controller
  const controller = controllers[route];
  if (controller) {
    await controller();
  }
}

export function bindMenu() {
  document.querySelectorAll('.menu__item[data-route]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const r = a.dataset.route;
      if (location.hash !== `#/${r}`) location.hash = `#/${r}`;
      else navigate(r);
    });
  });
}

export function initRouter() {
  window.addEventListener('hashchange', () => {
    const route = location.hash.replace('#/', '') || 'overview';
    navigate(route);
  });
}
