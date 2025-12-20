// thong-tin-ho-khau.js

// ************************************************************
// 1. CÁC HÀM TIỆN ÍCH (Giữ nguyên theo code bạn cung cấp)
// ************************************************************

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
    return null;
  }
}

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

function getCCCDFromToken() {
  const token = localStorage.getItem("userToken");
  if (!token) return null;

  const payload = decodeToken(token);
  return payload ? payload.userID : null;
}

// ==========================================================
// 2. LOGIC XỬ LÝ GIAO DIỆN HỘ KHẨU (Đã sửa lỗi truy cập key)
// ==========================================================

let householdData = null;

/**
 * Tạo thẻ badge CSS cho trạng thái cư trú.
 */
function getStatusBadge(statusString) {
  let statusClass = "badge--unknown";
  // Key trong Model là 'Trạng thái cư trú'
  if (statusString === "Thường trú") {
    statusClass = "badge--primary";
  } else if (statusString === "Tạm trú") {
    statusClass = "badge--warning";
  } else if (statusString === "Tạm vắng") {
    statusClass = "badge--secondary";
  }
  return `<span class="value badge ${statusClass}">${statusString}</span>`;
}

/**
 * Điền dữ liệu vào Modal chi tiết thành viên.
 * SỬ DỤNG BRACKET NOTATION CHO CÁC KEY CÓ DẤU HOẶC KHOẢNG TRẮNG.
 */

function checkCurrentAbsentStatus(member) {
  const status = member["Trạng thái cư trú"];
  const absentBegin = member.thoi_gian_tam_vang_begin; // Kiểm tra lại tên key
  const absentEnd = member.thoi_gian_tam_vang_end; // Kiểm tra lại tên key

  if (status === "Tạm vắng") {
    return "Tạm vắng";
  }

  if (absentBegin && absentEnd) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const start = new Date(absentBegin);
    start.setHours(0, 0, 0, 0);

    const end = new Date(absentEnd);
    end.setHours(23, 59, 59, 999);

    if (now >= start && now <= end) {
      return "Tạm vắng";
    }
  }

  return null;
}

/**
 * Điền dữ liệu vào Modal chi tiết thành viên.
 */
function fillModal(member) {
  const relation = member["Quan hệ với chủ hộ"] || "—";
  const job = member["Nghề nghiệp"] || "—";

  const currentAbsentNote = checkCurrentAbsentStatus(member); // Kiểm tra tạm vắng hiện tại (dùng ngày)
  let noteText = member["Ghi chú"] || ""; // Lấy Ghi chú từ Backend (có thể là 'Tạm vắng')

  // Mục tiêu: Nếu Backend đã đánh dấu Ghi chú (ví dụ: 'Tạm vắng' cho đợt sắp tới)
  // HOẶC nếu logic ngày JS của chúng ta phát hiện đang tạm vắng:

  let finalNote = noteText;

  if (currentAbsentNote && !finalNote.toLowerCase().includes("tạm vắng")) {
    // 1. Logic ngày JS phát hiện đang tạm vắng, nhưng Ghi chú DB chưa có: Thêm vào.
    finalNote = finalNote
      ? `${finalNote} (${currentAbsentNote})`
      : currentAbsentNote;
  } else if (
    noteText.toLowerCase().includes("tạm vắng") &&
    !currentAbsentNote
  ) {
    // 2. Logic ngày JS bảo không phải (vì là đợt sắp tới 01/01/2026), nhưng DB có:
    // GIỮ NGUYÊN GHI CHÚ TỪ DB (Tôn trọng thông báo từ Backend)
    // Nếu bạn muốn ẩn ghi chú cho đợt tương lai, hãy để dòng này:
    // finalNote = finalNote.replace(/tạm vắng/gi, "").trim();

    // Nhưng vì nó đang hoạt động sai (không hiện), ta giữ nguyên Ghi chú DB:
    finalNote = noteText;
  } else if (!noteText && currentAbsentNote) {
    // 3. Ghi chú DB rỗng nhưng logic JS thấy đang tạm vắng:
    finalNote = currentAbsentNote;
  }

  const role =
    relation.toLowerCase().trim() === "chủ hộ" ? "Chủ hộ" : "Thành viên";

  document.getElementById("mName").textContent = member["Họ tên"] || "—";
  document.getElementById("mRole").textContent = role;
  document.getElementById("mRelation").textContent = relation;
  document.getElementById("mDob").textContent = formatDate(member["Ngày sinh"]);
  document.getElementById("mGender").textContent = member["Giới tính"] || "—";
  document.getElementById("mCCCD").textContent = member.CCCD || "—";
  document.getElementById("mJob").textContent = job;

  const statusEl = document.getElementById("mStatus");
  statusEl.innerHTML = getStatusBadge(member["Trạng thái cư trú"] || "—");

  document.getElementById("mPhone").textContent = "—";
  document.getElementById("mAddress").textContent = member["Địa chỉ"] || "—";

  document.getElementById("mNote").textContent = finalNote || "—";
}

