// Profile Controller
// import { mockData } from '../models/mockData.js';
import { save, load } from '../utils/helpers.js';

function decodeToken(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Lỗi giải mã token:", e);
    return null;
  }
}

/**
 * Hàm trợ giúp để format chuỗi ngày tháng từ DB (ví dụ: "YYYY-MM-DDTHH:MM:SS.000Z") thành "DD/MM/YYYY"
 * Đã sửa lỗi múi giờ bằng cách dùng Date.UTC
 */
function formatDate(dateString) {
  if (!dateString || String(dateString).toLowerCase() === "null") return "—";
  try {
    const datePart = dateString.split("T")[0];
    const parts = datePart.split("-");

    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

    if (isNaN(date)) return dateString;

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateString;
  }
}

/**
 * Lấy CCCD từ localStorage thông qua token. Giả định key là 'userToken' và payload là 'userID'.
 */
function getCCCDFromToken() {
  const token = localStorage.getItem("userToken");
  if (!token) {
    console.warn("Không tìm thấy token trong localStorage.");
    return null;
  }

  const payload = decodeToken(token);
  return payload ? payload.userID : null;
}

async function fetchUserProfile() {
  const cccd = await getCCCDFromToken();
  if (!cccd) {
    console.error("Không thể lấy CCCD từ token.");
    return null;
  }
  try {
    const response = await fetch(`http://localhost:3000/api/resident/${cccd}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin cá nhân:", error);
    return null;
  }
}
const dataMapping = {
  "Họ tên": "hoTen",
  "Bí danh": "biDanh",
  "Ngày sinh": "ngaySinh",
  "Giới tính": "gioiTinh",
  "Nơi sinh": "noiSinh",
  "Nguyên quán": "nguonQuan",
  "Dân tộc": "danToc",
  "Ngày đăng ký thường trú": "ngayDangKy",
  "Địa chỉ thường trú trước khi chuyển đến": "citPrevAddress",

  CCCD: "cccd",
  "Ngày cấp CCCD": "ngayCapCCCD",
  "Nơi cấp": "noiCapCCCD",
  "Nghề nghiệp": "kySu",
  "Nơi làm việc": "congTy",
  "Quan hệ với chủ hộ": "con",
  "Trạng thái cư trú": "citStatus", // Đây là trường được sửa trong Model để trả về chuỗi
  "Địa chỉ": "diaChiThuongTru",
};

const dateFields = ["Ngày sinh", "Ngày đăng ký thường trú", "Ngày cấp CCCD"];

export async function loadProfile() {
  // const profile = load('userProfile', mockData.profile);
  const data = await fetchUserProfile();
  for (const apiField in data) {
    let value = data[apiField];
    const elementId = dataMapping[apiField];
    if (dateFields.includes(apiField)) {
      value = await formatDate(value);
    }
  }
  const profile = {
    hoTen: data["Họ tên"],
    biDanh: data["Bí danh"],
    ngaySinh: formatDate(data["Ngày sinh"]),
    gioiTinh: data["Giới tính"],
    noiSinh: data["Nơi sinh"],
    nguonQuan: data["Nguyên quán"],
    danToc: data["Dân tộc"],
    ngayDangKy: formatDate(data["Ngày đăng ký thường trú"]),
    diaChiThuongTru: data["Địa chỉ"],
    // soDienThoai: data["Số điện thoại"],
    cccd: data["CCCD"],
    ngayCapCCCD: formatDate(data["Ngày cấp CCCD"]),
    noiCapCCCD: data["Nơi cấp"],
    coQuanCSQLHC: data["Cơ quan CSQLHC"],
    kySu: data["Nghề nghiệp"],
    congTy: data["Nơi làm việc"],
    con: data["Quan hệ với chủ hộ"],
    thuongTru: data["Trạng thái cư trú"]
  };
  console.log("Fetched profile data: ", data);
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
