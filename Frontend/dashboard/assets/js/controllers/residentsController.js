// Residents Controller - Resident management logic
import * as dataService from '../services/api.js';

let residentsInited = false;
let residentsFiltersBound = false;
let residentsDetailModalBound = false;
let residentsEditModalBound = false;
let allMembers = [];
let residentPage = 1;
let residentSortState = { key: null, dir: 1 };

async function aggregateAllMembers() {
  allMembers = [];
  const households = await dataService.getHouseholds();
  households.forEach(household => {
    if (household.members && household.members.length > 0) {
      household.members.forEach(member => {
        allMembers.push({
          ...member,
          soHK: household.soHK,
          chuHo: household.chuHo
        });
      });
    }
  });
  return allMembers;
}

function getResidentStats() {
  const total = allMembers.length;
  const male = allMembers.filter(m => m.gioiTinh === 'Nam').length;
  const female = allMembers.filter(m => m.gioiTinh === 'Nữ').length;
  const avgAge = total > 0 ? Math.round(allMembers.reduce((sum, m) => sum + (new Date().getFullYear() - m.namSinh), 0) / total) : 0;
  return { total, male, female, avgAge };
}

function filterResidents(q, genderFilter = '', householdFilter = '') {
  q = q.trim().toLowerCase();
  return allMembers.filter(m => {
    const matchSearch = !q || m.hoTen.toLowerCase().includes(q) || (m.cccd && m.cccd.includes(q));
    const matchGender = !genderFilter || m.gioiTinh === genderFilter;
    const matchHousehold = !householdFilter || m.soHK === householdFilter;
    return matchSearch && matchGender && matchHousehold;
  });
}

function sortResidents(rows) {
  if (!residentSortState.key) return rows;
  const { key, dir } = residentSortState;
  return [...rows].sort((a, b) => {
    const va = a[key], vb = b[key];
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
    return String(va || '').localeCompare(String(vb || ''), 'vi') * dir;
  });
}

function renderResidentTable() {
  const search = document.getElementById('residentSearch')?.value || '';
  const genderFilter = document.getElementById('residentGenderFilter')?.value || '';
  const householdFilter = document.getElementById('residentHouseholdFilter')?.value || '';

  const filtered = filterResidents(search, genderFilter, householdFilter);
  const sorted = sortResidents(filtered);

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  residentPage = Math.min(residentPage, totalPages);

  const tbody = document.querySelector('#residentTable tbody');
  if (tbody) {
    const slice = sorted.slice((residentPage - 1) * PAGE_SIZE, (residentPage - 1) * PAGE_SIZE + PAGE_SIZE);
    tbody.innerHTML = slice.map((m, i) => `<tr>
      <td>${(residentPage - 1) * PAGE_SIZE + i + 1}</td>
      <td><strong>${m.hoTen}</strong></td>
      <td>${m.biDanh || '-'}</td>
      <td>${m.ngaySinh || '-'}</td>
      <td>${m.gioiTinh}</td>
      <td>${m.noiSinh || '-'}</td>
      <td>${m.nguyenQuan || '-'}</td>
      <td>${m.danToc || '-'}</td>
      <td>${m.cccd || '-'}</td>
      <td>${m.quanHe}</td>
      <td><button class="btn-view" style="font-size:12px;padding:6px 10px;">👁 Xem</button></td>
    </tr>`).join('');
  }

  const empty = document.getElementById('emptyStateResident');
  if (empty) empty.style.display = sorted.length === 0 ? 'block' : 'none';

  const pi = document.getElementById('pageInfoResidents');
  if (pi) pi.textContent = `Trang ${residentPage}/${totalPages} (${sorted.length} kết quả)`;

  const prev = document.getElementById('prevPageResidents'), next = document.getElementById('nextPageResidents');
  if (prev) {
    prev.disabled = residentPage <= 1;
    prev.onclick = () => { if (residentPage > 1) { residentPage--; renderResidentTable(); } };
  }
  if (next) {
    next.disabled = residentPage >= totalPages;
    next.onclick = () => { if (residentPage < totalPages) { residentPage++; renderResidentTable(); } };
  }

  // Bind view buttons
  document.querySelectorAll('.btn-view').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const actualIdx = (residentPage - 1) * PAGE_SIZE + idx;
      if (actualIdx < sorted.length) openResidentDetailModal(sorted[actualIdx]);
    });
  });
}

