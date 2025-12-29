// Households Controller - DOM updates for households page
import * as dataService from '../services/api.js';
import { debounce } from '../utils/helpers.js';

function removeVietnameseTones(str) {
  return str
    .normalize("NFD")                     // Tách ký tự và dấu
    .replace(/[\u0300-\u036f]/g, "")      // Xóa các dấu
    .replace(/đ/g, "d")                   // Thay đ -> d
    .replace(/Đ/g, "D");                  // Thay Đ -> D
}

const PAGE_SIZE = 6;
let originalRows = [];
let aNewHousehold = { nhan_khau: [], ho_khau: {} };
let changedHousehold = { nhan_khau: [], address: "" };
let page = 1;
let sortState = { key: null, dir: 1 };
let householdsInited = false;
let householdsTableBound = false;
let householdsModalBound = false;
let householdsEditModalBound = false;
let householdsSplitModalBound = false;
let householdsAddMemberModalBound = false;
let householdsRemoveMemberReasonModalBound = false;
let householdsCreateModalBound = false;

export async function init() {
  // Always refresh data to prevent loss on navigation
  originalRows = await dataService.getHouseholds();
  changedHousehold = { nhan_khau: [], address: "" };
  // Reset all flags to rebind on each visit
  householdsTableBound = false;
  householdsModalBound = false;
  householdsEditModalBound = false;
  householdsSplitModalBound = false;
  householdsAddMemberModalBound = false;
  householdsRemoveMemberReasonModalBound = false;
  householdsCreateModalBound = false;

  // Bind all event listeners
  bindTable();
  bindCreateHouseholdModal();
  bindAddFamilyMembersModal();
  bindSplitHouseholdModal();
  bindAddMemberModal();
  bindRemoveMemberReasonModal();
  bindModal();
  bindEditHouseholdModal();

  renderTable();
}

// ======== TABLE RENDERING =========
async function filterRows(search) {
  originalRows = await dataService.getHouseholds();
  if (!search) return originalRows;
  const q = search.toLowerCase();
  console.log(originalRows[0].id_ho_khau);
  return originalRows.filter(r =>
    r.id_ho_khau == q ||
    removeVietnameseTones(r.ho_ten.toLowerCase()).includes(removeVietnameseTones(q)) ||
    removeVietnameseTones(r.address.toLowerCase()).includes(removeVietnameseTones(q))
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

async function renderTable() {
  const tbody = document.querySelector('#householdTable tbody');
  if (!tbody) return;

  const empty = document.getElementById('emptyState');
  const search = document.getElementById('tableSearch')?.value || '';
  const rows = await sortRows(filterRows(search));
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  page = Math.min(page, totalPages);
  const slice = await rows.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE);

  tbody.innerHTML = slice.map(r => `<tr>
    <td>${r.id_ho_khau}</td>
    <td>${r.ho_ten}</td>
    <td>${r.address}</td>
    <td>${r.SL}</td>
    <td><button class="btn-view" data-sohk="${r.id_ho_khau}">👁 Xem chi tiết</button></td>
  </tr>`).join('');

  if (empty) empty.classList.toggle('hidden', rows.length > 0);
  const pi = document.getElementById('pageInfo');
  if (pi) pi.textContent = `Trang ${page}/${totalPages}`;
  const prev = document.getElementById('prevPage'), next = document.getElementById('nextPage');
  if (prev) prev.disabled = page <= 1;
  if (next) next.disabled = page >= totalPages;

  // Bind view buttons
  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', () => {
      openHouseholdModal(btn.dataset.sohk);
      console.log(btn.dataset.sohk);
    });
  });
}

