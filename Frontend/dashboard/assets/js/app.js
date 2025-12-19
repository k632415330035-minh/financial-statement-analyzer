// Main Application Entry Point
import { navigate, bindMenu, initRouter } from './navigation.js';
import { bindSidebar, bindLogout } from './uiHelpers.js';
import { bindEditProfileModal } from './controllers/profileController.js';

// Initialize Chart.js defaults
function initChartDefaults() {
  if (window.Chart) {
    Chart.defaults.color = '#374151';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0,0,0,0.8)';
  }
}

// Application initialization
async function init() {
  console.log('🚀 Initializing Dashboard v2.4...');
  
  // Setup Chart.js
  initChartDefaults();
  
  // Bind UI components
  bindSidebar();
  bindLogout();
  bindMenu();
  bindEditProfileModal();
  
  // Initialize router
  initRouter();
  
  // Navigate to initial route
  const initialRoute = location.hash.replace('#/', '') || 'overview';
  await navigate(initialRoute);
  
  console.log('✅ Dashboard ready!');
}

// Wait for DOM to be fully loaded
window.addEventListener('DOMContentLoaded', init);
