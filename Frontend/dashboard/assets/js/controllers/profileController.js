// Profile Controller
import { mockData } from '../models/mockData.js';
import { save, load } from '../utils/helpers.js';

export function loadProfile() {
  const profile = load('userProfile', mockData.profile);
  document.getElementById('profileHoTen').textContent = profile.hoTen || '-';
  document.getElementById('profileBiDanh').textContent = profile.biDanh || '-';
  document.getElementById('profileNgaySinh').textContent = profile.ngaySinh || '-';
  document.getElementById('profileGioiTinh').textContent = profile.gioiTinh || '-';
  document.getElementById('profileNoiSinh').textContent = profile.noiSinh || '-';
  document.getElementById('profileNguonQuan').textContent = profile.nguonQuan || '-';
  document.getElementById('profileDanToc').textContent = profile.danToc || '-';
  document.getElementById('profileDiaChiThuongTru').textContent = profile.diaChiThuongTru || '-';
  document.getElementById('profileSoDienThoai').textContent = profile.soDienThoai || '-';
  document.getElementById('profileCCCD').textContent = profile.cccd || '-';
  document.getElementById('profileNgayCapCCCD').textContent = profile.ngayCapCCCD || '-';
  document.getElementById('profileNoiCapCCCD').textContent = profile.noiCapCCCD || '-';
}

function openEditProfileModal() {
  const profile = load('userProfile', mockData.profile);
  document.getElementById('profile_hoTen').value = profile.hoTen || '';
  document.getElementById('profile_biDanh').value = profile.biDanh || '';
  document.getElementById('profile_ngaySinh').value = profile.ngaySinh || '';
  document.getElementById('profile_gioiTinh').value = profile.gioiTinh || '';
  document.getElementById('profile_noiSinh').value = profile.noiSinh || '';
  document.getElementById('profile_diaChiThuongTru').value = profile.diaChiThuongTru || '';
  document.getElementById('profile_soDienThoai').value = profile.soDienThoai || '';
  document.getElementById('profile_cccd').value = profile.cccd || '';
  document.getElementById('profile_nguonQuan').value = profile.nguonQuan || '';
  document.getElementById('profile_danToc').value = profile.danToc || '';
  document.getElementById('profile_ngayCapCCCD').value = profile.ngayCapCCCD || '';
  document.getElementById('profile_noiCapCCCD').value = profile.noiCapCCCD || '';
  document.getElementById('profile_coQuanCSQLHC').value = profile.coQuanCSQLHC || '';
  document.getElementById('profile_kySu').value = profile.kySu || '';
  document.getElementById('profile_congTy').value = profile.congTy || '';
  document.getElementById('editProfileModal').classList.add('is-open');
}

function closeEditProfileModal() {
  document.getElementById('editProfileModal').classList.remove('is-open');
}

let profileListenersBound = false;

export function bindEditProfileModal() {
  console.log('bindEditProfileModal called, currently bound:', profileListenersBound);
  
  const editBtn = document.getElementById('editProfileBtn');
  const form = document.getElementById('editProfileForm');
  const modal = document.getElementById('editProfileModal');
  const closeBtn = document.getElementById('closeEditProfileModal');
  const cancelBtn = document.getElementById('cancelEditProfileBtn');
  
  console.log('Elements found:', {
    editBtn: !!editBtn, 
    form: !!form, 
    modal: !!modal,
    closeBtn: !!closeBtn,
    cancelBtn: !!cancelBtn
  });
  
  // Only bind if elements exist
  if (!editBtn || !form || !modal || !closeBtn || !cancelBtn) {
    console.warn('Profile modal elements not found');
    return;
  }
  
  // If already bound, remove old listeners by cloning
  if (profileListenersBound) {
    console.log('Already bound, removing old listeners...');
    const newEditBtn = editBtn.cloneNode(true);
    editBtn.parentNode.replaceChild(newEditBtn, editBtn);
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    const newModal = modal.cloneNode(true);
    modal.parentNode.replaceChild(newModal, modal);
  }

  console.log('Binding listeners...');

  // Get fresh references after potential cloning
  const currentEditBtn = document.getElementById('editProfileBtn');
  const currentCloseBtn = document.getElementById('closeEditProfileModal');
  const currentCancelBtn = document.getElementById('cancelEditProfileBtn');
  const currentForm = document.getElementById('editProfileForm');
  const currentModal = document.getElementById('editProfileModal');

  // Bind edit button click
  currentEditBtn.addEventListener('click', () => {
    console.log('Edit button clicked');
    openEditProfileModal();
  });

  // Bind close button click
  currentCloseBtn.addEventListener('click', () => {
    console.log('Close button clicked');
    closeEditProfileModal();
  });

  // Bind cancel button click
  currentCancelBtn.addEventListener('click', () => {
    console.log('Cancel button clicked');
    closeEditProfileModal();
  });

  // Bind form submit
  currentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted');
    const profile = {
      hoTen: document.getElementById('profile_hoTen').value,
      biDanh: document.getElementById('profile_biDanh').value,
      ngaySinh: document.getElementById('profile_ngaySinh').value,
      gioiTinh: document.getElementById('profile_gioiTinh').value,
      noiSinh: document.getElementById('profile_noiSinh').value,
      diaChiThuongTru: document.getElementById('profile_diaChiThuongTru').value,
      soDienThoai: document.getElementById('profile_soDienThoai').value,
      cccd: document.getElementById('profile_cccd').value,
      nguonQuan: document.getElementById('profile_nguonQuan').value,
      danToc: document.getElementById('profile_danToc').value,
      ngayCapCCCD: document.getElementById('profile_ngayCapCCCD').value,
      noiCapCCCD: document.getElementById('profile_noiCapCCCD').value
    };
    save('userProfile', profile);
    loadProfile();
    closeEditProfileModal();
    alert('Lưu thông tin thành công!');
  });

  // Bind modal overlay click
  currentModal.addEventListener('click', (e) => {
    if (e.target.id === 'editProfileModal' || e.target.classList.contains('modal__overlay')) {
      closeEditProfileModal();
    }
  });
  
  profileListenersBound = true;
  console.log('Profile listeners bound successfully');
}