function bindTable() {
  if (householdsTableBound) return;
  householdsTableBound = true;

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
    const csv = ['Số hộ khẩu, Chủ hộ, Địa chỉ, SL nhân khẩu'].concat(data.map(r => [r.id_ho_khau, r.ho_ten, r.address, r.SL].map(x => `"${String(x).replace(/"/g, '""')}"`).join(','))).join('\n');
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
async function openHouseholdModal(soHK) {
  const household = originalRows.find(h => h.id_ho_khau == soHK);
  // console.log(">>", household);
  if (!household) return;

  document.getElementById('modalSoHK').textContent = household.id_ho_khau;
  document.getElementById('modalChuHo').textContent = household.ho_ten;
  document.getElementById('modalDiaChi').textContent = household.address;
  try {
    const response = await fetch(`http://localhost:3000/api/get/householdMembers/${household.id_ho_khau}`);
    const data = await response.json();
    household.members = data;
  }
  catch (error) {
    console.error("Error fetching feedback stats: ", error);
    household.members = null;
  }
  const tbody = document.getElementById('modalTableBody');
  if (tbody && household.members) {
    tbody.innerHTML = household.members.map((m, i) => `<tr>
      <td><input type="checkbox" class="member-checkbox" value="${i}" /></td>
      <td>${i + 1}</td>
      <td>${m.ho_ten}</td>
      <td>${m.nam_sinh}</td>
      <td>${m.gioi_tinh}</td>
      <td>${m.quan_he_voi_chu_ho}</td>
      <td>${m.cccd || '-'}</td>
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

async function renderChangeHistory(household) {
  const id = await household.id_ho_khau;
  const historyDiv = document.getElementById('changeHistory');
  if (!historyDiv) return;
  try {
    // console.log(id);
    const response = await fetch(`http://localhost:3000/api/get/changeHistory/${id}`,
      {
        method: 'GET',
        headers: {
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${await localStorage.getItem('userToken')}`
        }
      }
    );
    // console.log("abcabc");
    const data = await response.json();
    household.history = data.history;
  } catch (error) {
    console.error("Error fetching feedback stats: ", error);
    household.history = null;
  }
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
  if (modal) {
    modal.classList.remove('is-open');
    renderTable();
  }
}

function bindModal() {
  if (householdsModalBound) return;
  householdsModalBound = true;

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

  const chuHoSelect = document.getElementById('edit_chuHo');
  if (chuHoSelect && household.members && household.members.length > 0) {
    chuHoSelect.innerHTML = '<option value="">-- Chọn chủ hộ --</option>';
    household.members.forEach(member => {
      const option = document.createElement('option');
      option.value = member.id_cd;
      option.textContent = member.ho_ten;
      /*=======================================
      ========================================
============================================
      ===================================================================================
      =====================================================================================
      */
      if (member.ho_ten === household.ho_ten) {
        option.selected = true;
      }
      chuHoSelect.appendChild(option);
    });
  }

  document.getElementById('edit_diaChi').value = household.address;

  // Initial populate relation container with current chủ hộ
  updateEditRelationContainer(household);

  const modal = document.getElementById('editHouseholdModal');
  if (modal) modal.classList.add('is-open');
  // document.getElementById('edit_chuHo').value = household.ho_ten;
  // document.getElementById('edit_diaChi').value = household.address;

  // const modal = document.getElementById('editHouseholdModal');
  // if (modal) modal.classList.add('is-open');
}

function updateEditRelationContainer(household) {
  const chuHoSelect = document.getElementById('edit_chuHo');
  const selectedChuHo = chuHoSelect?.value;

  const relationContainer = document.getElementById('editRelationContainer');
  if (relationContainer && household.members && household.members.length > 0) {
    // Filter out the selected chủ hộ - only show other members
    const otherMembers = household.members.filter(m => m.id_cd != selectedChuHo);

    if (otherMembers.length === 0) {
      relationContainer.innerHTML = '<p style="color: #999; text-align: center; padding: 12px;">Không có thành viên khác</p>';
    } else {
      const relations = otherMembers.map((member, index) => `
        <div style="background: white; border-radius: 8px; padding: 12px; margin-bottom: 8px; display: grid; grid-template-columns: 2fr 1fr; gap: 12px; align-items: center;">
          <div style="font-weight: 500;">${member.ho_ten}</div>
          <select class="member-relation-select" data-member-name="${member.id_cd}" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
            <option value="">Chọn quan hệ</option>
            <option value="Vợ" ${member.quan_he_voi_chu_ho === 'Vợ' ? 'selected' : ''}>Vợ</option>
            <option value="Chồng" ${member.quan_he_voi_chu_ho === 'Chồng' ? 'selected' : ''}>Chồng</option>
            <option value="Con" ${member.quan_he_voi_chu_ho === 'Con' ? 'selected' : ''}>Con</option>
            <option value="Ông" ${member.quan_he_voi_chu_ho === 'Ông' ? 'selected' : ''}>Ông</option>
            <option value="Bà" ${member.quan_he_voi_chu_ho === 'Bà' ? 'selected' : ''}>Bà</option>
            <option value="Bố" ${member.quan_he_voi_chu_ho === 'Bố' ? 'selected' : ''}>Bố</option>
            <option value="Mẹ" ${member.quan_he_voi_chu_ho === 'Mẹ' ? 'selected' : ''}>Mẹ</option>
            <option value="Anh" ${member.quan_he_voi_chu_ho === 'Anh' ? 'selected' : ''}>Anh</option>
            <option value="Chị" ${member.quan_he_voi_chu_ho === 'Chị' ? 'selected' : ''}>Chị</option>
            <option value="Em" ${member.quan_he_voi_chu_ho === 'Em' ? 'selected' : ''}>Em</option>
            <option value="Cháu" ${member.quan_he_voi_chu_ho === 'Cháu' ? 'selected' : ''}>Cháu</option>
            <option value="Khác" ${member.quan_he_voi_chu_ho === 'Khác' ? 'selected' : ''}>Khác</option>
          </select>
        </div>
      `).join('');
      relationContainer.innerHTML = relations;
      // console.log(relationContainer.innerHTML);

      // Bind change listeners to relation selects so we can read and persist changes
      // relationContainer.querySelectorAll('.member-relation-select').forEach(select => {
      //   select.addEventListener('change', (e) => {
      //     const name = select.dataset.memberName;
      //     const newRelation = select.value;
      //     const hh = window.currentEditingHousehold;
      //     if (hh && hh.members) {
      //       const member = hh.members.find(m => m.ho_ten === name);
      //       if (member) {
      //         member.quan_he_voi_chu_ho = newRelation;
      //       }
      //     }
      //     console.log('Relation changed for', name, '->', newRelation);
      //   });
      // });
    }
  }
}


function bindEditHouseholdModal() {
  if (householdsEditModalBound) return;
  householdsEditModalBound = true;
  const old_value = document.getElementById('edit_diaChi').value;
  const modal = document.getElementById('editHouseholdModal');
  const closeBtn = document.getElementById('closeEditModal');
  const cancelBtn = document.getElementById('cancelEditBtn');
  const form = document.getElementById('editHouseholdForm');
  const chuHoSelect = document.getElementById('edit_chuHo');
  closeBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('is-open');
  });

  cancelBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('is-open');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  });
  // When chủ hộ selection changes, update relation container
  chuHoSelect?.addEventListener('change', () => {
    const household = window.currentEditingHousehold;
    if (household) {
      updateEditRelationContainer(household);
    }
  });
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const selected = document.querySelectorAll('.member-relation-select');

    const chuHoSelect = document.getElementById('edit_chuHo');
    const household = window.currentEditingHousehold;
    if (!household) return;
    // console.log(household);
    const diaChi = document.getElementById('edit_diaChi').value.trim();
    changedHousehold.address = diaChi;
    selected.forEach(select => {
      const id_cd = select.dataset.memberName;
      console.log(id_cd);
      const relation = select.value;
      console.log(relation);
      changedHousehold.nhan_khau.push({
        id_cd: id_cd,
        quan_he_voi_chu_ho: relation
      })
    })
    changedHousehold.nhan_khau.push({
      id_cd: chuHoSelect.value,
      quan_he_voi_chu_ho: 'Chủ hộ'
    })
    // if (!chuHoSelect.value || !diaChi) {
    //   alert('Vui lòng điền đầy đủ thông tin');
    //   return;
    // }
    try {

      ///////// UPDATE thong tin Ten Chu ho + dia chi o day
      // const householdRecord = originalRows.find(h => h.id_ho_khau === household.id_ho_khau);
      // if (householdRecord) {
      //   householdRecord.chuHo = chuHo;
      //   householdRecord.diaChi = diaChi;
      //   if (!householdRecord.history) householdRecord.history = [];
      //   householdRecord.history.push({
      //     action: `Chỉnh sửa: Chủ hộ -> ${chuHo}, Địa chỉ -> ${diaChi}`,
      //     date: new Date().toLocaleString('vi-VN')
      //   });

      // dataService.saveHouseholds(originalRows);
      // console.log(changedHousehold);
      const response = await fetch(`http://localhost:3000/api/put/updateHousehold/${household.id_ho_khau}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // chuHo: chuHo,
          changedHousehold
        })
      });
      changedHousehold = { nhan_khau: [], address: "" };
      originalRows = await dataService.getHouseholds();
      openHouseholdModal(household.id_ho_khau);
      modal.classList.remove('is-open');
      renderTable();
      const res = await response.json();
      // Update detail modal if open
      // document.getElementById('modalChuHo').textContent = chuHo;
      // document.getElementById('modalDiaChi').textContent = diaChi;
      renderChangeHistory(household);
      alert(res.message);
    }
    catch (err) {
      alert(res.message);
      console.log(err);
    }
  });
}

