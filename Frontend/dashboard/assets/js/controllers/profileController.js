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
  document.getElementById('profileNgayDangKy').textContent = profile.ngayDangKy || '-';
  document.getElementById('profileDiaChiThuongTru').textContent = profile.diaChiThuongTru || '-';
  document.getElementById('profileSoDienThoai').textContent = profile.soDienThoai || '-';
  document.getElementById('profileCCCD').textContent = profile.cccd || '-';
  document.getElementById('profileNgayCapCCCD').textContent = profile.ngayCapCCCD || '-';
  document.getElementById('profileNoiCapCCCD').textContent = profile.noiCapCCCD || '-';
  document.getElementById('profileCoQuanCSQLHC').textContent = profile.coQuanCSQLHC || '-';
  document.getElementById('profileKySu').textContent = profile.kySu || '-';
  document.getElementById('profileCongTy').textContent = profile.congTy || '-';
  document.getElementById('profileCon').textContent = profile.con || '-';
  document.getElementById('profileThuongTru').textContent = profile.thuongTru || '-';
}

export function bindEditProfileModal() {
  document.getElementById('editProfileForm')?.addEventListener('submit', e => {
    e.preventDefault();
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
      ngayDangKy: document.getElementById('profileNgayDangKy').textContent,
      ngayCapCCCD: document.getElementById('profileNgayCapCCCD').textContent,
      noiCapCCCD: document.getElementById('profileNoiCapCCCD').textContent,
      coQuanCSQLHC: document.getElementById('profileCoQuanCSQLHC').textContent,
      kySu: document.getElementById('profileKySu').textContent,
      congTy: document.getElementById('profileCongTy').textContent,
      con: document.getElementById('profileCon').textContent,
      thuongTru: document.getElementById('profileThuongTru').textContent
    };
    save('userProfile', profile);
    loadProfile();
    closeEditProfileModal();
  });

  document.getElementById('closeEditProfileModal')?.addEventListener('click', closeEditProfileModal);
  document.getElementById('cancelEditProfileBtn')?.addEventListener('click', closeEditProfileModal);
  document.getElementById('editProfileBtn')?.addEventListener('click', openEditProfileModal);
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
  document.getElementById('editProfileModal').classList.add('is-open');
}

function closeEditProfileModal() {
  document.getElementById('editProfileModal').classList.remove('is-open');
}
