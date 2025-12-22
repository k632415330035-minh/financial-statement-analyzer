// Overview Controller - Handle navigation and DOM updates only
import * as dataService from '../services/api.js';
import { ymd, parseYmd, monthIndex, yearOf } from '../utils/helpers.js';

let barChart, donutChart, genderChart, ageChart, periodChart, overviewInited = false;

// Business logic functions (moved from overviewService.js)
async function getKPIData() {
  try {
    // 1. Lấy token từ localStorage
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // 2. Gọi API lấy dữ liệu thống kê
    const response = await fetch('http://localhost:3000/api/statistics/dashboard', {
      method: 'GET',
      headers
    });

    // 3. Xử lý lỗi phản hồi từ server
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.warn('KPI request failed', {
        status: response.status,
        statusText: response.statusText,
        body: body.slice(0, 200)
      });
      return {
        ok: false,
        households: null,
        residents: null,
        tempResidence: null,
        tempAbsence: null,
        permResidence: null // Bổ sung trường mới
      };
    }

    const result = await response.json();
    const overview = result?.data?.overview ?? {};

    // Helper function để chuyển đổi dữ liệu an toàn về kiểu Number
    const toNumber = (val) => (typeof val === 'number' ? val : (Number(val) || 0));

    // 4. Trả về object đã map các trường dữ liệu
    return {
      ok: true,
      households: toNumber(overview.hokhau),
      residents: toNumber(overview.nhankhau),
      tempResidence: toNumber(overview.tamtru),
      tempAbsence: toNumber(overview.tamvang),
      permResidence: toNumber(overview.thuongtru) // Map từ 'thuongtru' ở backend sang 'permResidence'
    };

  } catch (error) {
    console.error('Lỗi khi gọi getKPIData:', error);
    return {
      ok: false,
      households: null,
      residents: null,
      tempResidence: null,
      tempAbsence: null,
      permResidence: null
    };
  }
}

async function getMonthlyChartData(year) {
  // const data = dataService.getMonthlyData(year);
  // if (!data) return { labels: [], households: [], residents: [] };
  // const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  // return {
  //   labels: months,
  //   households: data,
  //   residents: data.map(x => x * 3)
  // };
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  try {
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `http://localhost:3000/api/statistics/dashboard?year=${encodeURIComponent(year)}`;
    const resp = await fetch(url, { method: 'GET', headers });

    if (!resp.ok) {
      try {
        const text = await resp.text();
        console.warn('MonthlyTrend fetch failed', { status: resp.status, statusText: resp.statusText, body: text.slice(0, 200) });
      } catch (e) {
        console.warn('MonthlyTrend fetch failed', { status: resp.status, statusText: resp.statusText });
      }
      return { labels: months, households: new Array(12).fill(0), residents: new Array(12).fill(0) };
    }

    const json = await resp.json();
    const monthly = json?.data?.charts?.monthlyTrend || [];

    // Prefer explicit monthly fields from backend when available
    const households = new Array(12).fill(0);
    const residents = new Array(12).fill(0);

    monthly.forEach(m => {
      const idx = Number(m.month) - 1;
      if (idx < 0 || idx >= 12) return;

      // Households: prefer explicit count_ho_khau; fallback to heuristic
      const hoKhau = m.count_ho_khau != null
        ? Number(m.count_ho_khau)
        : (m.count_thuong_tru != null ? Math.round(Number(m.count_thuong_tru) / 3) : (m.count != null ? Math.round(Number(m.count) / 3) : 0));

      const ct_thuong_tru = m.count_thuong_tru != null ? Number(m.count_thuong_tru) : (m.count != null ? Number(m.count) : 0);
      const cTamTru = m.count_tam_tru != null ? Number(m.count_tam_tru) : 0;
      const cTamVang = m.count_tam_vang != null ? Number(m.count_tam_vang) : 0;

      households[idx] = hoKhau;
      residents[idx] = ct_thuong_tru + cTamTru - cTamVang; // total present residents
    });

    return { labels: months, households, residents };
  } catch (e) {
    console.error('MonthlyTrend fetch error:', e);
    return { labels: months, households: new Array(12).fill(0), residents: new Array(12).fill(0) };
  }
}

async function getResidenceChartData() {
  const data = await dataService.getResidenceShare();
  return {
    labels: data.map(d => d.label),
    values: data.map(d => d.value),
    backgrounds: data.map(d => d.color)
  };
}

async function getGenderChartData() {
  const data = await dataService.getGenderStats();
  return {
    labels: ['Nam', 'Nữ'],
    values: [data.male || 0, data.female || 0],
    backgrounds: ['#4F46E5', '#EC4899']
  };
}


async function getAgeGroupChartData() {
  const data = await dataService.getAgeGroupStats();
  return {
    labels: ['Mầm non', 'Mẫu giáo', 'Cấp 1', 'Cấp 2', 'Cấp 3', 'Lao động', 'Nghỉ hưu'],
    values: [data.mamNon || 0, data.mauGiao || 0, data.cap1 || 0, data.cap2 || 0, data.cap3 || 0, data.laoDong || 0, data.nghiHuu || 0],
    backgrounds: ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#22c55e', '#f59e0b']
  };
}