// ======== SPLIT HOUSEHOLD MODAL =========
function openSplitHouseholdModal() {
  const household = window.currentEditingHousehold;
  console.log(household);
  if (!household) return;

  const checkedBoxes = document.querySelectorAll('.member-checkbox:checked');
  if (checkedBoxes.length === 0) {
    alert('Vui lòng chọn ít nhất 1 thành viên để tách hộ');
    return;
  }

  const splitMemberList = document.getElementById('splitMemberList');
  const newChuHoSelect = document.getElementById('split_chuHoMoi');
  const relationContainer = document.getElementById('relationContainer');

  if (splitMemberList) {
    const selectedMembers = Array.from(checkedBoxes).map(cb => {
      const idx = parseInt(cb.value);
      console.log({ ...household.members[cb.value], idx });
      return { ...household.members[cb.value], idx };
    });

    splitMemberList.innerHTML = selectedMembers.map((m, i) => `
      <div style="padding:8px;border-bottom:1px solid #e5e7eb;">
        ${i + 1}. ${m.ho_ten} - ${m.gioi_tinh}
      </div>
    `).join('');

    // Hiển thị dropdown chọn chủ hộ mới
    if (newChuHoSelect) {
      newChuHoSelect.innerHTML = '<option value="">-- Chọn chủ hộ mới --</option>' +
        selectedMembers.map((m, i) => `<option value="${i}">${m.ho_ten}</option>`).join('');

      // Xóa listener cũ và thêm listener mới
      newChuHoSelect.onchange = null;
      newChuHoSelect.addEventListener('change', () => {
        const chuHoIdx = parseInt(newChuHoSelect.value);
        const relationHTML = selectedMembers.map((m, i) => {
          if (i == chuHoIdx) {
            return `
              <div style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                <strong>${m.ho_ten}</strong> - <span style="color: #2563eb; font-weight: 600;">Chủ hộ</span>
              </div>
            `;
          } else {
            return `
              <div style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="min-width: 120px;"><strong>${m.ho_ten}</strong></span>
                  <select id="split_relation_${i}" class="input" style="flex: 1; padding: 6px 8px; font-size: 13px;">
                    <option value="">-- Chọn quan hệ --</option>
                    <option value="Vợ">Vợ</option>
                    <option value="Chồng">Chồng</option>
                    <option value="Con">Con</option>
                    <option value="Mẹ">Mẹ</option>
                    <option value="Cha">Cha</option>
                    <option value="Anh">Anh</option>
                    <option value="Chị">Chị</option>
                    <option value="Em">Em</option>
                    <option value="Cháu">Cháu</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
            `;
          }
        }).join('');

        if (relationContainer) {
          relationContainer.innerHTML = relationHTML;
        }
      });
    }

    window.splitSelectedMembers = selectedMembers;
    window.splitSelectedIndices = Array.from(checkedBoxes).map(cb => parseInt(cb.value));
  }

  const modal = document.getElementById('splitHouseholdModal');
  if (modal) modal.classList.add('is-open');
}

