// Temporary Controller - Tạm trú/Tạm vắng management
import { save, load, ymd } from '../utils/helpers.js';

let temporaryInited = false;
let tempFiltersBound = false;
let activeFiltersBound = false;
let allTemp = [];
let tempPage = 1;
let activePage = 1;

function formatDateVN(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${(date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`}/${date.getFullYear()}`;
}

function getTempStats() {
  const pending = allTemp.filter(t => t.state === 'Chưa duyệt').length;
  const approved = allTemp.filter(t => t.state === 'Đã duyệt').length;
  const rejected = allTemp.filter(t => t.state === 'Bị từ chối').length;
  const total = allTemp.length;
  return { pending, approved, rejected, total };
}

function updateTempStats() {
  const stats = getTempStats();
  document.getElementById('pendingTempCount').textContent = stats.pending;
  document.getElementById('approvedTempCount').textContent = stats.approved;
  document.getElementById('rejectedTempCount').textContent = stats.rejected;
  document.getElementById('totalTempCount').textContent = stats.total;
}

function bindTempFilters() {
  if (tempFiltersBound) return;
  tempFiltersBound = true;

  const statusSelect = document.getElementById('tempStatusFilter');
  const typeSelect = document.getElementById('tempTypeFilter');
  if (statusSelect) statusSelect.addEventListener('change', renderTempTable);
  if (typeSelect) typeSelect.addEventListener('change', renderTempTable);
}

function filterTemp() {
  const statusFilter = document.getElementById('tempStatusFilter')?.value || '';
  const typeFilter = document.getElementById('tempTypeFilter')?.value || '';
  return allTemp.filter(t => {
    const matchStatus = !statusFilter || t.status === statusFilter;
    const matchType = !typeFilter || t.type === typeFilter;
    return matchStatus && matchType;
  });
}

function renderTempTable() {
  const filtered = filterTemp();
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  tempPage = Math.min(tempPage, totalPages);

  const tbody = document.querySelector('#tempTable tbody');
  if (tbody) {
    const slice = filtered.slice((tempPage - 1) * PAGE_SIZE, (tempPage - 1) * PAGE_SIZE + PAGE_SIZE);
    tbody.innerHTML = slice.map((t, i) => {
      const typeText = t._type === 'Tạm trú' ? 'Tạm trú' : 'Thường trú';
      const statusColor = t.state === 'Chưa duyệt' ? '#f59e0b' : t.state === 'Đã duyệt' ? '#22c55e' : '#ef4444';
      const statusText = t.state === 'Chưa duyệt' ? 'Chưa duyệt' : t.state === 'Đã duyệt' ? 'Đã duyệt' : 'Bị từ chối';
      const actionBtns = t.state === 'Chưa duyệt'
        ? `<button class="btn" onclick="window.approveTempRecord('${t.id_dk}')" style="font-size:12px;padding:6px 12px;margin-right:4px;">✓ Duyệt</button>
           <button class="btn" onclick="window.rejectTempRecord('${t.id_dk}')" style="font-size:12px;padding:6px 12px;color:#ef4444;border-color:#ef4444;">✕ Từ chối</button>`
        : '';
      return `<tr>
        <td>${(tempPage - 1) * PAGE_SIZE + i + 1}</td>
        <td><strong>${t.ho_ten}</strong></td>
        <td>${typeText}</td>
        <td>${formatDateVN(t.begin)}</td>
        <td>${formatDateVN(t.end)}</td>
        <td style="text-align:center;"><button class="btn-view" data-sohk="${t.id_dk}" style="background:white; color:black; border:1px solid #ccc;">&#8505</button></td>
        <td><span style="background:${statusColor}20;color:${statusColor};padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">${statusText}</span></td>
        <td style="text-align:center;">${actionBtns}</td>
      </tr>`;
    }).join('');
    document.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => {
        // openHouseholdModal(btn.dataset.sohk);
        openTempDetail(btn.dataset.sohk);
        // console.log(btn.dataset.sohk);
      });
    });
  }

  const empty = document.getElementById('emptyStateTemp');
  if (empty) empty.style.display = filtered.length === 0 ? 'block' : 'none';

  const pi = document.getElementById('pageInfoTemp');
  if (pi) pi.textContent = `Trang ${tempPage}/${totalPages}`;

  const prev = document.getElementById('prevPageTemp'), next = document.getElementById('nextPageTemp');
  if (prev) {
    prev.disabled = tempPage <= 1;
    prev.onclick = () => { if (tempPage > 1) { tempPage--; renderTempTable(); } };
  }
  if (next) {
    next.disabled = tempPage >= totalPages;
    next.onclick = () => { if (tempPage < totalPages) { tempPage++; renderTempTable(); } };
  }
}

