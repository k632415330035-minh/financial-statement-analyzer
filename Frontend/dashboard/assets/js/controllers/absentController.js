// Absent Controller - Tạm vắng management
import { save, load, ymd } from '../utils/helpers.js';

let absentInited = false;
let absentFiltersBound = false;
let absentActiveBound = false;
let allAbsent = [];
let absentPage = 1;
let absentActivePage = 1;

function getAbsentStats() {
  const pending = allAbsent.filter(a => a.status === 'pending').length;
  const approved = allAbsent.filter(a => a.status === 'approved').length;
  const rejected = allAbsent.filter(a => a.status === 'rejected').length;
  const total = allAbsent.length;
  return { pending, approved, rejected, total };
}

function updateAbsentStats() {
  const stats = getAbsentStats();
  document.getElementById('pendingAbsentCount').textContent = stats.pending;
  document.getElementById('approvedAbsentCount').textContent = stats.approved;
  document.getElementById('rejectedAbsentCount').textContent = stats.rejected;
  document.getElementById('totalAbsentCount').textContent = stats.total;
}

function bindAbsentFilters() {
  if (absentFiltersBound) return;
  absentFiltersBound = true;
  
  const statusSelect = document.getElementById('absentStatusFilter');
  if (statusSelect) statusSelect.addEventListener('change', renderAbsentTable);
}

function filterAbsent() {
  const statusFilter = document.getElementById('absentStatusFilter')?.value || '';
  return allAbsent.filter(a => {
    const matchStatus = !statusFilter || a.status === statusFilter;
    return matchStatus;
  });
}