function bindSplitHouseholdModal() {
  if (householdsSplitModalBound) return;
  householdsSplitModalBound = true;

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

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const chuHoIndex = parseInt(document.getElementById('split_chuHoMoi').value);
    const diaChi = document.getElementById('split_diaChi').value.trim();
    if (isNaN(chuHoIndex) || !diaChi) {
      alert('Vui lòng điền đầy đủ thông tin (Chủ hộ mới, Địa chỉ)');
      return;
    }

    let selectedMembers = window.splitSelectedMembers || [];
    const selectedIndices = window.splitSelectedIndices || [];

    if (selectedMembers.length === 0) {
      alert('Không có thành viên nào được chọn');
      return;
    }

    // Lấy chủ hộ mới được chọn
    const newChuHo = selectedMembers[chuHoIndex];
    if (!newChuHo) {
      alert('Vui lòng chọn chủ hộ mới');
      return;
    }

    // Cập nhật quan hệ các thành viên
    selectedMembers = await selectedMembers.map((m, idx) => {
      if (idx == chuHoIndex) {
        return { ...m, quan_he_voi_chu_ho: 'Chủ hộ' };
      } else {
        // Lấy quan hệ mới từ input
        const newRelation = document.getElementById(`split_relation_${idx}`)?.value;
        return { ...m, quan_he_voi_chu_ho: newRelation || m.quanHe };
      }
    });


    try {
      const token = await localStorage.getItem('userToken') || localStorage.getItem('token');
      // console.log(">>>>>", token);
      const response = await fetch("http://localhost:3000/api/createNewHouseholdFromMembers", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({ ids: selectedMembers, address: diaChi, type: 'Thường trú' })
      });
      const data = await response.json();
      alert(data.message);
    }
    catch (error) {
      console.error(error);
    }

    // // Tạo hộ khẩu mới
    // const newHousehold = {
    //   soHK,
    //   chuHo: newChuHo.hoTen,
    //   diaChi,
    //   sl: selectedMembers.length,
    //   members: selectedMembers.map(m => ({ ...m, soHK })),
    //   history: [{
    //     action: `Tách từ hộ khẩu ${window.currentEditingSoHK}`,
    //     date: new Date().toLocaleString('vi-VN')
    //   }]
    // };


    // // Xóa thành viên khỏi hộ cũ
    // const oldHousehold = window.currentEditingHousehold;
    // oldHousehold.members = oldHousehold.members.filter((m, idx) => !selectedIndices.includes(idx));
    // oldHousehold.sl = oldHousehold.members.length;
    // oldHousehold.history = oldHousehold.history || [];
    // oldHousehold.history.push({
    //   action: `Tách ${selectedMembers.length} thành viên sang hộ ${soHK}`,
    //   date: new Date().toLocaleString('vi-VN')
    // });

    // originalRows.push(newHousehold);
    originalRows = await dataService.getHouseholds();

    modal.classList.remove('is-open');
    form.reset();
    closeHouseholdModal();
    renderTable();


  });
}

// ======== ADD MEMBER MODAL =========
function openAddMemberModal() {
  const modal = document.getElementById('addMemberModal');
  if (modal) modal.classList.add('is-open');
}