async function openTempDetail(soHK) {
  const curTemp = allTemp.find(h => h.id_dk == soHK);
  // console.log(">>", household);
  if (!curTemp) return;

  document.getElementById('id_dk').textContent = curTemp.id_dk;
  document.getElementById('nguoiLamDon').textContent = curTemp.ho_ten;
  document.getElementById('loaiDon').textContent = curTemp._type;
  let colora, colorb, colorc;
  if (curTemp.state === 'Chưa duyệt') {
    colora = '#f59e0b20';
    colorb = '#f59e0b';
    colorc = '#9d6910ff';
  }
  else if (curTemp.state === 'Đã duyệt') {
    colora = '#22c55e20';
    colorb = '#22c55e';
    colorc = '#1e6f3fff';
  }
  else {
    colora = '#ef444420';
    colorb = '#ef4444';
    colorc = '#7f1d1d';
  }
  const tempStatusEl = document.getElementById('Tempstatus');
  if (tempStatusEl) {
    tempStatusEl.textContent = curTemp.state;
    tempStatusEl.style.cssText = `
  display: inline-block;
  background: ${colora};
  color: ${colorb};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;

  border: 2px solid ${colorc};   /* viền đen */
  margin: 0px 0;             /* khoảng cách với component khác */
`;

  }
  // try {
  //   const response = await fetch(`http://localhost:3000/api/get/householdMembers/${household.id_ho_khau}`);
  //   const data = await response.json();
  //   household.members = data;
  // }
  // catch (error) {
  //   console.error("Error fetching feedback stats: ", error);
  //   // household.members = null;
  // }
  const tbody = document.getElementById('modalTableBody');
  // if (tbody && household.members) {
  //   tbody.innerHTML = household.members.map((m, i) => `<tr>
  //     <td><input type="checkbox" class="member-checkbox" value="${i}" /></td>
  //     <td>${i + 1}</td>
  //     <td>${m.ho_ten}</td>
  //     <td>${m.nam_sinh}</td>
  //     <td>${m.gioi_tinh}</td>
  //     <td>${m.quan_he_voi_chu_ho}</td>
  //     <td>${m.cccd || '-'}</td>
  //   </tr>`).join('');
  // }

  // Bind select all checkbox
  // const selectAllCheckbox = document.getElementById('selectAllMembers');
  // const memberCheckboxes = document.querySelectorAll('.member-checkbox');
  // selectAllCheckbox?.addEventListener('change', (e) => {
  //   memberCheckboxes.forEach(cb => cb.checked = e.target.checked);
  // });

  // Hiển thị lịch sử thay đổi
  // renderChangeHistory(household);

  // Lưu soHK hiện tại để sử dụng ở modal chỉnh sửa
  window.curTempID = soHK;
  window.curTempType = curTemp._type;
  window.curTempState = curTemp._state;
  const modal = document.getElementById('tempDetail');
  if (modal) modal.classList.add('is-open');
}

function closeTempDetail() {
  const modal = document.getElementById('tempDetail');
  if (modal) {
    modal.classList.remove('is-open');
    // renderTable();
  }
}