async function getTemporaryStats(fromDate, toDate) {
  return await dataService.getEventStats(fromDate, toDate);
}

export async function initOverview() {
  // Always render to prevent data loss on navigation
  await renderKPIs();

  // Always initialize year select and period controls to ensure event listeners are bound
  await initYearSelect();
  await initPeriodControlsStats();

  // Render all charts
  await renderDonut();
  await renderGenderChart();
  await renderAgeChart();
  await renderPeriodChart();
  await renderGenderTable();
  await renderAgeGroupTable();
  await renderPeriodTableStats();

  // Only setup scroll button once
  if (!overviewInited) {
    document.getElementById('scrollDownBtn')?.addEventListener('click', () => {
      document.getElementById('statsSection')?.scrollIntoView({ behavior: 'smooth' });
    });
    overviewInited = true;
  }
}

async function renderKPIs() {
  const kpis = await getKPIData();
  const gid = id => document.getElementById(id);
  const el1 = gid('kpiHouseholds');
  const el2 = gid('kpiResidents');
  const el3 = gid('kpiTempRes');
  const el4 = gid('kpiTempAbs');
  const el5 = gid('kpiPermanent');
  if (el1) el1.textContent = kpis.households.toLocaleString('vi-VN');
  if (el2) el2.textContent = kpis.residents.toLocaleString('vi-VN');
  if (el3) el3.textContent = kpis.tempResidence.toLocaleString('vi-VN');
  if (el4) el4.textContent = kpis.tempAbsence.toLocaleString('vi-VN');
  if (el5) el5.textContent = kpis.permResidence.toLocaleString('vi-VN');
}

async function renderBarChart(year) {
  try {
    const el = document.getElementById('barChart');
    if (!el) return;
    const chartData = await getMonthlyChartData(year);
    if (barChart) barChart.destroy();
    barChart = new Chart(el, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [
          { label: `Hộ khẩu ${year}`, data: chartData.households, borderRadius: 8, backgroundColor: '#3b82f6' },
          { label: `Nhân khẩu ${year}`, data: chartData.residents, borderRadius: 8, backgroundColor: '#22c55e' }
        ]
      },
      options: {
        animation: { duration: 500 },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
        plugins: { legend: { display: true }, tooltip: { callbacks: { label: it => ` ${it.parsed.y} người` } } }
      }
    });
  } catch (err) {
    console.error('Error rendering bar chart:', err);
  }
}

async function initYearSelect() {
  const sel = document.getElementById('yearSelect');
  if (!sel) return;
  // Clear existing options to prevent duplicates
  sel.innerHTML = '';
  const years = [2025, 2024];
  years.forEach(y => {
    const o = document.createElement('option');
    o.value = y;
    o.textContent = y;
    sel.appendChild(o);
  });
  sel.value = years[years.length - 1];
  // Remove old listeners and add new one
  const newSel = sel.cloneNode(true);
  sel.replaceWith(newSel);
  newSel.addEventListener('change', () => renderBarChart(Number(newSel.value)));
  await renderBarChart(Number(newSel.value));
}

async function renderDonut() {
  const el = document.getElementById('donutChart');
  if (!el) return;
  const chartData = await getResidenceChartData();
  if (donutChart) donutChart.destroy();
  donutChart = new Chart(el, {
    type: 'doughnut',
    data: {
      labels: chartData.labels,
      datasets: [{ data: chartData.values, borderWidth: 0, backgroundColor: chartData.backgrounds }]
    },
    options: {
      cutout: '58%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: it => {
              const total = chartData.values.reduce((a, b) => a + b, 0) || 1;
              const p = ((it.raw / total) * 100).toFixed(1);
              return ` ${it.raw.toLocaleString('vi-VN')} (${p}%)`;
            }
          }
        }
      }
    }
  });
  const legend = document.getElementById('donutLegend');
  if (!legend) return;
  legend.innerHTML = '';
  chartData.labels.forEach((lb, i) => {
    const box = document.createElement('div');
    box.className = 'legend__item';
    box.innerHTML = `<span class="legend__swatch" style="background:${chartData.backgrounds[i]}"></span>${lb}: <b>${chartData.values[i].toLocaleString('vi-VN')}</b>`;
    legend.appendChild(box);
  });
}

async function renderGenderChart() {
  const el = document.getElementById('genderChart');
  if (!el) return;
  const chartData = await getGenderChartData();
  if (genderChart) genderChart.destroy();
  genderChart = new Chart(el, {
    type: 'bar',
    data: {
      labels: chartData.labels,
      datasets: [{ label: 'Số lượng', data: chartData.values, borderRadius: 8, backgroundColor: chartData.backgrounds }]
    },
    options: {
      animation: { duration: 500 },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: it => ` ${it.parsed.y.toLocaleString('vi-VN')} người` } } }
    }
  });
}