function bindAddMemberModal() {
  if (householdsAddMemberModalBound) return;
  householdsAddMemberModalBound = true;

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

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const ho_ten = document.getElementById('member_hoTen').value.trim();
    const ngay_sinh = document.getElementById('member_ngaySinh').value;
    const gioi_tinh = document.getElementById('member_gioiTinh').value;
    const quan_he_voi_chu_ho = document.getElementById('member_quanHe').value;
    const cccd = document.getElementById('member_cccd').value.trim();
    const ngay_cap = document.getElementById('member_ngayCapCCCD').value;
    const noi_cap = document.getElementById('member_noiCapCCCD').value.trim();
    const thuong_tru_truoc_day = document.getElementById('member_diaChiTruoc').value.trim();
    const dan_toc = document.getElementById('member_danToc').value.trim();
    const noi_sinh = document.getElementById('member_noiSinh').value.trim();
    const que_quan = document.getElementById('member_nguonQuan').value.trim();
    const nghe_nghiep = document.getElementById('member_ngheNghiep').value.trim();
    const noi_lam_viec = document.getElementById('member_noiLamViec').value.trim();

    if (!ho_ten || !ngay_sinh || !gioi_tinh || !quan_he_voi_chu_ho) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const household = window.currentEditingHousehold;
    if (!household) return;

    const newMember = {
      ho_ten,
      ngay_sinh,
      gioi_tinh,
      quan_he_voi_chu_ho,
      cccd: cccd || '',
      ngay_cap: ngay_cap || '',
      noi_cap: noi_cap || '',
      thuong_tru_truoc_day: thuong_tru_truoc_day || '',
      dan_toc: dan_toc || '',
      noi_sinh: noi_sinh || '',
      que_quan: que_quan || '',
      nghe_nghiep: nghe_nghiep || '',
      noi_lam_viec: noi_lam_viec || '',
      id_ho_khau: household.id_ho_khau
    };

    // if (!household.members) household.members = [];
    // household.members.push(newMember);
    // household.sl = household.members.length;

    // if (!household.history) household.history = [];
    // household.history.push({
    //   action: `Thêm thành viên: ${hoTen}`,
    //   date: new Date().toLocaleString('vi-VN')
    // });
    try {
      const token = await localStorage.getItem('userToken') || localStorage.getItem('token');
      // console.log(">>>>>", token);
      console.log(">   ", JSON.stringify(newMember));
      await fetch(`http://localhost:3000/api/post/household/addNewMember`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newMember)
      });
    } catch (error) {
      console.error(error);
      throw error;
    }

    modal.classList.remove('is-open');
    form.reset();
    householdsAddMemberModalBound = false;
    // Refresh modal table
    openHouseholdModal(household.id_ho_khau);
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

  // Store selected members for use in the modal
  window.selectedMembersToRemove = {
    checkedBoxes,
    count: checkedBoxes.length
  };

  // Show the reason modal
  const modal = document.getElementById('removeMemberReasonModal');
  if (modal) modal.classList.add('is-open');
}