/**
 * Gắn sự kiện cho Modal và nút xem chi tiết.
 */
function attachModalEvents(members) {
  const modal = document.getElementById("memberModal");
  const closeBtn = document.getElementById("btnMemberClose");
  const backdrop = modal.querySelector(".modal__backdrop");
  const table = document.getElementById("hhMembers");

  const openModal = (member) => {
    fillModal(member);
    modal.classList.remove("hide");
  };

  const closeModal = () => {
    modal.classList.add("hide");
  };

  if (table) {
    // Bắt sự kiện click vào bảng để mở Modal
    table.addEventListener("click", (e) => {
      const btn = e.target.closest(".icon-btn");
      if (!btn) return;
      const idx = Number(btn.dataset.memberIndex);
      const member = members[idx];
      if (member) openModal(member);
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.classList.contains("hide")) {
      closeModal();
    }
  });
}

/**
 * Render chi tiết hộ khẩu.
 * SỬ DỤNG data.idHoKhau, data.householderName, data.address TỪ CONTROLLER.
 */
function renderHouseholdView(data) {
  const secHousehold = document.getElementById("secHousehold");
  if (!data || !data.members || data.members.length === 0) {
    if (secHousehold)
      secHousehold.innerHTML =
        "<p class='error-message'>Không tìm thấy thông tin hộ khẩu cho người dùng này.</p>";
    return;
  }

  householdData = data;

  // Render thông tin chung (Sử dụng data đã được Controller đóng gói)
  const hoKhauValue = data.idHoKhau;
  document.getElementById("hhNo").textContent = hoKhauValue
    ? `HK${hoKhauValue}`
    : "—";

  document.getElementById("hhHead").textContent = data.householderName || "—";

  document.getElementById("hhAddress").textContent = data.address || "—";

  document.getElementById("hhNote").textContent = "—";

  // Render bảng thành viên
  const tbody = document.querySelector("#hhMembers tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  data.members.forEach((m, idx) => {
    // Kiểm tra quan hệ với key có dấu
    const isHouseholder =
      (m["Quan hệ với chủ hộ"] || "").toLowerCase().trim() === "chủ hộ";
    const roleText = isHouseholder ? " <strong>(Chủ hộ)</strong>" : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>
                ${m["Họ tên"]}${roleText}
            </td>
            <td style="text-align:right;">
                <button class="icon-btn" type="button"
                    data-member-index="${idx}" title="Xem chi tiết">
                    👁
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });

  attachModalEvents(data.members);
}

/**
 * Gọi API để lấy dữ liệu Hộ khẩu.
 */
async function fetchHouseholdData(cccd) {
  const apiURL = `/api/household/${cccd}`;
  const secHousehold = document.getElementById("secHousehold");

  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    renderHouseholdView(data);
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu hộ khẩu:", error);
    if (secHousehold)
      document.getElementById(
        "secHousehold"
      ).innerHTML = `<p class='error-message'>Không thể tải thông tin hộ khẩu: ${error.message}</p>`;
  }
}

// ==========================================================
// 3. KHỞI TẠO TƯỜNG MINH CHO GLOBAL SCOPE
// ==========================================================

/**
 * Hàm khởi tạo duy nhất cho trang Thông tin hộ khẩu.
 */
function initHoKhauPage() {
  if (!document.getElementById("secHousehold")) return;

  const cccd = getCCCDFromToken();

  if (cccd) {
    fetchHouseholdData(cccd);
  } else {
    document.getElementById("secHousehold").innerHTML =
      "<p class='error-message'>Không thể xác định CCCD để tải hộ khẩu. Vui lòng đăng nhập.</p>";
  }
}

// Đặt hàm khởi tạo vào phạm vi toàn cục để resident.js có thể gọi.
window.initHoKhauPage = initHoKhauPage;
