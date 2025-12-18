// Households Controller - DOM updates for households page
import * as dataService from '../services/api.js';
import { debounce } from '../utils/helpers.js';

const PAGE_SIZE = 6;
let originalRows = [];
let page = 1;
let sortState = { key: null, dir: 1 };
let householdsInited = false;

export async function init() {
  // Always refresh data to prevent loss on navigation
  originalRows = await dataService.getHouseholds();
  
  if (!householdsInited) {
    bindTable();
    bindModal();
    bindCreateHouseholdModal();
    bindEditHouseholdModal();
    bindSplitHouseholdModal();
    bindAddMemberModal();
    householdsInited = true;
  }
  renderTable();
}

// ======== TABLE RENDERING =========
function filterRows(search) {
  if (!search) return originalRows;
  const q = search.toLowerCase();
  return originalRows.filter(r =>
    r.soHK.toLowerCase().includes(q) ||
    r.chuHo.toLowerCase().includes(q) ||
    r.diaChi.toLowerCase().includes(q)
  );
}

function sortRows(rows) {
  if (!sortState.key) return rows;
  const { key, dir } = sortState;
  return [...rows].sort((a, b) => {
    const va = a[key], vb = b[key];
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
    return String(va).localeCompare(String(vb), 'vi') * dir;
  });
}

function renderTable() {
  const tbody = document.querySelector('#householdTable tbody');
  if (!tbody) return;
  
  const empty = document.getElementById('emptyState');
  const search = document.getElementById('tableSearch')?.value || '';
  const rows = sortRows(filterRows(search));
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  page = Math.min(page, totalPages);
  const slice = rows.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE);
  
  tbody.innerHTML = slice.map(r => `<tr>
    <td>${r.soHK}</td>
    <td>${r.chuHo}</td>
    <td>${r.diaChi}</td>
    <td>${r.sl}</td>
    <td><button class="btn-view" data-sohk="${r.soHK}">👁 Xem chi tiết</button></td>
  </tr>`).join('');
  
  if (empty) empty.classList.toggle('hidden', rows.length > 0);
  const pi = document.getElementById('pageInfo');
  if (pi) pi.textContent = `Trang ${page}/${totalPages}`;
  const prev = document.getElementById('prevPage'), next = document.getElementById('nextPage');
  if (prev) prev.disabled = page <= 1;
  if (next) next.disabled = page >= totalPages;
  
  // Bind view buttons
  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', () => openHouseholdModal(btn.dataset.sohk));
  });
}