function bindTempDetailModel() {
  document.getElementById('closeModal')?.addEventListener('click', closeTempDetail);
  document.querySelector('#tempDetail .modal__overlay')?.addEventListener('click', closeTempDetail);

  // Bind edit household button
  // document.getElementById('editHouseholdBtn')?.addEventListener('click', openEditHouseholdModal);

  // Bind split household button
  // document.getElementById('splitHouseholdBtn')?.addEventListener('click', openSplitHouseholdModal);

  // Bind add member button
  // document.getElementById('addMemberBtn')?.addEventListener('click', openAddMemberModal);

  // Bind remove member button
  // document.getElementById('removeMemberBtn')?.addEventListener('click', removeSelectedMembers);

  // Bind create household from members button
  // document.getElementById('createHouseholdFromMembersBtn')?.addEventListener('click', createHouseholdFromMembers);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTempDetail();
  });
}

function approveTempRecord(id) {
  const record = allTemp.find(t => t.id === id);
  if (record) {
    record.status = 'approved';
    save('allTemp', allTemp);
    updateTempStats();
    renderTempTable();
    renderActiveTable();
    alert('Đã phê duyệt đơn của ' + record.name);
  }
}

function rejectTempRecord(id) {
  const reason = prompt('Nhập lý do từ chối:');
  if (reason !== null) {
    const record = allTemp.find(t => t.id === id);
    if (record) {
      record.status = 'rejected';
      record.rejectReason = reason;
      save('allTemp', allTemp);
      updateTempStats();
      renderTempTable();
      renderActiveTable();
      alert('Đã từ chối đơn của ' + record.name);
    }
  }
}

