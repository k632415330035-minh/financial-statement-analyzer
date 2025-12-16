// thong-tin-ca-nhan.js

// ==========================================================
// 1. CÁC HÀM TIỆN ÍCH
// ==========================================================

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

// ==========================================================
// 2. LOGIC CẬP NHẬT GIAO DIỆN VÀ FETCH DATA
// ==========================================================

const dataMapping = {
  "Họ tên": "citName",
  "Bí danh": "citAlias",
  "Ngày sinh": "citDob",
  "Giới tính": "citGender",
  "Nơi sinh": "citBirthPlace",
  "Nguyên quán": "citOrigin",
  "Dân tộc": "citEthnicity",
  "Ngày đăng ký thường trú": "citPermRegDate",
  "Địa chỉ thường trú trước khi chuyển đến": "citPrevAddress",

  CCCD: "citCCCD",
  "Ngày cấp CCCD": "citCCCDDate",
  "Nơi cấp": "citCCCDPlace",
  "Nghề nghiệp": "citJob",
  "Nơi làm việc": "citWorkplace",
  "Quan hệ với chủ hộ": "citRelation",
  "Trạng thái cư trú": "citStatus", // Đây là trường được sửa trong Model để trả về chuỗi
  "Địa chỉ": "citAddress",
};

const dateFields = ["Ngày sinh", "Ngày đăng ký thường trú", "Ngày cấp CCCD"];

function populateCitizenView(data) {
  if (!data) return;

  for (const apiField in data) {
    const elementId = dataMapping[apiField];
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        let value = data[apiField];

        // 1. Format Ngày tháng
        if (dateFields.includes(apiField)) {
          value = formatDate(value);
        }

        // 2. Xử lý giá trị rỗng/null
        if (value === null || value === undefined || value === "") {
          value = "—";
        }

        element.textContent = value;

        // 3. Xử lý đặc biệt cho Trạng thái cư trú (sử dụng chuỗi từ Model)
        if (elementId === "citStatus" && value !== "—") {
          let statusName = value;
          let statusClass = "badge--unknown";

          if (value === "Thường trú") {
            statusClass = "badge--primary";
          } else if (value === "Tạm trú") {
            statusClass = "badge--warning";
          } else if (value === "Tạm vắng") {
            statusClass = "badge--secondary";
          }

          element.textContent = statusName;
          element.className = `value badge ${statusClass}`;
        }
      }
    }
  }

  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 50);
}

async function fetchResidentData(cccd) {
  const apiURL = `/api/resident/${cccd}`;

  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
    }

    const residentData = await response.json();
    populateCitizenView(residentData);
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu công dân:", error);
    const citView = document.getElementById("citView");
    if (citView) {
      citView.innerHTML = `<p class="error-message">Không thể tải thông tin: ${error.message}</p>`;
    }
  }
}

// ==========================================================
// 3. KHỞI TẠO TƯỜNG MINH CHO GLOBAL SCOPE
// ==========================================================

/**
 * Hàm khởi tạo duy nhất. Phải được gọi từ resident.js sau khi HTML đã chèn.
 */
function initPersonalInfoPage() {
  const cccd = getCCCDFromToken();

  if (cccd) {
    fetchResidentData(cccd);
  } else {
    console.error("Không tìm thấy CCCD từ token. Vui lòng đăng nhập lại.");
    const header = document.querySelector(".card__header h2");
    if (header) header.textContent = "Thông tin cá nhân (Lỗi)";
    document.getElementById(
      "citView"
    ).innerHTML = `<p class="error-message">Không thể xác định người dùng. Vui lòng đăng nhập.</p>`;
  }
}

// Đặt hàm khởi tạo vào phạm vi toàn cục để resident.js có thể gọi.
window.initPersonalInfoPage = initPersonalInfoPage;