function bindTable() {
  const search = document.getElementById('tableSearch');
  if (search) search.addEventListener('input', debounce(() => { page = 1; renderTable(); }, 250));
  
  const prev = document.getElementById('prevPage'), next = document.getElementById('nextPage');
  prev?.addEventListener('click', () => { if (page > 1) { page--; renderTable(); } });
  next?.addEventListener('click', () => { page++; renderTable(); });
  
  document.querySelectorAll('#householdTable thead th').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      sortState.key === key ? sortState.dir *= -1 : (sortState.key = key, sortState.dir = 1);
      renderTable();
    });
    th.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); th.click(); }
    });
  });
  
  document.getElementById('exportCsv')?.addEventListener('click', () => {
    const q = document.getElementById('tableSearch')?.value || '';
    const data = sortRows(filterRows(q));
    const csv = ['Số hộ khẩu,Chủ hộ,Địa chỉ,SL nhân khẩu'].concat(data.map(r => [r.soHK, r.chuHo, r.diaChi, r.sl].map(x => `"${String(x).replace(/"/g, '""')}"`).join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'households.csv';
    a.click();
    URL.revokeObjectURL(url);
  });
  
  document.getElementById('printTable')?.addEventListener('click', () => window.print());
}

// ======== HOUSEHOLD MODAL =========
function openHouseholdModal(soHK) {
  const household = originalRows.find(h => h.soHK === soHK);
  if (!household) return;
  
  document.getElementById('modalSoHK').textContent = household.soHK;
  document.getElementById('modalChuHo').textContent = household.chuHo;
  document.getElementById('modalDiaChi').textContent = household.diaChi;
  
  const tbody = document.getElementById('modalTableBody');
  if (tbody && household.members) {
    tbody.innerHTML = household.members.map((m, i) => `<tr>
      <td><input type="checkbox" class="member-checkbox" value="${i}" /></td>
      <td>${i + 1}</td>
      <td>${m.hoTen}</td>
      <td>${m.namSinh}</td>
      <td>${m.gioiTinh}</td>
      <td>${m.quanHe}</td>
      <td>${m.cccd}</td>
    </tr>`).join('');
  }
  
  // Bind select all checkbox
  const selectAllCheckbox = document.getElementById('selectAllMembers');
  const memberCheckboxes = document.querySelectorAll('.member-checkbox');
  selectAllCheckbox?.addEventListener('change', (e) => {
    memberCheckboxes.forEach(cb => cb.checked = e.target.checked);
  });
  
  // Hiển thị lịch sử thay đổi
  renderChangeHistory(household);
  
  // Lưu soHK hiện tại để sử dụng ở modal chỉnh sửa
  window.currentEditingSoHK = soHK;
  window.currentEditingHousehold = household;
  
  const modal = document.getElementById('householdModal');
  if (modal) modal.classList.add('is-open');
}

function renderChangeHistory(household) {
  const historyDiv = document.getElementById('changeHistory');
  if (!historyDiv) return;
  
  const history = household.history || [];
  if (history.length === 0) {
    historyDiv.innerHTML = '<p style="color:var(--muted);margin:0;">Chưa có thay đổi</p>';
    return;
  }
  
  historyDiv.innerHTML = history.map(h => `
    <div style="padding:8px 0;border-bottom:1px solid var(--line);">
      <div style="font-weight:600;color:var(--text);">${h.action}</div>
      <div style="color:var(--muted);font-size:12px;">${h.date}</div>
    </div>
  `).join('');
}

function closeHouseholdModal() {
  const modal = document.getElementById('householdModal');
  if (modal) modal.classList.remove('is-open');
}

function bindModal() {
  document.getElementById('closeModal')?.addEventListener('click', closeHouseholdModal);
  document.querySelector('#householdModal .modal__overlay')?.addEventListener('click', closeHouseholdModal);
  
  // Bind edit household button
  document.getElementById('editHouseholdBtn')?.addEventListener('click', openEditHouseholdModal);
  
  // Bind split household button
  document.getElementById('splitHouseholdBtn')?.addEventListener('click', openSplitHouseholdModal);
  
  // Bind add member button
  document.getElementById('addMemberBtn')?.addEventListener('click', openAddMemberModal);
  
  // Bind remove member button
  document.getElementById('removeMemberBtn')?.addEventListener('click', removeSelectedMembers);
  
  // Bind create household from members button
  document.getElementById('createHouseholdFromMembersBtn')?.addEventListener('click', createHouseholdFromMembers);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeHouseholdModal();
  });
}

// ======== EDIT HOUSEHOLD MODAL =========
function openEditHouseholdModal() {
  const household = window.currentEditingHousehold;
  if (!household) return;
  
  document.getElementById('edit_soHK').value = household.soHK;
  document.getElementById('edit_chuHo').value = household.chuHo;
  document.getElementById('edit_diaChi').value = household.diaChi;
  
  const modal = document.getElementById('editHouseholdModal');
  if (modal) modal.classList.add('is-open');
}

function bindEditHouseholdModal() {
  const modal = document.getElementById('editHouseholdModal');
  const closeBtn = document.getElementById('closeEditModal');
  const cancelBtn = document.getElementById('cancelEditBtn');
  const form = document.getElementById('editHouseholdForm');
  
  closeBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('is-open');
  });
  
  cancelBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('is-open');
  });
  
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  });
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const soHK = document.getElementById('edit_soHK').value;
    const chuHo = document.getElementById('edit_chuHo').value.trim();
    const diaChi = document.getElementById('edit_diaChi').value.trim();
    
    if (!chuHo || !diaChi) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    const household = originalRows.find(h => h.soHK === soHK);
    if (household) {
      household.chuHo = chuHo;
      household.diaChi = diaChi;
      if (!household.history) household.history = [];
      household.history.push({
        action: `Chỉnh sửa: Chủ hộ -> ${chuHo}, Địa chỉ -> ${diaChi}`,
        date: new Date().toLocaleString('vi-VN')
      });
      
      dataService.saveHouseholds(originalRows);
      
      modal.classList.remove('is-open');
      renderTable();
      
      // Update detail modal if open
      document.getElementById('modalChuHo').textContent = chuHo;
      document.getElementById('modalDiaChi').textContent = diaChi;
      renderChangeHistory(household);
      
      alert('Cập nhật hộ khẩu thành công');
    }
  });
}