function openResidentDetailModal(resident) {
  if (!resident) return;

  // Lưu resident hiện tại để sử dụng khi chỉnh sửa
  window.currentEditingResident = resident;

  const households = dataService.getHouseholds();
  const household = households.find(h => h.soHK === resident.soHK);

  document.getElementById('residentName').textContent = resident.hoTen || '-';
  document.getElementById('residentNickname').textContent = resident.biDanh || '-';
  document.getElementById('residentCCCD').textContent = resident.cccd || '-';
  document.getElementById('residentBirthDate').textContent = resident.ngaySinh || '-';
  document.getElementById('residentGender').textContent = resident.gioiTinh || '-';
  document.getElementById('residentBirthPlace').textContent = resident.noiSinh || '-';
  document.getElementById('residentOrigin').textContent = resident.nguonQuan || '-';
  document.getElementById('residentEthnicity').textContent = resident.danToc || '-';

  document.getElementById('residentRegDate').textContent = resident.ngayDangKy || '-';
  document.getElementById('residentPreviousAddr').textContent = resident.diaChiTruocDo || '-';
  document.getElementById('residentCurrentAddr').textContent = resident.diaChiHienTai || '-';
  document.getElementById('residentStatus').textContent = resident.trangThaiCuTru || '-';

  document.getElementById('residentCCCDPlace').textContent = resident.noiCapCCCD || '-';
  document.getElementById('residentCCCDDate').textContent = resident.ngayCapCCCD || '-';

  document.getElementById('residentProfession').textContent = resident.nghePhuong || '-';
  document.getElementById('residentWorkplace').textContent = resident.noiLamViec || '-';

  document.getElementById('residentHousehold').textContent = resident.soHK || '-';
  document.getElementById('residentHeadOfHouse').textContent = household ? household.chuHo : '-';
  document.getElementById('residentRelation').textContent = resident.quanHe || '-';

  const modal = document.getElementById('residentDetailModal');
  if (modal) modal.classList.add('is-open');
}

function closeResidentDetailModal() {
  const modal = document.getElementById('residentDetailModal');
  if (modal) modal.classList.remove('is-open');
}

function bindResidentDetailModal() {
  if (residentsDetailModalBound) return;
  residentsDetailModalBound = true;

  document.getElementById('closeResidentDetailModal')?.addEventListener('click', closeResidentDetailModal);
  document.getElementById('closeResidentDetailBtn')?.addEventListener('click', closeResidentDetailModal);
  document.getElementById('editResidentBtn')?.addEventListener('click', openEditResidentModal);
  document.getElementById('residentDetailModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('residentDetailModal')) closeResidentDetailModal();
  });
}

function bindResidentFilters() {
  if (residentsFiltersBound) return;
  residentsFiltersBound = true;

  const search = document.getElementById('residentSearch');
  const genderFilter = document.getElementById('residentGenderFilter');
  const householdFilter = document.getElementById('residentHouseholdFilter');

  const onFilterChange = () => {
    residentPage = 1;
    renderResidentTable();
  };

  search?.addEventListener('input', onFilterChange);
  genderFilter?.addEventListener('change', onFilterChange);
  householdFilter?.addEventListener('change', onFilterChange);

  // Bind sort on table headers
  document.querySelectorAll('#residentTable thead th').forEach((th, idx) => {
    if (idx > 0) th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const keys = ['', 'hoTen', 'namSinh', 'gioiTinh', 'quanHe', 'cccd', 'soHK'];
      const key = keys[idx];
      if (!key) return;
      if (residentSortState.key === key) residentSortState.dir *= -1;
      else { residentSortState.key = key; residentSortState.dir = 1; }
      renderResidentTable();
    });
  });
}

function populateHouseholdFilter() {
  const filter = document.getElementById('residentHouseholdFilter');
  if (!filter) return;
  const households = new Set(allMembers.map(m => m.soHK));
  const currentVal = filter.value;
  filter.innerHTML = '<option value="">Tất cả hộ khẩu</option>' +
    Array.from(households).sort().map(soHK => `<option value="${soHK}">${soHK}</option>`).join('');
  filter.value = currentVal;
}

export function initResidents() {
  // Always refresh data to prevent loss on page navigation
  aggregateAllMembers();
  populateHouseholdFilter();

  const stats = getResidentStats();
  document.getElementById('totalResidents').textContent = stats.total;
  document.getElementById('maleResidents').textContent = stats.male;
  document.getElementById('femaleResidents').textContent = stats.female;
  document.getElementById('avgAge').textContent = stats.avgAge;

  // Bind event listeners (reset flags each time to rebind)
  residentsFiltersBound = false;
  residentsDetailModalBound = false;
  residentsEditModalBound = false;

  bindResidentFilters();
  bindResidentDetailModal();
  bindEditResidentModal();

  renderResidentTable();
}

