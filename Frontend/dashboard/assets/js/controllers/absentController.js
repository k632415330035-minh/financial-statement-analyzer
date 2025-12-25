// Absent Controller - Quản lý Tạm vắng (Kết nối Backend ManageAbsent)
import { getAbsentDashboardData } from '../services/api.js'; //

let allAbsent = [];
let stats = { total: 0, active: 0, expired: 0 };
let absentPage = 1;
const PAGE_SIZE = 10;

// 1. Hàm cập nhật các ô số liệu KPI lên giao diện
function updateAbsentStatsDisplay() {
  //const total = document.getElementById('totalAbsentCount');
  const active = document.getElementById('activeAbsentCount');
  //const expired = document.getElementById('expiredAbsentCount');

  // if (total) total.textContent = stats.total;
  if (active) active.textContent = stats.active;
  // if (expired) expired.textContent = stats.expired;
}

// 2. Hàm render bảng danh sách
function renderAbsentTable() {
  const tbody = document.querySelector('#absentActiveTable tbody');
  const emptyState = document.getElementById('emptyStateAbsentActive');
  if (!tbody) return;

  if (allAbsent.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  } else {
    if (emptyState) emptyState.style.display = 'none';
  }

  const totalPages = Math.max(1, Math.ceil(allAbsent.length / PAGE_SIZE));
  absentPage = Math.min(absentPage, totalPages);
  const slice = allAbsent.slice((absentPage - 1) * PAGE_SIZE, absentPage * PAGE_SIZE);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  tbody.innerHTML = slice.map((a, i) => {
    const beginDate = new Date(a.thoi_gian_tam_vang_begin);
    const endDate = new Date(a.thoi_gian_tam_vang_end);
    beginDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let statusText = "";
    let statusColor = "";
    const daysLeft = a.daysLeft || 0;


    if (now < beginDate) {
      // 1. Chưa đến ngày đi
      statusText = "Chưa đến lịch";
      statusColor = "#3b82f6";
    } else if (now >= beginDate && now <= endDate) {
      // 2. Đang trong thời gian tạm vắng
      statusText = daysLeft + " ngày";
      statusColor = daysLeft <= 3 ? '#ef4444' : daysLeft <= 7 ? '#f59e0b' : '#22c55e';
    } else {
      // 3. Đã quá hạn
      statusText = "Đã hết hạn";
      statusColor = "#9ca3af"; // Màu xám
    }

    return `
      <tr style="${now > endDate ? 'background-color: #f9fafb; color: #9ca3af;' : ''}">
        <td>${(absentPage - 1) * PAGE_SIZE + i + 1}</td>
        <td><strong>${a.name}</strong></td>
        <td>${beginDate.toLocaleDateString('vi-VN')}</td>
        <td>${endDate.toLocaleDateString('vi-VN')}</td>
        <td>${a.li_do || '-'}</td>
        <td>
          <span style="color:${statusColor}; font-weight:600;">
            ${statusText}
          </span>
        </td>
      </tr>`;
  }).join('');

  const pi = document.getElementById('pageInfoAbsentActive');
  if (pi) pi.textContent = `Trang ${absentPage}/${totalPages} (${allAbsent.length} bản ghi)`;
  updatePaginationButtons(totalPages);
}

// 3. Hàm xử lý nút bấm phân trang
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

// 4. Hàm khởi tạo chính - Gọi khi load trang
export async function initAbsent() {
  try {
    // PHẢI GỌI HÀM NÀY: Hàm từ api.js để lấy dữ liệu thực
    const result = await getAbsentDashboardData();

    if (result.success) {
      allAbsent = result.data.records || [];
      stats = {
        // total: result.data.total || 0,
        active: result.data.active || 0,
        // expired: result.data.expired || 0
      };

      updateAbsentStatsDisplay();
      renderAbsentTable();

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

// 5. Hàm tìm kiếm tại chỗ
function handleSearch(text) {
  const filtered = allAbsent.filter(a =>
    a.name.toLowerCase().includes(text.toLowerCase())
  );
  const originalData = [...allAbsent];
  allAbsent = filtered;
  absentPage = 1;
  renderAbsentTable();
  allAbsent = originalData;
}