// ======== SPLIT HOUSEHOLD MODAL =========
function openSplitHouseholdModal() {
  const household = window.currentEditingHousehold;
  if (!household) return;
  
  const checkedBoxes = document.querySelectorAll('.member-checkbox:checked');
  if (checkedBoxes.length === 0) {
    alert('Vui lòng chọn ít nhất 1 thành viên để tách hộ');
    return;
  }
  
  const splitMemberList = document.getElementById('splitMemberList');
  if (splitMemberList) {
    const selectedMembers = Array.from(checkedBoxes).map(cb => {
      const idx = parseInt(cb.value);
      return household.members[idx];
    });
    
    splitMemberList.innerHTML = selectedMembers.map((m, i) => `
      <div style="padding:8px;border-bottom:1px solid #e5e7eb;">
        ${i + 1}. ${m.hoTen} - ${m.namSinh} - ${m.gioiTinh}
      </div>
    `).join('');
    
    window.splitSelectedMembers = selectedMembers;
    window.splitSelectedIndices = Array.from(checkedBoxes).map(cb => parseInt(cb.value));
  }
  
  const modal = document.getElementById('splitHouseholdModal');
  if (modal) modal.classList.add('is-open');
}

function bindSplitHouseholdModal() {
  const modal = document.getElementById('splitHouseholdModal');
  const closeBtn = document.getElementById('closeSplitModal');
  const cancelBtn = document.getElementById('cancelSplitBtn');
  const form = document.getElementById('splitHouseholdForm');
  
  closeBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('is-open');
  });
  
  cancelBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('is-open');
  });
  
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  });
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const soHK = document.getElementById('split_soHK').value.trim();
    const chuHo = document.getElementById('split_chuHo').value.trim();
    const diaChi = document.getElementById('split_diaChi').value.trim();
    
    if (!soHK || !chuHo || !diaChi) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (originalRows.some(h => h.soHK === soHK)) {
      alert('Số hộ khẩu đã tồn tại');
      return;
    }
    
    const selectedMembers = window.splitSelectedMembers || [];
    const selectedIndices = window.splitSelectedIndices || [];
    
    if (selectedMembers.length === 0) {
      alert('Không có thành viên nào được chọn');
      return;
    }
    
    // Tạo hộ khẩu mới
    const newHousehold = {
      soHK,
      chuHo,
      diaChi,
      sl: selectedMembers.length,
      members: selectedMembers.map(m => ({...m, soHK})),
      history: [{
        action: `Tách từ hộ khẩu ${window.currentEditingSoHK}`,
        date: new Date().toLocaleString('vi-VN')
      }]
    };
    
    // Xóa thành viên khỏi hộ cũ
    const oldHousehold = window.currentEditingHousehold;
    oldHousehold.members = oldHousehold.members.filter((m, idx) => !selectedIndices.includes(idx));
    oldHousehold.sl = oldHousehold.members.length;
    oldHousehold.history = oldHousehold.history || [];
    oldHousehold.history.push({
      action: `Tách ${selectedMembers.length} thành viên sang hộ ${soHK}`,
      date: new Date().toLocaleString('vi-VN')
    });
    
    originalRows.push(newHousehold);
    dataService.saveHouseholds(originalRows);
    
    modal.classList.remove('is-open');
    form.reset();
    closeHouseholdModal();
    renderTable();
    
    alert('Tách hộ khẩu thành công');
  });
}

// ======== ADD MEMBER MODAL =========
function openAddMemberModal() {
  const modal = document.getElementById('addMemberModal');
  if (modal) modal.classList.add('is-open');
}