// Active residents section
function getActiveDays(fromDate, toDate) {
  const to = new Date(toDate);
  const today = new Date(ymd(new Date()));
  const diffTime = Math.max(0, to.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function bindActiveFilters() {
  if (activeFiltersBound) return;
  activeFiltersBound = true;

  const typeSelect = document.getElementById('activeTypeFilter');
  const searchInput = document.getElementById('activeSearch');
  if (typeSelect) typeSelect.addEventListener('change', renderActiveTable);
  if (searchInput) searchInput.addEventListener('input', renderActiveTable);
}

function filterActive() {
  const typeFilter = document.getElementById('activeTypeFilter')?.value || '';
  const searchText = document.getElementById('activeSearch')?.value.toLowerCase() || '';

  return allTemp.filter(t => {
    if (t.status !== 'approved') return false;
    const matchType = !typeFilter || t.type === typeFilter;
    const matchSearch = !searchText || t.name.toLowerCase().includes(searchText) || t.phone.includes(searchText);
    return matchType && matchSearch;
  });
}

function renderActiveTable() {
  const filtered = filterActive();
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  activePage = Math.min(activePage, totalPages);

  const tbody = document.querySelector('#activeTable tbody');
  if (tbody) {
    const slice = filtered.slice((activePage - 1) * PAGE_SIZE, (activePage - 1) * PAGE_SIZE + PAGE_SIZE);
    tbody.innerHTML = slice.map((t, i) => {
      const typeText = t._type === 'tam_tru' ? '🏠 Tạm trú' : '✈️ Tạm vắng';
      const daysLeft = getActiveDays(t.fromDate, t.toDate);
      const daysColor = daysLeft <= 3 ? '#ef4444' : daysLeft <= 7 ? '#f59e0b' : '#22c55e';
      return `<tr>
        <td>${(activePage - 1) * PAGE_SIZE + i + 1}</td>
        <td><strong>${t.name}</strong></td>
        <td>${typeText}</td>
        <td>${t.fromDate}</td>
        <td>${t.toDate}</td>
        <td>${t.reason}</td>
        <td><span style="color:${daysColor};font-weight:600;">${daysLeft} ngày</span></td>
      </tr>`;
    }).join('');
  }

  const empty = document.getElementById('emptyStateActive');
  if (empty) empty.style.display = filtered.length === 0 ? 'block' : 'none';

  const pi = document.getElementById('pageInfoActive');
  if (pi) pi.textContent = `Trang ${activePage}/${totalPages} (${filtered.length} người)`;

  const prev = document.getElementById('prevPageActive'), next = document.getElementById('nextPageActive');
  if (prev) {
    prev.disabled = activePage <= 1;
    prev.onclick = () => { if (activePage > 1) { activePage--; renderActiveTable(); } };
  }
  if (next) {
    next.disabled = activePage >= totalPages;
    next.onclick = () => { if (activePage < totalPages) { activePage++; renderActiveTable(); } };
  }
}

const getAllTemp = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/get/allTemp');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
export async function initTemporary() {
  // Reset flags to rebind on each visit
  tempFiltersBound = false;
  activeFiltersBound = false;
  allTemp = await getAllTemp();
  // Always refresh data to prevent loss on page navigation
  // allTemp = load('allTemp', [
  //   { id: '1', name: 'Nguyễn Văn A', phone: '0912345678', addr: 'Đà Nẵng, Nhật Bản', type: 'tam_tru', fromDate: '2025-11-20', toDate: '2025-12-20', reason: 'Công tác', status: 'approved', createdDate: '2025-11-18' },
  //   { id: '2', name: 'Trần Thị B', phone: '0987654321', addr: 'Hà Nội', type: 'tam_tru', fromDate: '2025-11-20', toDate: '2025-11-30', reason: 'Thăm người thân', status: 'approved', createdDate: '2025-11-17' },
  //   { id: '3', name: 'Phạm Hữu C', phone: '0934567890', addr: 'TP.HCM', type: 'tam_tru', fromDate: '2025-11-25', toDate: '2026-01-25', reason: 'Học tập', status: 'pending', createdDate: '2025-11-19' },
  //   { id: '4', name: 'Lê Văn D', phone: '0945678901', addr: 'Hải Phòng', type: 'tam_tru', fromDate: '2025-12-01', toDate: '2025-12-10', reason: 'Công việc riêng', status: 'approved', createdDate: '2025-11-16' },
  //   { id: '5', name: 'Hoàng Thị E', phone: '0956789012', addr: 'Cần Thơ', type: 'tam_tru', fromDate: '2025-11-22', toDate: '2025-12-22', reason: 'Du lịch', status: 'pending', createdDate: '2025-11-15' },
  //   { id: '6', name: 'Đỗ Văn F', phone: '0967890123', addr: 'Hà Nam', type: 'tam_tru', fromDate: '2025-11-18', toDate: '2025-11-25', reason: 'Gia đình', status: 'approved', createdDate: '2025-11-14' },
  //   { id: '7', name: 'Nguyễn Thị G', phone: '0978901234', addr: 'Bắc Ninh', type: 'tam_tru', fromDate: '2025-11-23', toDate: '2026-02-23', reason: 'Làm việc', status: 'approved', createdDate: '2025-11-13' },
  //   { id: '8', name: 'Tạ Văn H', phone: '0989012345', addr: 'Vĩnh Phúc', type: 'tam_tru', fromDate: '2025-12-05', toDate: '2025-12-15', reason: 'Sự kiện', status: 'pending', createdDate: '2025-11-12' },
  //   { id: '9', name: 'Vũ Thị I', phone: '0901234567', addr: 'Quảng Ninh', type: 'tam_tru', fromDate: '2025-11-28', toDate: '2025-12-28', reason: 'Đi làm', status: 'approved', createdDate: '2025-11-11' },
  //   { id: '10', name: 'Bùi Văn K', phone: '0912345679', addr: 'Hải Dương', type: 'tam_tru', fromDate: '2025-11-29', toDate: '2025-12-05', reason: 'Khám bệnh', status: 'rejected', createdDate: '2025-11-10' },
  //   { id: '11', name: 'Lê Thị L', phone: '0923456780', addr: 'Hà Nội', type: 'tam_tru', fromDate: '2025-11-21', toDate: '2025-12-21', reason: 'Đào tạo', status: 'approved', createdDate: '2025-11-09' },
  //   { id: '12', name: 'Trần Văn M', phone: '0934567891', addr: 'Đà Nẵng', type: 'tam_tru', fromDate: '2025-12-02', toDate: '2025-12-12', reason: 'Nghỉ mát', status: 'approved', createdDate: '2025-11-08' },
  //   { id: '13', name: 'Nguyễn Văn N', phone: '0945678902', addr: 'Nha Trang', type: 'tam_tru', fromDate: '2025-11-24', toDate: '2026-01-24', reason: 'Kinh doanh', status: 'pending', createdDate: '2025-11-07' },
  //   { id: '14', name: 'Phạm Thị O', phone: '0956789013', addr: 'Huế', type: 'tam_tru', fromDate: '2025-11-26', toDate: '2025-12-08', reason: 'Thăm hỏi', status: 'approved', createdDate: '2025-11-06' },
  //   { id: '15', name: 'Hoàng Văn P', phone: '0967890124', addr: 'Việt Trì', type: 'tam_tru', fromDate: '2025-11-27', toDate: '2025-12-27', reason: 'Tập huấn', status: 'approved', createdDate: '2025-11-05' },
  //   { id: '16', name: 'Đào Thị Q', phone: '0978901235', addr: 'Thanh Hóa', type: 'tam_tru', fromDate: '2025-12-03', toDate: '2025-12-09', reason: 'Học buổi', status: 'pending', createdDate: '2025-11-04' },
  //   { id: '17', name: 'Võ Văn R', phone: '0989012346', addr: 'Nghệ An', type: 'tam_tru', fromDate: '2025-11-22', toDate: '2025-12-22', reason: 'Công tác', status: 'approved', createdDate: '2025-11-03' },
  //   { id: '18', name: 'Lý Thị S', phone: '0901234568', addr: 'Hà Tĩnh', type: 'tam_tru', fromDate: '2025-12-01', toDate: '2025-12-07', reason: 'Du lịch', status: 'approved', createdDate: '2025-11-02' },
  //   { id: '19', name: 'Dương Văn T', phone: '0912345680', addr: 'Quảng Bình', type: 'tam_tru', fromDate: '2025-11-25', toDate: '2026-02-25', reason: 'Dự án', status: 'rejected', createdDate: '2025-11-01' },
  //   { id: '20', name: 'Phan Thị U', phone: '0923456781', addr: 'Quảng Trị', type: 'tam_tru', fromDate: '2025-11-30', toDate: '2025-12-10', reason: 'Công việc', status: 'approved', createdDate: '2025-10-31' },
  //   { id: '21', name: 'Mai Văn V', phone: '0934567892', addr: 'Thừa Thiên Huế', type: 'tam_tru', fromDate: '2025-11-23', toDate: '2025-12-23', reason: 'Tham quan', status: 'approved', createdDate: '2025-10-30' },
  //   { id: '22', name: 'Tô Thị W', phone: '0945678903', addr: 'Quảng Nam', type: 'tam_tru', fromDate: '2025-12-04', toDate: '2025-12-14', reason: 'Gia đình', status: 'pending', createdDate: '2025-10-29' },
  //   { id: '23', name: 'Hà Văn X', phone: '0956789014', addr: 'Quảng Ngãi', type: 'tam_tru', fromDate: '2025-11-26', toDate: '2026-01-26', reason: 'Làm ăn', status: 'approved', createdDate: '2025-10-28' },
  //   { id: '24', name: 'Cao Thị Y', phone: '0967890125', addr: 'Bình Định', type: 'tam_tru', fromDate: '2025-11-28', toDate: '2025-12-06', reason: 'Nghỉ phép', status: 'approved', createdDate: '2025-10-27' },
  //   { id: '25', name: 'Lê Văn Z', phone: '0978901236', addr: 'Phú Yên', type: 'tam_tru', fromDate: '2025-11-24', toDate: '2025-12-24', reason: 'Công tác', status: 'approved', createdDate: '2025-10-26' },
  //   { id: '26', name: 'Nguyễn Thị AA', phone: '0989012347', addr: 'Khánh Hòa', type: 'tam_tru', fromDate: '2025-12-02', toDate: '2025-12-11', reason: 'Du lịch', status: 'rejected', createdDate: '2025-10-25' },
  //   { id: '27', name: 'Trần Văn BB', phone: '0901234569', addr: 'Ninh Thuận', type: 'tam_tru', fromDate: '2025-11-29', toDate: '2026-01-29', reason: 'Học tập', status: 'pending', createdDate: '2025-10-24' },
  //   { id: '28', name: 'Phạm Thị CC', phone: '0912345681', addr: 'Bình Thuận', type: 'tam_tru', fromDate: '2025-11-27', toDate: '2025-12-09', reason: 'Thăm thân', status: 'approved', createdDate: '2025-10-23' },
  //   { id: '29', name: 'Hoàng Văn DD', phone: '0923456782', addr: 'Bình Phước', type: 'tam_tru', fromDate: '2025-11-25', toDate: '2025-12-25', reason: 'Kiểm tra', status: 'approved', createdDate: '2025-10-22' },
  //   { id: '30', name: 'Đỗ Thị EE', phone: '0934567893', addr: 'Tây Ninh', type: 'tam_tru', fromDate: '2025-12-01', toDate: '2025-12-08', reason: 'Công việc', status: 'approved', createdDate: '2025-10-21' },
  //   { id: '31', name: 'Vũ Văn FF', phone: '0945678904', addr: 'Bình Dương', type: 'tam_tru', fromDate: '2025-11-21', toDate: '2026-02-21', reason: 'Làm việc', status: 'approved', createdDate: '2025-10-20' },
  //   { id: '32', name: 'Bùi Thị GG', phone: '0956789015', addr: 'Đồng Nai', type: 'tam_tru', fromDate: '2025-11-30', toDate: '2025-12-13', reason: 'Nghỉ mát', status: 'pending', createdDate: '2025-10-19' },
  //   { id: '33', name: 'Lê Văn HH', phone: '0967890126', addr: 'Bà Rịa', type: 'tam_tru', fromDate: '2025-11-26', toDate: '2025-12-26', reason: 'Kiểm tra', status: 'approved', createdDate: '2025-10-18' },
  //   { id: '34', name: 'Trần Thị II', phone: '0978901237', addr: 'Long An', type: 'tam_tru', fromDate: '2025-12-03', toDate: '2025-12-12', reason: 'Thăm thân', status: 'approved', createdDate: '2025-10-17' },
  //   { id: '35', name: 'Nguyễn Văn JJ', phone: '0989012348', addr: 'Tiền Giang', type: 'tam_tru', fromDate: '2025-11-22', toDate: '2025-12-22', reason: 'Du lịch', status: 'rejected', createdDate: '2025-10-16' },
  //   { id: '36', name: 'Phạm Văn KK', phone: '0901234570', addr: 'Bến Tre', type: 'tam_tru', fromDate: '2025-11-28', toDate: '2025-12-07', reason: 'Công tác', status: 'approved', createdDate: '2025-10-15' },
  //   { id: '37', name: 'Hoàng Thị LL', phone: '0912345682', addr: 'Trà Vinh', type: 'tam_tru', fromDate: '2025-11-24', toDate: '2026-01-24', reason: 'Làm việc', status: 'approved', createdDate: '2025-10-14' },
  //   { id: '38', name: 'Đào Văn MM', phone: '0923456783', addr: 'Vĩnh Long', type: 'tam_tru', fromDate: '2025-12-04', toDate: '2025-12-15', reason: 'Học tập', status: 'pending', createdDate: '2025-10-13' }
  // ]);

  updateTempStats();
  if (!temporaryInited) {
    bindTempDetailModel();
    bindTempFilters();
    bindActiveFilters();
    temporaryInited = true;
  }
  renderTempTable();
  renderActiveTable();
}
temporaryInited = false;
// Make functions globally available for onclick handlers
window.approveTempRecord = approveTempRecord;
window.rejectTempRecord = rejectTempRecord;