async function renderAgeChart() {
  const el = document.getElementById('ageChart');
  if (!el) return;
  const chartData = await getAgeGroupChartData();
  if (ageChart) ageChart.destroy();
  ageChart = new Chart(el, {
    type: 'bar',
    data: {
      labels: chartData.labels,
      datasets: [{ label: 'Số lượng', data: chartData.values, borderRadius: 8, backgroundColor: chartData.backgrounds }]
    },
    options: {
      animation: { duration: 500 },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: it => ` ${it.parsed.y.toLocaleString('vi-VN')} người` } } }
    }
  });
}

async function renderPeriodChart() {
  const el = document.getElementById('periodChart');
  if (!el) return;
  const from = document.querySelector('.fromDateStats'),
    to = document.querySelector('.toDateStats');
  if (!from || !to) return;
  const { tam_tru, tam_vang } = await getTemporaryStats(from.value, to.value);
  const labels = ['Tạm trú', 'Tạm vắng'],
    values = [tam_tru, tam_vang];
  if (periodChart) periodChart.destroy();
  const palette = ['#f59e0b', '#ef4444'];
  periodChart = new Chart(el, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Số lượng', data: values, borderRadius: 8, backgroundColor: palette }] },
    options: {
      animation: { duration: 500 },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: it => ` ${it.parsed.y.toLocaleString('vi-VN')} hồ sơ` } } }
    }
  });
}

async function renderGenderTable() {
  const chartData = await getGenderChartData();
  const total = chartData.values.reduce((a, b) => a + b, 0);
  const rows = chartData.labels.map((label, i) => {
    const value = chartData.values[i] || 0;
    const percent = total ? ((value / total) * 100).toFixed(1) + '%' : '0%';
    return [label, value, percent];
  });
  rows.push(['Tổng', total, '100%']);
  const tbody = document.querySelector('#tblGender tbody');
  if (tbody) tbody.innerHTML = rows.map(r => `<tr><td>${r[0]}</td><td>${r[1].toLocaleString('vi-VN')}</td><td>${r[2]}</td></tr>`).join('');
}

async function renderAgeGroupTable() {
  const chartData = await getAgeGroupChartData();
  const total = chartData.values.reduce((a, b) => a + b, 0);
  const rows = chartData.labels.map((label, i) => {
    const value = chartData.values[i] || 0;
    const percent = total ? ((value / total) * 100).toFixed(1) + '%' : '0%';
    return [label, value, percent];
  });
  const tbody = document.querySelector('#tblAge tbody');
  if (!tbody) return;
  tbody.innerHTML = rows.map(r => `<tr><td>${r[0]}</td><td>${r[1].toLocaleString('vi-VN')}</td><td>${r[2]}</td></tr>`).join('') +
    `<tr><td><b>Tổng</b></td><td><b>${total.toLocaleString('vi-VN')}</b></td><td><b>100%</b></td></tr>`;
}

async function renderPeriodTableStats() {
  const from = document.querySelector('.fromDateStats'),
    to = document.querySelector('.toDateStats');
  if (!from || !to) return;
  const { tam_tru, tam_vang, total } = await getTemporaryStats(from.value, to.value);
  const rows = [
    ['Tạm trú', tam_tru, total ? ((tam_tru / total) * 100).toFixed(1) + '%' : '0%'],
    ['Tạm vắng', tam_vang, total ? ((tam_vang / total) * 100).toFixed(1) + '%' : '0%'],
    ['Tổng', total, '100%']
  ];
  const tbody = document.querySelector('#tblPeriodStats tbody');
  if (tbody) tbody.innerHTML = rows.map(r => `<tr><td>${r[0]}</td><td>${r[1].toLocaleString('vi-VN')}</td><td>${r[2]}</td></tr>`).join('');
}

function initPeriodControlsStats() {
  const from = document.querySelector('.fromDateStats'),
    to = document.querySelector('.toDateStats');
  if (!from || !to) return;
  const now = new Date(),
    start = new Date(now.getFullYear(), 0, 1);
  from.value = ymd(start);
  to.value = ymd(now);
  function setRange(kind) {
    const n = new Date();
    let f,
      t = n;
    if (kind === 'y') f = new Date(n.getFullYear(), 0, 1);
    else if (kind === 'q') {
      const q = Math.floor(n.getMonth() / 3);
      f = new Date(n.getFullYear(), q * 3, 1);
    } else {
      const d = Number(kind) || 7;
      f = new Date(n);
      f.setDate(f.getDate() - d + 1);
    }
    from.value = ymd(f);
    to.value = ymd(t);
  }

  // Clone and replace chip buttons to remove old event listeners
  document.querySelectorAll('.chip').forEach(ch => {
    const newCh = ch.cloneNode(true);
    ch.replaceWith(newCh);
    newCh.addEventListener('click', () => setRange(newCh.dataset.range));
  });

  // Clone and replace apply button to remove old event listener
  const applyBtn = document.querySelector('.btnApplyStats');
  if (applyBtn) {
    const newApplyBtn = applyBtn.cloneNode(true);
    applyBtn.replaceWith(newApplyBtn);
    newApplyBtn.addEventListener('click', async () => {
      await renderPeriodChart();
      await renderPeriodTableStats();
    });
  }
}