function bindAddMemberModal() {
  const modal = document.getElementById('addMemberModal');
  const closeBtn = document.getElementById('closeAddMemberModal');
  const cancelBtn = document.getElementById('cancelAddMemberBtn');
  const form = document.getElementById('addMemberForm');
  
  closeBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('is-open');
  });
  
  cancelBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('is-open');
  });
  
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  });
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const hoTen = document.getElementById('member_hoTen').value.trim();
    const namSinh = parseInt(document.getElementById('member_namSinh').value);
    const gioiTinh = document.getElementById('member_gioiTinh').value;
    const quanHe = document.getElementById('member_quanHe').value;
    const cccd = document.getElementById('member_cccd').value.trim();
    
    if (!hoTen || !namSinh || !gioiTinh || !quanHe) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    const household = window.currentEditingHousehold;
    if (!household) return;
    
    const newMember = {
      hoTen,
      namSinh,
      gioiTinh,
      quanHe,
      cccd: cccd || '',
      soHK: household.soHK
    };
    
    if (!household.members) household.members = [];
    household.members.push(newMember);
    household.sl = household.members.length;
    
    if (!household.history) household.history = [];
    household.history.push({
      action: `Thêm thành viên: ${hoTen}`,
      date: new Date().toLocaleString('vi-VN')
    });
    
    dataService.saveHouseholds(originalRows);
    
    modal.classList.remove('is-open');
    form.reset();
    
    // Refresh modal table
    openHouseholdModal(household.soHK);
    renderTable();
    
    alert('Thêm thành viên thành công');
  });
}

// ======== REMOVE MEMBERS =========
function removeSelectedMembers() {
  const checkedBoxes = document.querySelectorAll('.member-checkbox:checked');
  if (checkedBoxes.length === 0) {
    alert('Vui lòng chọn ít nhất 1 thành viên để xóa');
    return;
  }
  
  if (!confirm(`Bạn có chắc muốn xóa ${checkedBoxes.length} thành viên?`)) {
    return;
  }
  
  const household = window.currentEditingHousehold;
  if (!household) return;
  
  const indicesToRemove = Array.from(checkedBoxes).map(cb => parseInt(cb.value));
  const removedMembers = indicesToRemove.map(idx => household.members[idx].hoTen);
  
  household.members = household.members.filter((m, idx) => !indicesToRemove.includes(idx));
  household.sl = household.members.length;
  
  if (!household.history) household.history = [];
  household.history.push({
    action: `Xóa thành viên: ${removedMembers.join(', ')}`,
    date: new Date().toLocaleString('vi-VN')
  });
  
  dataService.saveHouseholds(originalRows);
  
  // Refresh modal
  openHouseholdModal(household.soHK);
  renderTable();
  
  alert('Xóa thành viên thành công');
}

// ======== CREATE HOUSEHOLD FROM MEMBERS =========
function createHouseholdFromMembers() {
  const checkedBoxes = document.querySelectorAll('.member-checkbox:checked');
  if (checkedBoxes.length === 0) {
    alert('Vui lòng chọn ít nhất 1 thành viên');
    return;
  }
  
  openSplitHouseholdModal();
}

// ======== CREATE HOUSEHOLD MODAL =========
function bindCreateHouseholdModal() {
  const openBtn = document.getElementById('openCreateHouseholdModal');
  const modal = document.getElementById('createHouseholdModal');
  const closeBtn = document.getElementById('closeCreateModal');
  const cancelBtn = document.getElementById('cancelCreateBtn');
  const form = document.getElementById('createHouseholdForm');
  
  openBtn?.addEventListener('click', () => {
    if (modal) modal.classList.add('is-open');
  });
  
  closeBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('is-open');
  });
  
  cancelBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('is-open');
  });
  
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  });
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const soHK = document.getElementById('nhk_soHK').value.trim();
    const chuHo = document.getElementById('nhk_chuHo').value.trim();
    const diaChi = document.getElementById('nhk_diaChi').value.trim();
    
    if (!soHK || !chuHo || !diaChi) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    // Kiểm tra trùng số hộ khẩu
    if (originalRows.some(h => h.soHK === soHK)) {
      alert('Số hộ khẩu đã tồn tại');
      return;
    }
    
    // Tạo hộ khẩu mới
    const newHousehold = {
      soHK,
      chuHo,
      diaChi,
      sl: 0,
      members: [],
      history: [{
        action: 'Tạo hộ khẩu mới',
        date: new Date().toLocaleString('vi-VN')
      }]
    };
    
    originalRows.push(newHousehold);
    dataService.saveHouseholds(originalRows);
    
    // Đóng modal và reset form
    modal.classList.remove('is-open');
    form.reset();
    
    // Refresh table
    renderTable();
    
    alert('Tạo hộ khẩu mới thành công');
  });
}
