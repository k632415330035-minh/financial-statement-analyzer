// Absent Controller - Tạm vắng management
import { save, load, ymd } from '../utils/helpers.js';

let allAbsent = [];
let stats = { total: 0, active: 0, expired: 0 };
let absentPage = 1;
const PAGE_SIZE = 10;

function getAbsentStats() {
  const total = document.getElementById('totalAbsentCount');
  const active = document.getElementById('activeAbsentCount');
  const expired = document.getElementById('expiredAbsentCount');
  if (total) total.textContent = stats.total;
  if (active) active.textContent = stats.active;
  if (expired) expired.textContent = stats.expired;
}


function renderAbsentTable() {
  const tbody = document.querySelector('#absentActiveTable tbody');
  if (!tbody) return;

  const totalPages = Math.max(1, Math.ceil(allAbsent.length / PAGE_SIZE));
  absentPage = Math.min(absentPage, totalPages);

  const slice = allAbsent.slice((absentPage - 1) * PAGE_SIZE, absentPage * PAGE_SIZE);

  tbody.innerHTML = slice.map((a, i) => {
    const daysLeft = a.daysLeft || 0;
    const isExpired = daysLeft === 0 && new Date(a.thoi_gian_tam_vang_end) < new Date();
    const daysColor = daysLeft <= 3 ? '#ef4444' : daysLeft <= 7 ? '#f59e0b' : '#22c55e';

    return `
      <tr style="${isExpired ? 'background-color: #f9fafb; color: #9ca3af;' : ''}">
        <td>${(absentPage - 1) * PAGE_SIZE + i + 1}</td>
        <td><strong>${a.name}</strong></td>
        <td>${new Date(a.thoi_gian_tam_vang_begin).toLocaleDateString('vi-VN')}</td>
        <td>${new Date(a.thoi_gian_tam_vang_end).toLocaleDateString('vi-VN')}</td>
        <td>${a.li_do || '-'}</td>
        <td>
          <span style="color:${isExpired ? '#9ca3af' : daysColor}; font-weight:600;">
            ${isExpired ? 'Đã hết hạn' : daysLeft + ' ngày'}
          </span>
        </td>
      </tr>`;
  }).join('');

  const pi = document.getElementById('pageInfoAbsentActive');
  if (pi) pi.textContent = `Trang ${absentPage}/${totalPages} (${allAbsent.length} bản ghi)`;

  updatePaginationButtons(totalPages);
}

const empty = document.getElementById('emptyStateAbsent');
if (empty) empty.style.display = filtered.length === 0 ? 'block' : 'none';

const pi = document.getElementById('pageInfoAbsent');
if (pi) pi.textContent = `Trang ${absentPage}/${totalPages}`;

const prev = document.getElementById('prevPageAbsent'), next = document.getElementById('nextPageAbsent');
if (prev) {
  prev.disabled = absentPage <= 1;
  prev.onclick = () => { if (absentPage > 1) { absentPage--; renderAbsentTable(); } };
}
if (next) {
  next.disabled = absentPage >= totalPages;
  next.onclick = () => { if (absentPage < totalPages) { absentPage++; renderAbsentTable(); } };
}

function updatePaginationButtons(totalPages) {
  const prev = document.getElementById('prevPageAbsentActive');
  const next = document.getElementById('nextPageAbsentActive');

  if (prev) {
    prev.disabled = absentPage <= 1;
    prev.onclick = () => { if (absentPage > 1) { absentPage--; renderAbsentTable(); } };
  }
  if (next) {
    next.disabled = absentPage >= totalPages;
    next.onclick = () => { if (absentPage < totalPages) { absentPage++; renderAbsentTable(); } };
  }
}


export async function initAbsent() {
  try {
    // Gọi API từ Service đã được viết lại
    const result = await getAbsentStats();

    if (result.success) {
      // Lưu dữ liệu vào biến cục bộ
      allAbsent = result.data.records || [];
      stats = {
        total: result.data.total,
        active: result.data.active,
        expired: result.data.expired
      };

      // Cập nhật giao diện
      updateAbsentStatsDisplay();
      renderAbsentTable();

      // Gắn sự kiện tìm kiếm nếu có
      const searchInput = document.getElementById('absentActiveSearch');
      if (searchInput) {
        searchInput.oninput = (e) => handleSearch(e.target.value);
      }
    }
  } catch (error) {
    console.error("Lỗi khởi tạo Tạm vắng:", error);
    const emptyState = document.getElementById('emptyStateAbsentActive');
    if (emptyState) emptyState.style.display = 'block';
  }
}
function handleSearch(text) {
  const filtered = allAbsent.filter(a =>
    a.name.toLowerCase().includes(text.toLowerCase())
  );
  const originalData = allAbsent;
  allAbsent = filtered;
  absentPage = 1;
  renderAbsentTable();
  allAbsent = originalData;
}