function updateCCCDFieldsVisibility(tuoi) {
  const cccdFieldsRow = document.getElementById('cccdFieldsRow');
  const cccdSectionTitle = document.getElementById('cccdSectionTitle');

  if (tuoi < 14) {
    if (cccdFieldsRow) cccdFieldsRow.style.display = 'none';
    if (cccdSectionTitle) cccdSectionTitle.style.display = 'none';
  } else {
    if (cccdFieldsRow) cccdFieldsRow.style.display = '';
    if (cccdSectionTitle) cccdSectionTitle.style.display = '';
  }
}

function openEditResidentModal() {
  const resident = window.currentEditingResident;
  if (!resident) return;

  document.getElementById('edit_res_hoTen').value = resident.hoTen || '';
  document.getElementById('edit_res_biDanh').value = resident.biDanh || '';
  document.getElementById('edit_res_namSinh').value = resident.namSinh || '';
  document.getElementById('edit_res_gioiTinh').value = resident.gioiTinh || '';
  document.getElementById('edit_res_cccd').value = resident.cccd || '';
  document.getElementById('edit_res_noiSinh').value = resident.noiSinh || '';
  document.getElementById('edit_res_nguonQuan').value = resident.nguonQuan || '';
  document.getElementById('edit_res_danToc').value = resident.danToc || '';
  document.getElementById('edit_res_ngayDangKy').value = resident.ngayDangKy || '';
  document.getElementById('edit_res_diaChiTruocDo').value = resident.diaChiTruocDo || '';
  document.getElementById('edit_res_noiCapCCCD').value = resident.noiCapCCCD || '';
  document.getElementById('edit_res_ngayCapCCCD').value = resident.ngayCapCCCD || '';
  document.getElementById('edit_res_nghePhuong').value = resident.nghePhuong || '';
  document.getElementById('edit_res_noiLamViec').value = resident.noiLamViec || '';

  // Check age and show/hide CCCD fields
  const tuoiHienTai = new Date().getFullYear() - resident.namSinh;
  updateCCCDFieldsVisibility(tuoiHienTai);

  // Add change listener for year of birth field
  const namSinhInput = document.getElementById('edit_res_namSinh');
  if (namSinhInput && !namSinhInput.hasAttribute('data-listener-added')) {
    namSinhInput.addEventListener('change', (e) => {
      const tuoi = new Date().getFullYear() - parseInt(e.target.value);
      updateCCCDFieldsVisibility(tuoi);
    });
    namSinhInput.setAttribute('data-listener-added', 'true');
  }

  const modal = document.getElementById('editResidentModal');
  if (modal) modal.classList.add('is-open');
}

function closeEditResidentModal() {
  const modal = document.getElementById('editResidentModal');
  if (modal) modal.classList.remove('is-open');
}

function bindEditResidentModal() {
  if (residentsEditModalBound) return;
  residentsEditModalBound = true;

  const modal = document.getElementById('editResidentModal');
  const closeBtn = document.getElementById('closeEditResidentModal');
  const cancelBtn = document.getElementById('cancelEditResidentBtn');
  const form = document.getElementById('editResidentForm');

  closeBtn?.addEventListener('click', closeEditResidentModal);
  cancelBtn?.addEventListener('click', closeEditResidentModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeEditResidentModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const resident = window.currentEditingResident;
    if (!resident) return;

    resident.hoTen = document.getElementById('edit_res_hoTen').value.trim();
    resident.biDanh = document.getElementById('edit_res_biDanh').value.trim();
    resident.namSinh = parseInt(document.getElementById('edit_res_namSinh').value) || resident.namSinh;
    resident.gioiTinh = document.getElementById('edit_res_gioiTinh').value;
    resident.cccd = document.getElementById('edit_res_cccd').value.trim();
    resident.noiSinh = document.getElementById('edit_res_noiSinh').value.trim();
    resident.nguonQuan = document.getElementById('edit_res_nguonQuan').value.trim();
    resident.danToc = document.getElementById('edit_res_danToc').value.trim();
    resident.ngayDangKy = document.getElementById('edit_res_ngayDangKy').value;
    resident.diaChiTruocDo = document.getElementById('edit_res_diaChiTruocDo').value.trim();
    resident.noiCapCCCD = document.getElementById('edit_res_noiCapCCCD').value.trim();
    resident.ngayCapCCCD = document.getElementById('edit_res_ngayCapCCCD').value;
    resident.nghePhuong = document.getElementById('edit_res_nghePhuong').value.trim();
    resident.noiLamViec = document.getElementById('edit_res_noiLamViec').value.trim();

    dataService.save();
    closeEditResidentModal();
    aggregateAllMembers();
    openResidentDetailModal(resident);
    alert('Cập nhật thông tin nhân khẩu thành công!');
  });
}