function renderAbsentTable() {
  const filtered = filterAbsent();
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  absentPage = Math.min(absentPage, totalPages);
  
  const tbody = document.querySelector('#absentTable tbody');
  if (tbody) {
    const slice = filtered.slice((absentPage - 1) * PAGE_SIZE, (absentPage - 1) * PAGE_SIZE + PAGE_SIZE);
    tbody.innerHTML = slice.map((a, i) => {
      const statusColor = a.status === 'pending' ? '#f59e0b' : a.status === 'approved' ? '#22c55e' : '#ef4444';
      const statusText = a.status === 'pending' ? 'Chờ duyệt' : a.status === 'approved' ? 'Đã duyệt' : 'Bị từ chối';
      const actionBtns = a.status === 'pending'
        ? `<button class="btn" onclick="window.approveAbsentRecord('${a.id}')" style="font-size:12px;padding:6px 12px;margin-right:4px;">✓ Duyệt</button>
           <button class="btn" onclick="window.rejectAbsentRecord('${a.id}')" style="font-size:12px;padding:6px 12px;color:#ef4444;border-color:#ef4444;">✕ Từ chối</button>`
        : '';
      return `<tr>
        <td>${(absentPage - 1) * PAGE_SIZE + i + 1}</td>
        <td><strong>${a.name}</strong></td>
        <td>${a.fromDate}</td>
        <td>${a.toDate}</td>
        <td>${a.reason || '-'}</td>
        <td><span style="background:${statusColor}20;color:${statusColor};padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">${statusText}</span></td>
        <td style="text-align:center;">${actionBtns}</td>
      </tr>`;
    }).join('');
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
}

function approveAbsentRecord(id) {
  const record = allAbsent.find(a => a.id === id);
  if (record) {
    record.status = 'approved';
    save('allAbsent', allAbsent);
    updateAbsentStats();
    renderAbsentTable();
    renderAbsentActiveTable();
    alert('Đã phê duyệt đơn của ' + record.name);
  }
}

function rejectAbsentRecord(id) {
  const reason = prompt('Nhập lý do từ chối:');
  if (reason !== null) {
    const record = allAbsent.find(a => a.id === id);
    if (record) {
      record.status = 'rejected';
      record.rejectReason = reason;
      save('allAbsent', allAbsent);
      updateAbsentStats();
      renderAbsentTable();
      renderAbsentActiveTable();
      alert('Đã từ chối đơn của ' + record.name);
    }
  }
}

// Active absent residents section
function getActiveDays(fromDate, toDate) {
  const to = new Date(toDate);
  const today = new Date(ymd(new Date()));
  const diffTime = Math.max(0, to.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function bindAbsentActiveFilters() {
  const searchInput = document.getElementById('absentActiveSearch');
  if (searchInput) searchInput.addEventListener('input', renderAbsentActiveTable);
}

function filterAbsentActive() {
  const searchText = document.getElementById('absentActiveSearch')?.value.toLowerCase() || '';
  const today = ymd(new Date());
  
  return allAbsent.filter(a => {
    if (a.status !== 'approved') return false;
    if (a.fromDate > today || a.toDate < today) return false;
    const matchSearch = !searchText || a.name.toLowerCase().includes(searchText);
    return matchSearch;
  });
}

function renderAbsentActiveTable() {
  const filtered = filterAbsentActive();
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  absentActivePage = Math.min(absentActivePage, totalPages);
  
  const tbody = document.querySelector('#absentActiveTable tbody');
  if (tbody) {
    const slice = filtered.slice((absentActivePage - 1) * PAGE_SIZE, (absentActivePage - 1) * PAGE_SIZE + PAGE_SIZE);
    tbody.innerHTML = slice.map((a, i) => {
      const daysLeft = getActiveDays(a.fromDate, a.toDate);
      const daysColor = daysLeft <= 3 ? '#ef4444' : daysLeft <= 7 ? '#f59e0b' : '#22c55e';
      return `<tr>
        <td>${(absentActivePage - 1) * PAGE_SIZE + i + 1}</td>
        <td><strong>${a.name}</strong></td>
        <td>${a.fromDate}</td>
        <td>${a.toDate}</td>
        <td>${a.reason || '-'}</td>
        <td><span style="color:${daysColor};font-weight:600;">${daysLeft} ngày</span></td>
      </tr>`;
    }).join('');
  }
  
  const empty = document.getElementById('emptyStateAbsentActive');
  if (empty) empty.style.display = filtered.length === 0 ? 'block' : 'none';
  
  const pi = document.getElementById('pageInfoAbsentActive');
  if (pi) pi.textContent = `Trang ${absentActivePage}/${totalPages} (${filtered.length} người)`;
  
  const prev = document.getElementById('prevPageAbsentActive'), next = document.getElementById('nextPageAbsentActive');
  if (prev) {
    prev.disabled = absentActivePage <= 1;
    prev.onclick = () => { if (absentActivePage > 1) { absentActivePage--; renderAbsentActiveTable(); } };
  }
  if (next) {
    next.disabled = absentActivePage >= totalPages;
    next.onclick = () => { if (absentActivePage < totalPages) { absentActivePage++; renderAbsentActiveTable(); } };
  }
}

export function initAbsent() {
  // Reset flags to rebind on each visit
  absentFiltersBound = false;
  absentActiveBound = false;
  
  // Always refresh data to prevent loss on page navigation
  allAbsent = load('allAbsent', [
    {id: '1', name: 'Nguyễn Văn A', fromDate: '2025-11-20', toDate: '2025-12-20', reason: 'Du lịch', status: 'approved', createdDate: '2025-11-18'},
    {id: '2', name: 'Trần Thị B', fromDate: '2025-11-20', toDate: '2025-11-30', reason: 'Thăm gia đình', status: 'approved', createdDate: '2025-11-17'},
    {id: '3', name: 'Phạm Hữu C', fromDate: '2025-11-25', toDate: '2026-01-25', reason: 'Công tác', status: 'pending', createdDate: '2025-11-19'},
    {id: '4', name: 'Lê Văn D', fromDate: '2025-12-01', toDate: '2025-12-10', reason: 'Nghỉ phép', status: 'approved', createdDate: '2025-11-16'},
    {id: '5', name: 'Hoàng Thị E', fromDate: '2025-11-22', toDate: '2025-12-22', reason: 'Sự kiện gia đình', status: 'pending', createdDate: '2025-11-15'},
    {id: '6', name: 'Đỗ Văn F', fromDate: '2025-11-18', toDate: '2025-11-25', reason: 'Học tập', status: 'approved', createdDate: '2025-11-14'},
    {id: '7', name: 'Nguyễn Thị G', fromDate: '2025-11-23', toDate: '2026-02-23', reason: 'Công việc', status: 'approved', createdDate: '2025-11-13'},
    {id: '8', name: 'Tạ Văn H', fromDate: '2025-12-05', toDate: '2025-12-15', reason: 'Khám bệnh', status: 'pending', createdDate: '2025-11-12'},
    {id: '9', name: 'Vũ Thị I', fromDate: '2025-11-28', toDate: '2025-12-28', reason: 'Dự án', status: 'approved', createdDate: '2025-11-11'},
    {id: '10', name: 'Bùi Văn K', fromDate: '2025-11-29', toDate: '2025-12-05', reason: 'Du lịch nước ngoài', status: 'rejected', createdDate: '2025-11-10'}
  ]);
  
  updateAbsentStats();
  if (!absentInited) {
    bindAbsentFilters();
    bindAbsentActiveFilters();
    absentInited = true;
  }
  renderAbsentTable();
  renderAbsentActiveTable();
}

// Make functions globally available for onclick handlers
window.approveAbsentRecord = approveAbsentRecord;
window.rejectAbsentRecord = rejectAbsentRecord;
