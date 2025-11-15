// ======== MOCK DATA (thay bằng API của bạn) =========
const mockData = {
  kpis: { households: 765, residents: 2430, tempResidence: 125, tempAbsence: 78 },
  monthlyChangesByYear: {
    2024: [12,18,22,30,38,40,52,61,43,28,20,16],
    2025: [15,20,24,36,44,48,55,70,50,35,22,18]
  },
  households: [
    { soHK:'1234567890', chuHo:'Nguyễn Văn An', diaChi:'12 Đường A, Phường B', sl:4 },
    { soHK:'1234567881', chuHo:'Trần Thị Bình', diaChi:'45 Đường C, Phường D', sl:5 },
    { soHK:'1234567872', chuHo:'Lê Văn Cường', diaChi:'78 Đường E, Phường F', sl:3 },
    { soHK:'1234567863', chuHo:'Phạm Quỳnh', diaChi:'11 Đường G, Phường H', sl:6 },
    { soHK:'1234567854', chuHo:'Bùi Minh Hải', diaChi:'22 Đường I, Phường J', sl:2 },
    { soHK:'1234567845', chuHo:'Đỗ Hồng Sơn', diaChi:'33 Đường K, Phường L', sl:5 },
    { soHK:'1234567836', chuHo:'Lý Thảo', diaChi:'44 Đường M, Phường N', sl:4 },
    { soHK:'1234567827', chuHo:'Phan Gia Hưng', diaChi:'55 Đường O, Phường P', sl:3 },
    { soHK:'1234567818', chuHo:'Đặng Thu', diaChi:'66 Đường Q, Phường R', sl:5 },
    { soHK:'1234567809', chuHo:'Tạ Hoài Nam', diaChi:'77 Đường S, Phường T', sl:4 }
  ],
  residenceShare: [
    { label:'Thường trú', value: 2430-125-78 },
    { label:'Tạm trú', value: 125 },
    { label:'Tạm vắng', value: 78 }
  ]
};

// ======== KPI ========
function renderKPIs() {
  const { households, residents, tempResidence, tempAbsence } = mockData.kpis;
  document.getElementById('kpiHouseholds').textContent = households.toLocaleString('vi-VN');
  document.getElementById('kpiResidents').textContent = residents.toLocaleString('vi-VN');
  document.getElementById('kpiTempRes').textContent = tempResidence.toLocaleString('vi-VN');
  document.getElementById('kpiTempAbs').textContent = tempAbsence.toLocaleString('vi-VN');
}

// ======== BAR CHART ========
let barChart;
function renderBarChart(year) {
  const ctx = document.getElementById('barChart');
  const months = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
  const data = mockData.monthlyChangesByYear[year] || [];
  if (barChart) barChart.destroy();

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{ label: `Hồ sơ/biến động ${year}`, data, borderRadius: 8 }]
    },
    options: {
      animation: { duration: 600 },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (it)=>` ${it.parsed.y} hồ sơ` } }
      }
    }
  });
}
function initYearSelect(){
  const years = Object.keys(mockData.monthlyChangesByYear).map(Number).sort((a,b)=>a-b);
  const sel = document.getElementById('yearSelect');
  years.forEach(y=>{
    const o = document.createElement('option'); o.value = y; o.textContent = y; sel.appendChild(o);
  });
  sel.value = years.at(-1);
  sel.addEventListener('change', () => renderBarChart(Number(sel.value)));
  renderBarChart(Number(sel.value));
}

// ======== DONUT CHART ========
let donutChart;
function renderDonut() {
  const ctx = document.getElementById('donutChart');
  const labels = mockData.residenceShare.map(d=>d.label);
  const values = mockData.residenceShare.map(d=>d.value);
  if (donutChart) donutChart.destroy();

  donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data: values, borderWidth: 0 }] },
    options: {
      cutout: '58%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: {
          label: (it)=> ` ${it.raw.toLocaleString('vi-VN')} (${it.formattedValue}%)`
        } }
      }
    }
  });

  // custom legend
  const palette = donutChart.data.datasets[0].backgroundColor
    || ['#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#10b981'];
  const legend = document.getElementById('donutLegend');
  legend.innerHTML = '';
  labels.forEach((lb, i)=>{
    const box = document.createElement('div'); box.className='legend__item';
    box.innerHTML = `<span class="legend__swatch" style="background:${palette[i%palette.length]}"></span>${lb}: <b>${values[i].toLocaleString('vi-VN')}</b>`;
    legend.appendChild(box);
  });
}

// ======== TABLE (paging + search) ========
const PAGE_SIZE = 6;
let page = 1;
function filterRows(keyword){
  const q = keyword.trim().toLowerCase();
  if (!q) return mockData.households;
  return mockData.households.filter(r =>
    r.soHK.includes(q) ||
    r.chuHo.toLowerCase().includes(q) ||
    r.diaChi.toLowerCase().includes(q)
  );
}
function renderTable(){
  const tbody = document.querySelector('#householdTable tbody');
  const search = document.getElementById('tableSearch').value || '';
  const rows = filterRows(search);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  page = Math.min(page, totalPages);

  const from = (page-1)*PAGE_SIZE, to = from + PAGE_SIZE;
  tbody.innerHTML = rows.slice(from,to).map(r => `
    <tr>
      <td>${r.soHK}</td>
      <td>${r.chuHo}</td>
      <td>${r.diaChi}</td>
      <td>${r.sl}</td>
    </tr>
  `).join('');

  document.getElementById('pageInfo').textContent = `Trang ${page}/${totalPages}`;
  document.getElementById('prevPage').disabled = page<=1;
  document.getElementById('nextPage').disabled = page>=totalPages;
}
function bindTable(){
  document.getElementById('tableSearch').addEventListener('input', ()=>{
    page=1; renderTable();
  });
  document.getElementById('prevPage').addEventListener('click', ()=>{ if(page>1){ page--; renderTable(); }});
  document.getElementById('nextPage').addEventListener('click', ()=>{ page++; renderTable(); });
}

// ======== Sidebar collapse ========
function bindSidebar(){
  const btn = document.getElementById('toggleSidebar');
  btn.addEventListener('click', () => {
    document.querySelector('.layout').classList.toggle('collapsed');
  });
}
const style = document.createElement('style');
style.textContent = `
  .layout.collapsed{ grid-template-columns: 70px 1fr; }
  .layout.collapsed .brand__name, .layout.collapsed .menu__item span { display:none; }
`;
document.head.appendChild(style);

// ======== Logout ========
function bindLogout(){
  const btn = document.getElementById('logoutLink');
  if(!btn) return;
  btn.addEventListener('click', async (e)=>{
    e.preventDefault();
    const ok = confirm('Bạn có chắc muốn đăng xuất?');
    if(!ok) return;

    // Nếu có API back-end, gọi logout ở đây:
    // await fetch('/api/logout', { method: 'POST', credentials: 'include' });

    try{ localStorage.clear(); sessionStorage.clear(); }catch{}
    window.location.href = 'index.html'; // chỉnh path nếu khác
  });
}

// ======== INIT ========
window.addEventListener('DOMContentLoaded', () => {
  renderKPIs();
  initYearSelect();
  renderDonut();
  bindTable(); renderTable();
  bindSidebar();
  bindLogout();

  Chart.defaults.color = '#374151';
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0,0,0,0.8)';
});