// ======== REMOVE MEMBER REASON MODAL =========
function bindRemoveMemberReasonModal() {
  const modal = document.getElementById('removeMemberReasonModal');
  const closeBtn = document.getElementById('closeRemoveMemberReasonModal');
  const cancelBtn = document.getElementById('cancelRemoveMemberReasonBtn');
  const form = document.getElementById('removeMemberReasonForm');

  closeBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('is-open');
  });

  cancelBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('is-open');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const reason = document.getElementById('removeMemberReason').value.trim();

    if (!reason) {
      alert('Vui lòng nhập lý do xóa thành viên');
      return;
    }

    const selectionData = window.selectedMembersToRemove;
    if (!selectionData) return;
    console.log("selctionDATA:", selectionData);
    const household = await window.currentEditingHousehold;
    if (!household) return;

    const indicesToRemove = await Array.from(selectionData.checkedBoxes).map(cb => parseInt(cb.value));
    console.log("indicesToRemove", indicesToRemove);
    const removedMembers = await indicesToRemove.map(idx => household.members[idx].id_cd);
    console.log("removeMembers:", removedMembers);
    console.log(JSON.stringify({ old_id_ho_khau: household.id_ho_khau, chuyen_den: 'Không rõ', ghi_chu: reason }))
    let response = '';
    for (const id of removedMembers) {
      try {
        const respone = await fetch(`http://localhost:3000/api/delete/householdMember/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ old_id_ho_khau: household.id_ho_khau, chuyen_den: 'Không rõ', ghi_chu: reason })
        });
        const res = await respone.json();
        modal.classList.remove('is-open');
        form.reset();
        alert(res.message);
        response = res.message
        // Refresh modal
      }
      catch (error) {
        console.error(error);
      }
    }

    if (response == 'Đã xóa hộ khẩu thành công') {
      console.log("close_MODAL")
      closeHouseholdModal();
    }
    else openHouseholdModal(household.id_ho_khau);
    // household.members = household.members.filter((m, idx) => !indicesToRemove.includes(idx));
    // household.sl = household.members.length;

    // if (!household.history) household.history = [];
    // household.history.push({
    //   action: `Xóa thành viên: ${removedMembers.join(', ')} (Lý do: ${reason})`,
    //   date: new Date().toLocaleString('vi-VN')
    // });

    // dataService.saveHouseholds(originalRows);


  });
}

// ======== CREATE HOUSEHOLD FROM MEMBERS =========
function createHouseholdFromMembers() {
  const checkedBoxes = document.querySelectorAll('.member-checkbox:checked');
  if (checkedBoxes.length === 0) {
    alert('Vui lòng chọn ít nhất 1 thành viên');
    return;
  }

  const household = window.currentEditingHousehold;
  if (!household) return;

  // Kiểm tra xem có chủ hộ trong những người được chọn không
  const selectedMembers = Array.from(checkedBoxes).map(cb => {
    const idx = parseInt(cb.value);
    // console.log(household.members[idx]);
    return household.members[idx];
  });

  const hasChuHo = selectedMembers.some(m => m.quan_he_voi_chu_ho === 'Chủ hộ');
  if (hasChuHo) {
    alert('Chỉ được chọn các thành viên không phải chủ hộ để lập hộ mới');
    return;
  }

  openSplitHouseholdModal();
}

// ======== CREATE HOUSEHOLD MODAL =========
function bindCreateHouseholdModal() {
  if (householdsCreateModalBound) return;
  householdsCreateModalBound = true;

  const openBtn = document.getElementById('openCreateHouseholdModal');
  const modal = document.getElementById('createHouseholdModal');
  const closeBtn = document.getElementById('closeCreateModal');
  const cancelBtn = document.getElementById('cancelCreateBtn');
  const form = document.getElementById('createHouseholdForm');
  const loaiHoKhauSelect = document.getElementById('nhk_loaiHoKhau');
  const tamTruFieldsContainer = document.getElementById('tamTruFieldsContainer');
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
  // Xử lý hiển thị/ẩn trường tạm trú
  loaiHoKhauSelect?.addEventListener('change', (e) => {
    if (tamTruFieldsContainer) {
      if (e.target.value === 'Tạm trú') {
        tamTruFieldsContainer.style.display = 'flex';
        document.getElementById('nhk_tuNgayTamTru')?.setAttribute('required', 'required');
        document.getElementById('nhk_denNgayTamTru')?.setAttribute('required', 'required');
      } else {
        tamTruFieldsContainer.style.display = 'none';
        document.getElementById('nhk_tuNgayTamTru')?.removeAttribute('required');
        document.getElementById('nhk_denNgayTamTru')?.removeAttribute('required');
        document.getElementById('nhk_tuNgayTamTru').value = '';
        document.getElementById('nhk_denNgayTamTru').value = '';
      }
    }
  });
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const tuNgayTamTru = document.getElementById('nhk_tuNgayTamTru').value;
    const denNgayTamTru = document.getElementById('nhk_denNgayTamTru').value;
    const ho_ten = document.getElementById('nhk_hoTen').value.trim();
    const bi_danh = document.getElementById('nhk_biDanh').value.trim();
    const ngay_sinh = document.getElementById('nhk_ngaySinh').value.trim();
    const dan_toc = document.getElementById('nhk_danToc').value.trim();
    const gioi_tinh = document.getElementById('nhk_gioiTinh').value.trim();
    const cccd = document.getElementById('nhk_soCCCD').value.trim();
    const ngay_cap = document.getElementById('nhk_ngayCap').value.trim();
    const noi_cap = document.getElementById('nhk_noiCap').value.trim();
    const noi_sinh = document.getElementById('nhk_noiSinh').value.trim();
    const que_quan = document.getElementById('nhk_nguonQuan').value.trim();
    const nghe_nghiep = document.getElementById('nhk_ngheNghiep').value.trim();
    const noi_lam_viec = document.getElementById('nhk_noiLamViec').value.trim();
    const thuong_tru_truoc_day = document.getElementById('nhk_diaChiTruoc').value.trim();
    const address = document.getElementById('nhk_diaChi').value.trim();
    const type = loaiHoKhauSelect.value;
    if (!ho_ten || !dan_toc || !ngay_sinh || !gioi_tinh || !cccd || !ngay_cap || !noi_cap || !noi_sinh || !que_quan || !address) {
      alert('Vui lòng điền đầy đủ thông tin (*)');
      return;
    }

    // Tạo số hộ khẩu tự động (dựa trên số lượng hộ hiện có)
    const soHK = String(originalRows.length + 1);

    // Tạo thành viên chủ hộ
    const chuHo = {
      ho_ten,
      bi_danh: bi_danh || null,
      gioi_tinh,
      cccd: cccd,
      ngay_sinh,
      dan_toc: dan_toc || 'Kinh',
      ngay_cap: ngay_cap,
      noi_cap: noi_cap,
      noi_sinh,
      que_quan,
      nghe_nghiep,
      noi_lam_viec,
      thuong_tru_truoc_day: thuong_tru_truoc_day || '',
      quan_he_voi_chu_ho: 'Chủ hộ'
    };
    const today = new Date().toISOString().split('T')[0];
    aNewHousehold.ho_khau = {
      address: address,
      type: loaiHoKhauSelect.value,
      begin: type == 'Tạm trú' ? tuNgayTamTru : today,
      end: type == 'Tạm trú' ? denNgayTamTru : null
    };
    aNewHousehold.nhan_khau.push(chuHo);

    // Tạo hộ khẩu mới
    // const newHousehold = {
    //   soHK,
    //   chuHo: hoTen,
    //   diaChi,
    //   diaChiTruoc,
    //   sl: 1,
    //   members: [chuHo],
    //   history: [{
    //     action: 'Tạo hộ khẩu mới',
    //     date: new Date().toLocaleString('vi-VN')
    //   }]
    // };

    // originalRows.push(newHousehold);
    // try {
    //   dataService.saveHouseholds(originalRows);
    // } catch (err) {
    //   console.error('Lỗi lưu dữ liệu:', err);
    // }

    // Lưu thông tin hộ khẩu vừa tạo để sử dụng trong modal thêm thành viên
    // window.currentNewHousehold = newHousehold;

    // Đóng modal tạo hộ và mở modal thêm thành viên
    modal.classList.remove('is-open');
    form.reset();

    // Mở modal thêm thành viên gia đình
    setTimeout(() => {
      const addFamilyModal = document.getElementById('addFamilyMembersModal');
      if (addFamilyModal) {
        addFamilyModal.classList.add('is-open');
      }
    }, 500);
  });
}

// ========= THÊM THÀNH VIÊN GIA ĐÌNH =========
function bindAddFamilyMembersModal() {
  const addFamilyModal = document.getElementById('addFamilyMembersModal');
  const closeBtn = document.getElementById('closeAddFamilyModal');
  const cancelBtn = document.getElementById('cancelAddFamilyBtn');
  const saveBtn = document.getElementById('saveFamilyMembersBtn');
  const countInput = document.getElementById('familyMemberCount');
  const container = document.getElementById('familyMembersContainer');

  closeBtn?.addEventListener('click', () => {
    addFamilyModal?.classList.remove('is-open');
  });

  cancelBtn?.addEventListener('click', () => {
    addFamilyModal?.classList.remove('is-open');
  });

  addFamilyModal?.addEventListener('click', (e) => {
    if (e.target === addFamilyModal) {
      addFamilyModal.classList.remove('is-open');
    }
  });

  // Tự động tạo form khi nhập số thành viên
  countInput?.addEventListener('input', () => {
    const count = parseInt(countInput.value) || 0;

    if (count < 0) {
      countInput.value = 0;
      container.innerHTML = '';
      return;
    }

    if (count > 20) {
      countInput.value = 20;
    }

    generateFamilyForms(parseInt(countInput.value) || 0);
  });

  saveBtn?.addEventListener('click', async () => {
    const forms = container.querySelectorAll('.family-member-form');
    // const members = [];

    for (let idx = 0; idx < forms.length; idx++) {
      const form = forms[idx];
      const ho_ten = form.querySelector('.member-hoTen').value.trim();
      const ngay_sinh = form.querySelector('.member-ngaySinh').value.trim();
      const gioi_tinh = form.querySelector('.member-gioiTinh').value.trim();
      const quan_he_voi_chu_ho = form.querySelector('.member-quanHe').value.trim();
      if (!ho_ten || !ngay_sinh || !gioi_tinh || !quan_he_voi_chu_ho) {
        alert(`Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Ngày sinh, Giới tính) cho TV ${idx + 1}`);
        return;
      }

      await aNewHousehold.nhan_khau.push({
        ho_ten,
        bi_danh: form.querySelector('.member-biDanh').value.trim() || '',//================================================================TAM THOI=========================================
        ngay_sinh,
        gioi_tinh,
        dan_toc: form.querySelector('.member-danToc').value.trim() || '',
        cccd: form.querySelector('.member-cccd').value.trim() || '',
        ngay_cap: form.querySelector('.member-ngayCapCCCD').value.trim() || '',
        noi_cap: form.querySelector('.member-noiCapCCCD').value.trim() || '',
        noi_sinh: form.querySelector('.member-noiSinh').value.trim() || '',
        que_quan: form.querySelector('.member-nguonQuan').value.trim() || '',
        nghe_nghiep: form.querySelector('.member-ngheNghiep').value.trim() || '',
        noi_lam_viec: form.querySelector('.member-noiLamViec').value.trim() || '',
        quan_he_voi_chu_ho: quan_he_voi_chu_ho, // ==================================================================TAM THOI================================
        thuong_tru_truoc_day: form.querySelector('.member-diaChiTruoc').value.trim() || '' // ===========================================================================================================
      });
    };

    if (aNewHousehold.nhan_khau.length >= forms.length) {
      // Thêm members vào hộ khẩu vừa tạo
      // if (window.currentNewHousehold) {
      //   window.currentNewHousehold.members.push(...members);
      //   window.currentNewHousehold.sl = window.currentNewHousehold.members.length;

      // try {
      //   dataService.saveHouseholds(originalRows);
      // } catch (err) {
      //   console.error('Lỗi lưu dữ liệu:', err);
      // }
      try {
        const token = await localStorage.getItem('userToken') || localStorage.getItem('token');
        console.log(">>>>>", token);
        console.log("ids>>>>", aNewHousehold);
        const respone = await fetch("http://localhost:3000/api/post/createNewHousehold", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify(aNewHousehold)
        });
        const data = await respone.json();
        await fetch(`http://localhost:3000/api/action/approveTemp/${data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('userToken')}`
          }
        });
        aNewHousehold = await { nhan_khau: [], ho_khau: {} }; //Xoa thong tin tam sau khi them
        originalRows = await dataService.getHouseholds();
        alert(data.message);

      }
      catch (error) {
        alert(`Thêm hộ khẩu mới thất bại vì: ${error}`);
        console.error(error);
      }
      addFamilyModal?.classList.remove('is-open');
      container.innerHTML = '';
      countInput.value = '';
      renderTable();
      // }
    }
  });
}

