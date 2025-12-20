// tam-vang.js (Phiên bản Cuối cùng và Đã Sửa Lỗi Gửi Form/ReferenceError)

(function () {
  const API_BASE_URL = "/api/absent";
  const tvListElement = document.getElementById("tvList");
  const tvFormPanel = document.getElementById("tvFormPanel");
  const btnNewTV = document.getElementById("btnNewTV");
  const btnCancelTV = document.getElementById("btnCancelTV");
  const formTV = document.getElementById("formTV"); // --- HÀM XỬ LÝ TOKEN VÀ USER (Giữ nguyên) ---

  function getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  function setMinDates() {
    const today = getTodayDate();
    const fromDateEl = document.getElementById("tvFromDate");
    const toDateEl = document.getElementById("tvToDate");

    if (fromDateEl) {
      fromDateEl.min = today;
    }
    if (toDateEl) {
      toDateEl.min = today;
    }

    // Thêm logic ràng buộc: Ngày Đến phải sau Ngày Từ
    if (fromDateEl && toDateEl) {
      fromDateEl.addEventListener("change", () => {
        if (fromDateEl.value) {
          // Ngày Đến không được trước Ngày Từ
          toDateEl.min = fromDateEl.value;

          // Nếu Ngày Đến hiện tại nhỏ hơn Ngày Từ, reset Ngày Đến
          if (
            toDateEl.value &&
            new Date(toDateEl.value) < new Date(fromDateEl.value)
          ) {
            toDateEl.value = fromDateEl.value;
          }
        } else {
          toDateEl.min = today;
        }
      });
    }
  }

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

  function getCCCDFromToken() {
    const token = localStorage.getItem("userToken");
    if (!token) {
      console.warn("Không tìm thấy token trong localStorage.");
      return null;
    }
    const payload = decodeToken(token);
    if (!payload || !payload.userID) {
      console.error(
        "Token hợp lệ nhưng không tìm thấy trường userID trong payload."
      );
      return null;
    }
    return payload.userID;
  }

  const authToken = localStorage.getItem("userToken");
  const currentCCCD = getCCCDFromToken() || "015219022550";

  let allAbsentRecords = [];

  if (!tvListElement || !formTV || !btnNewTV || !tvFormPanel || !btnCancelTV) {
    console.error("Không tìm thấy đủ các phần tử HTML cho Tạm vắng.");
    return;
  }
  if (!currentCCCD || !authToken) {
    tvListElement.innerHTML =
      '<p class="muted error" style="color:red;">LỖI: Cần đăng nhập để quản lý tạm vắng.</p>';
    return;
  }
  function getAuthHeaders() {
    const headers = { "Content-Type": "application/json" };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    return headers;
  }

  function fmtDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function getStatusLabel(beginDate, endDate) {
    const now = new Date().getTime();
    const begin = new Date(beginDate).getTime();
    const end = new Date(endDate).getTime();

    if (now < begin) {
      return { label: "Sắp tới", class: "badge new" };
    }
    if (now >= begin && now <= end) {
      return { label: "Đang tạm vắng", class: "badge proc" };
    }
    return { label: "Đã xong", class: "badge ok" };
  } // --- LOGIC GỌI API VÀ RENDER ---

  async function processApiResponse(response) {
    const contentType = response.headers.get("content-type");

    if (response.ok) {
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return { message: "Thành công." };
    }

    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi API không xác định.");
    }

    throw new Error(`Lỗi không xác định (Status ${response.status}).`);
  }

  async function fetchAbsentRecords() {
    try {
      tvListElement.innerHTML = '<p class="muted">Đang tải dữ liệu...</p>'; // Routing GET: /api/absent/:cccd

      const response = await fetch(`${API_BASE_URL}/${currentCCCD}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await processApiResponse(response);

      allAbsentRecords = Array.isArray(data) ? data : data ? [data] : [];

      renderAbsentRecords();
    } catch (error) {
      console.error("Error fetching absent records:", error);
      tvListElement.innerHTML = `<p class="muted error" style="color:red;">Lỗi tải dữ liệu: ${error.message}</p>`;
    }
  }

  // tam-vang.js

  function renderAbsentRecords() {
    tvListElement.innerHTML = "";

    if (!allAbsentRecords.length) {
      const p = document.createElement("p");
      // Sử dụng class tv-empty cho trường hợp không có dữ liệu
      p.className = "tv-empty";
      p.textContent = "Bạn chưa có lịch sử khai báo tạm vắng nào.";
      tvListElement.appendChild(p);
      return;
    }

    // Sắp xếp theo ngày bắt đầu mới nhất
    allAbsentRecords
      .slice()
      .sort(
        (a, b) =>
          new Date(b.thoi_gian_tam_vang_begin).getTime() -
          new Date(a.thoi_gian_tam_vang_begin).getTime()
      )
      .forEach((t) => {
        const item = document.createElement("div");
        // SỬ DỤNG CLASS CSS TIMELINE TỪ MÃ BẠN CUNG CẤP
        item.className = "tv-item";

        const { label: statusLabel, class: badgeClass } = getStatusLabel(
          t.thoi_gian_tam_vang_begin,
          t.thoi_gian_tam_vang_end
        );

        const fmtBegin = fmtDate(t.thoi_gian_tam_vang_begin);
        const fmtEnd = fmtDate(t.thoi_gian_tam_vang_end);

        // Tách Lý do thành Tiêu đề và Nội dung
        // Giả định: li_do chỉ chứa Lý do hoặc Nơi đến/Lý do (như trong mẫu)
        // Vì bạn đã xóa 'Nơi đến' khỏi form, li_do = 'Đi công tác nước ngoài' hoặc 'Đi du lịch'

        // Lấy toàn bộ li_do làm tiêu đề chính (tv-item__dest)
        const mainDestination = t.li_do.trim();
        // Đặt Lý do phụ là một dòng mô tả (Nếu bạn có trường đó, nếu không, bỏ trống)
        // Ví dụ, giả định Lý do phụ là "Đã khai báo"
        const subReason = "Đã khai báo tạm vắng";

        item.innerHTML = `
                <div class="tv-item__date">
                    ${fmtBegin} – ${fmtEnd}
                </div>
                <div class="tv-item__main">
                    <div class="tv-item__dest">
                        ${mainDestination}
                    </div>
                    <div class="tv-item__reason">
                        ${subReason}
                    </div>
                </div>
                `;

        tvListElement.appendChild(item);
      });
  }

  async function sendNewAbsent(formData) {
    const apiUrl = `/api/newabsent/${currentCCCD}`;

    const from = formData.get("from");
    const to = formData.get("to");
    const reason = formData.get("reason");

    // ⭐️ ĐÃ SỬA: li_do chỉ còn là Lý do (reason) ⭐️
    const li_do = reason;

    const data = {
      li_do: li_do,
      thoi_gian_tam_vang_begin: from,
      thoi_gian_tam_vang_end: to,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await processApiResponse(response);
      alert(result.message || "Đã gửi đăng ký tạm vắng thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi đăng ký tạm vắng:", error);
      alert(`Lỗi: ${error.message}`);
      throw error;
    }
  } // --- XỬ LÝ SỰ KIỆN FORM VÀ UI --- // Nút "Tạo mới" chỉ MỞ FORM (Giữ nguyên label)

  btnNewTV.addEventListener("click", () => {
    tvFormPanel.removeAttribute("hidden");
    tvFormPanel.classList.remove("is-hidden");
    tvFormPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }); // Nút "Hủy" (Trong form)

  if (btnCancelTV) {
    btnCancelTV.addEventListener("click", () => {
      tvFormPanel.setAttribute("hidden", "");
      tvFormPanel.classList.add("is-hidden");
      formTV.reset(); // Reset form khi hủy
    });
  } // Gửi form

  formTV.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = formTV.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Đang gửi...";

    try {
      const formData = new FormData(formTV); // ⭐️ LÔ-GÍC ĐÃ SỬA: CHỈ KIỂM TRA 3 TRƯỜNG BẮT BUỘC (from, to, reason) ⭐️

      if (
        !formData.get("from") ||
        !formData.get("to") ||
        !formData.get("reason")
      ) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
        // Nếu thiếu thông tin, phải bật lại nút Gửi
        submitBtn.disabled = false;
        submitBtn.textContent = "Gửi";
        return;
      }

      await sendNewAbsent(formData); // Ẩn form sau khi gửi thành công

      formTV.reset();
      tvFormPanel.setAttribute("hidden", "");
      tvFormPanel.classList.add("is-hidden");
      await fetchAbsentRecords();
    } catch (error) {
      // Lỗi đã được xử lý (alert) trong sendNewAbsent
    } finally {
      // Đảm bảo nút Gửi được bật lại sau khi hoàn thành (dù thành công hay thất bại)
      submitBtn.disabled = false;
      submitBtn.textContent = "Gửi";
    }
  }); // --- KHỞI TẠO ---

  setMinDates();
  fetchAbsentRecords();
})();
