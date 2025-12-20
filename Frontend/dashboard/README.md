# Dashboard v2.5 - Refactored Architecture

Dashboard quản lý tổ dân phố với kiến trúc modular, phân tách rõ ràng giữa các layer.

## 📁 Cấu trúc dự án

```
dashboard.v2/
├── index.html                    # Entry point - layout + modals only
├── pages/                        # Separate HTML pages
│   ├── overview.html            # Overview page
│   ├── households.html          # Households page
│   ├── residents.html           # Residents page
│   ├── temporary.html           # Temporary residence page
│   ├── feedback.html            # Feedback page
│   └── profile.html             # User profile page
├── components/                   # Reusable HTML components (future)
├── assets/
│   ├── css/
│   │   ├── base.css             # CSS variables, reset, animations
│   │   ├── layout.css           # Layout structure, responsive
│   │   ├── components.css       # Reusable components
│   │   └── pages.css            # Page-specific styles
│   └── js/
│       ├── app.js               # Application entry point
│       ├── router.js            # Route definitions ONLY
│       ├── navigation.js        # Navigation logic
│       ├── uiHelpers.js         # UI utilities
│       ├── controllers/         # Controllers - navigation only
│       │   ├── overviewController.js
│       │   ├── householdsController.js
│       │   ├── residentsController.js
│       │   ├── temporaryController.js
│       │   ├── feedbackController.js
│       │   └── profileController.js
│       ├── services/            # Business logic layer
│       │   ├── api.js           # Data service (CRUD)
│       │   └── overviewService.js # Overview business logic
│       ├── models/
│       │   └── mockData.js      # Mock data store
│       └── utils/
│           └── helpers.js       # Pure utility functions
├── dashboard.v2.html            # Original (backup)
├── dashboard.v2.css             # Original CSS (backup)
├── dashboard.v2.js              # Original JS (backup)
└── README.md                    # Documentation
```

## 🏗️ Kiến trúc - Clean Separation of Concerns

### 1. Router (`router.js`) - Route Definitions ONLY
Chỉ chứa định nghĩa routes, không có logic:
```javascript
export const routes = {
  overview: {
    path: '#/overview',
    title: 'Tổng quan',
    page: 'pages/overview.html'
  }
}
```

### 2. Navigation (`navigation.js`) - Routing Logic
Xử lý điều hướng:
- Load HTML từ `pages/`
- Update active menu
- Call controller tương ứng
- Manage history state

### 3. Controllers - Navigation & DOM Updates ONLY
```javascript
// ✅ ĐÚNG - Controller chỉ điều hướng và update DOM
export async function initOverview() {
  const data = await overviewService.getKPIData();
  renderKPIs(data);
}

// ❌ SAI - Không để business logic trong controller
export async function initOverview() {
  const data = fetchData();
  const processed = data.map(x => x * 2); // Business logic!
  render(processed);
}
```

### 4. Services - Business Logic ONLY
```javascript
// ✅ ĐÚNG - Service xử lý logic
export async function getKPIData() {
  const raw = dataService.getKPIs();
  // Transform, validate, calculate
  return processedData;
}
```

### 5. Data Flow

```
User Action
    ↓
Controller (navigate + update DOM)
    ↓
Service (business logic)
    ↓
Data Layer (CRUD)
    ↓
Service (transform)
    ↓
Controller (render)
```

## 🚀 Cách chạy

**Quan trọng**: Cần HTTP server để load HTML pages động.

### Option 1: Python
```bash
cd "c:\Users\84328\Downloads\lhdh (2)\dashboard.v2"
python -m http.server 8000
# Open http://localhost:8000
```

### Option 2: Node.js
```bash
npx http-server
# Open displayed URL
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Choose "Open with Live Server"

## 🔧 Development Guide

### Thêm trang mới

1. **Create page HTML** in `pages/newpage.html`
   ```html
   <div class="card">
     <h2>New Page</h2>
     <!-- Page content -->
   </div>
   ```

2. **Add route** in `router.js`
   ```javascript
   export const routes = {
     // ... existing routes
     newpage: {
       path: '#/newpage',
       title: 'New Page Title',
       page: 'pages/newpage.html'
     }
   }
   ```

3. **Create controller** in `controllers/newpageController.js`
   ```javascript
   import * as newpageService from '../services/newpageService.js';
   
   export async function initNewpage() {
     const data = await newpageService.getData();
     renderData(data);
   }
   ```

4. **Create service** in `services/newpageService.js`
   ```javascript
   import * as dataService from './api.js';
   
   export async function getData() {
     const raw = dataService.getSomeData();
     // Business logic here
     return transformedData;
   }
   ```

5. **Update navigation** in `navigation.js`
   ```javascript
   const controllers = {
     // ... existing
     newpage: initNewpage
   };
   ```

### Best Practices

#### ✅ DO
- Controllers gọi Services
- Services xử lý business logic
- Router chỉ chứa routes
- Reuse Services giữa các Controllers
- Pure functions trong utils/

#### ❌ DON'T
- Business logic trong Controllers
- Navigation logic trong Router
- Duplicate logic
- Direct data manipulation trong Controllers

## 📦 Module Structure

### CSS Layers
1. **base.css**: Variables, reset, global animations
2. **layout.css**: Grid, flexbox layouts
3. **components.css**: Buttons, cards, forms
4. **pages.css**: Page-specific overrides

### JS Modules
- **ES6 modules** - `import/export`
- **Async/await** for data loading
- **Chart.js** from CDN
- **localStorage** for persistence

## ⚠️ Important Notes

- Original files (`dashboard.v2.*`) preserved as backup
- Requires HTTP server (can't run as `file://`)
- Modern browser required (ES6 modules)
- Chart.js loaded from CDN

## 📝 TODO

### High Priority
- [ ] Implement households controller + service
- [ ] Implement residents controller + service
- [ ] Implement temporary residence controller + service
- [ ] Implement feedback controller + service

### Medium Priority
- [ ] Extract common components (modal, table, form)
- [ ] Add error handling layer
- [ ] Add loading states
- [ ] Form validation utilities

### Low Priority
- [ ] Service Worker for offline
- [ ] Unit tests
- [ ] E2E tests
- [ ] Performance optimization

## 🐛 Known Issues

1. **Incomplete features**: Residents, Temporary, Feedback pages are placeholders
2. **No error handling**: Need global error handler
3. **No loading states**: Add spinners for async operations
4. **Profile modal**: Should be extracted to component

## 🔄 Migration from v2.4

### Changes
- ✅ Router now only contains routes
- ✅ New `navigation.js` handles routing logic
- ✅ Services renamed from API layer to business logic
- ✅ HTML split into separate page files
- ✅ Controllers refactored to delegate to services

### Breaking Changes
- Old `router.js` functions moved to `navigation.js`
- `api.js` functions renamed (fetch* → get*)
- Views no longer inline in index.html

---

**Version**: 2.5  
**Architecture**: Clean MVC with separated concerns  
**Last Updated**: 2025  
**Author**: Dashboard Refactor Team