function generateFamilyForms(count) {
  const container = document.getElementById('familyMembersContainer');

  if (count === 0) {
    container.innerHTML = '';
    return;
  }

  let tabsHTML = '';
  let formsHTML = '';

  for (let i = 1; i <= count; i++) {
    tabsHTML += `<button type="button" class="btn" data-tab="${i}" style="padding: 8px 16px; border-radius: 20px; background: ${i === 1 ? '#b3d9ff' : '#e5e7eb'}; color: ${i === 1 ? '#0052cc' : '#666'}; border: none; cursor: pointer; font-weight: 500; font-size: 14px;">TV ${i}</button>`;

    const hidden = i === 1 ? '' : 'style="display:none;"';
    formsHTML += `
      <div class="family-member-form" data-member="${i}" ${hidden} style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-top: 16px;">
        <h4 style="margin: 0 0 16px 0; font-weight: 700; font-size: 16px;">Thành viên ${i}</h4>
        
        <div class="form__group" style="margin-bottom: 20px;">
          <label style="font-weight: 600; margin-bottom: 8px; display: block;">Nhóm tuổi *</label>
          <div style="display: flex; gap: 20px;">
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 400;">
              <input type="radio" name="nhomTuoi_${i}" class="member-nhomTuoi" value="Dưới 14 tuổi" />
              Dưới 14 tuổi
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 400;">
              <input type="radio" name="nhomTuoi_${i}" class="member-nhomTuoi" value="Từ 14 tuổi trở lên" checked />
              Từ 14 tuổi trở lên
            </label>
          </div>
        </div>

        <div class="form__row" style="gap: 20px; display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 20px;">
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Họ và tên *</label>
            <input type="text" class="member-hoTen" placeholder="" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" required />
          </div>
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Bí danh</label>
            <input type="text" class="member-biDanh" placeholder="" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" />
          </div>
          </div>
        <div class="form__row" style="gap: 20px; display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 20px;">

          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Ngày sinh *</label>
            <input type="date" class="member-ngaySinh" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" required />
          </div>
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Dân tộc *</label>
            <input type="text" class="member-danToc" placeholder="" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" required />
          </div>
        </div>
        <div class="form__row" style="gap: 20px; display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 20px;">
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Số CCCD/CMND *</label>
            <input type="text" class="member-cccd" placeholder="" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" />
          </div>
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Giới tính *</label>
            <select class="member-gioiTinh" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" required>
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
        </div>
        <div class="form__row" style="gap: 20px; display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 20px;">
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Quan hệ với chủ hộ *</label>
            <select class="member-quanHe" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" required>
              <option value="">Chọn quan hệ</option>
              <option value="Chủ hộ">Chủ hộ</option>
              <option value="Vợ">Vợ</option>
              <option value="Chồng">Chồng</option>
              <option value="Con">Con</option>
              <option value="Mẹ">Mẹ</option>
              <option value="Cha">Cha</option>
              <option value="Anh">Anh</option>
              <option value="Em">Em</option>
              <option value="Cháu">Cháu</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Thường trú trước đây</label>
            <input type="text" class="member-diaChiTruoc" placeholder="" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" />
          </div>
        </div>

        <div class="form__row" style="gap: 20px; display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 20px;">
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Ngày cấp *</label>
            <input type="date" class="member-ngayCapCCCD" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" />
          </div>
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Nơi cấp *</label>
            <input type="text" class="member-noiCapCCCD" placeholder="" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" />
          </div>
        </div>

        <div class="form__row" style="gap: 20px; display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 20px;">
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Nơi sinh *</label>
            <input type="text" class="member-noiSinh" placeholder="" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" />
          </div>
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Nguyên quán *</label>
            <input type="text" class="member-nguonQuan" placeholder="" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" />
          </div>
        </div>

        <div class="form__row" style="gap: 20px; display: grid; grid-template-columns: 1fr 1fr;">
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Nghề nghiệp *</label>
            <input type="text" class="member-ngheNghiep" placeholder="" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" />
          </div>
          <div class="form__group">
            <label style="font-weight: 600; margin-bottom: 8px; display: block;">Nơi làm việc *</label>
            <input type="text" class="member-noiLamViec" placeholder="" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" />
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
      ${tabsHTML}
    </div>
    ${formsHTML}
  `;

  // Bind tab buttons
  container.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabNum = btn.dataset.tab;
      container.querySelectorAll('.family-member-form').forEach(form => {
        form.style.display = 'none';
      });
      container.querySelector(`[data-member="${tabNum}"]`).style.display = 'block';

      // Update button styles
      container.querySelectorAll('[data-tab]').forEach(b => {
        b.style.background = b.dataset.tab === tabNum ? '#b3d9ff' : '#e5e7eb';
        b.style.color = b.dataset.tab === tabNum ? '#0052cc' : '#666';
      });
    });
  });
}
