/**
 * Hàm giải mã Base64URL để lấy Payload từ JWT.
 * Giả định: CCCD được lưu dưới khóa 'userID' trong payload.
 * @param {string} token - JSON Web Token (header.payload.signature)
 * @returns {object|null} Payload đã được giải mã
 */
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
 * @param {string} dateString - Chuỗi ngày tháng
 * @returns {string} Ngày tháng đã format hoặc '—'
 */
function formatDate(dateString) {
  if (!dateString || String(dateString).toLowerCase() === "null") return "—";
  try {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateString;
  }
}

/**
 * Hàm cập nhật giá trị vào các thẻ HTML tương ứng của cư dân
 * @param {object} residentData - Dữ liệu cư dân nhận được từ API
 */
function updateResidentView(residentData) {
  // Ánh xạ giữa key JSON (từ Backend/Postman) và id HTML (trong Frontend)
  const mapping = {
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
    "Địa chỉ": "citAddress", // Địa chỉ hiện tại
    // Thêm 'Số điện thoại' nếu có key trong JSON trả về
    // 'Số điện thoại': 'citPhone'
  };

  for (const jsonKey in mapping) {
    const elementId = mapping[jsonKey];
    const element = document.getElementById(elementId);

    let value = residentData[jsonKey];

    // Xử lý các giá trị ngày tháng
    if (
      ["Ngày sinh", "Ngày đăng ký thường trú", "Ngày cấp CCCD"].includes(
        jsonKey
      )
    ) {
      value = formatDate(value);
    } else {
      // Thay thế null/undefined/chuỗi 'null' thành '—'
      if (
        value === null ||
        value === undefined ||
        String(value).toLowerCase() === "null"
      ) {
        value = "—";
      }
    }

    if (element) {
      element.textContent = value;
    }
  }

  // Xử lý 'Trạng thái cư trú' riêng
  const citStatus = document.getElementById("citStatus");
  if (citStatus) {
    // Bạn có thể tùy chỉnh logic này nếu có trạng thái cư trú thực tế từ DB
    citStatus.textContent = "Thường trú";
    citStatus.className = "value badge badge-success";
  }
}

// --------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  console.log("Script lấy thông tin cư dân bắt đầu chạy.");

  // Giả định khóa token là 'userToken' như trong ảnh
  const token = localStorage.getItem("userToken");

  if (!token) {
    console.error("Token không tìm thấy trong Local Storage.");
    document.getElementById("citName").textContent = "Vui lòng đăng nhập";
    return;
  }

  // 1. Giải mã token để lấy CCCD
  const payload = decodeToken(token);
  // Giả định CCCD được lưu dưới khóa 'userID' trong payload
  const cccd = payload ? payload.userID : null;

  if (!cccd) {
    console.error("Không tìm thấy CCCD (userID) trong token.");
    document.getElementById("citName").textContent = "Lỗi xác định người dùng";
    return;
  }

  console.log("CCCD được lấy từ token:", cccd);

  const apiUrl = `/api/resident/${cccd}`;
  console.log("Gọi API:", apiUrl);

  // 2. Gọi API để lấy thông tin cư dân
  fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Bỏ comment nếu API yêu cầu token xác thực
      // 'Authorization': `Bearer ${token}`
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        // Đọc lỗi từ JSON response nếu có
        return response.json().then((err) => {
          throw new Error(
            `Lỗi ${response.status}: ${
              err.message || "Không thể lấy dữ liệu cư dân"
            }`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dữ liệu cư dân nhận được:", data);
      // 3. Cập nhật giao diện
      updateResidentView(data);
    })
    .catch((error) => {
      console.error("Lỗi khi tải thông tin cư dân:", error);
      // Cập nhật giao diện khi gặp lỗi
      document.getElementById("citName").textContent = "Lỗi tải dữ liệu";
      document.getElementById("citCCCD").textContent = "—";
    });

  //  --- XỬ LÝ ĐĂNG XUẤT ---
  const btnLogout = document.getElementById("btnLogout");

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      // 1. (Tùy chọn) Hỏi xác nhận trước khi đăng xuất
      const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất không?");
      if (!confirmLogout) return; // Nếu bấm "Hủy" thì dừng lại

      // 2. Xóa Token và Role trong LocalStorage
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");

      // 3. Chuyển hướng về trang chủ hoặc trang đăng nhập
      // Vì file này nằm trong thư mục "resident_dashboard", ta dùng "../" để ra ngoài
      window.location.replace("../index.html");
    });
  }
});
