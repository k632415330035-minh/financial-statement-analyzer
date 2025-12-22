// phan-anh-cua_toi.js

(function () {
  const listEl = document.getElementById("ticketList");
  const filterBar = document.getElementById("ticketFilters");
  const newTicketForm = document.getElementById("newTicketForm");
  const newTicketPanel = document.getElementById("newTicketPanel");
  const btnShowNew = document.getElementById("btnShowNewTicket");

  // --- HÀM XỬ LÝ TOKEN VÀ USER ---

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

  // Lấy Token và CCCD
  const authToken = localStorage.getItem("userToken");
  const currentCCCD = getCCCDFromToken() || "015219022550"; // CCCD GÁN CỨNG DỰ PHÒNG CHO TEST

  let allTickets = [];

  if (!listEl || !filterBar || !newTicketForm || !btnShowNew) {
    console.error("Không tìm thấy đủ các phần tử HTML.");
    return;
  }
  if (!currentCCCD || !authToken) {
    listEl.innerHTML =
      '<p class="muted error" style="color:red;">LỖI: Cần đăng nhập để xem/gửi phản ánh.</p>';
    return;
  }

  // --- HẰNG SỐ VÀ HÀM TIỆN ÍCH ---

  // Bản đồ dịch mã loại phản ánh (Đảm bảo khớp với các option value trong HTML)
  const CATEGORY_MAP = {
    "An ninh trật tự": "An ninh trật tự",
    "Vệ sinh môi trường": "Vệ sinh môi trường",
    "Cơ sở hạ tầng vật chất": "Cơ sở hạ tầng vật chất",
    "Dịch vụ": "Dịch vụ",
    "Khác": "Khác",
  };

  /** Hàm lấy tên loại phản ánh thân thiện với người dùng */
  function getCategoryLabel(code) {
    if (!code) return "Chưa phân loại";
    // Dịch mã. Nếu không tìm thấy, trả về mã code gốc (ví dụ: 'DỊCH VỤ')
    return CATEGORY_MAP[code] || code;
  }

  // Hàm tạo Header với Authorization
  function getAuthHeaders() {
    const headers = { "Content-Type": "application/json" };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    return headers;
  }

  const STATUS_LABEL = {
    NEW: "Mới gửi",
    PROCESSING: "Đang xử lý",
    DONE: "Đã xử lý",
  };
  const STATUS_BADGE_CLASS = {
    NEW: "badge new",
    PROCESSING: "badge proc",
    DONE: "badge ok",
  };

  function fmtDateTime(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const getTicketStatus = (ticket) => {
    if (ticket["Trạng thái"] === "Đã xử lý") return "DONE";
    const submittedDate = new Date(ticket["Thời gian gửi phản ánh"]);
    const now = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    if (now.getTime() - submittedDate.getTime() <= oneDayInMs) return "NEW";
    return "PROCESSING";
  };

  // --- LOGIC GỌI API VÀ RENDER ---

  async function processApiResponse(response) {
    const contentType = response.headers.get("content-type");

    if (response.ok) {
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return { message: "Thành công." };
    }

    // Xử lý lỗi (Status 4xx, 5xx)
    if (contentType && contentType.includes("text/html")) {
      const errorText = await response.text();
      console.error("Server trả về HTML lỗi:", errorText);
      throw new Error(
        `Lỗi Server (Status ${response.status}). Vui lòng kiểm tra console.`
      );
    }

    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi API không xác định.");
    }

    throw new Error(`Lỗi không xác định (Status ${response.status}).`);
  }

  async function fetchTickets() {
    try {
      listEl.innerHTML = '<p class="muted">Đang tải dữ liệu...</p>';
      const response = await fetch(`/api/petition/${currentCCCD}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await processApiResponse(response); // Lỗi sẽ được ném nếu có

      allTickets = Array.isArray(data) ? data : [];
      renderTickets(
        filterBar.querySelector(".chip.is-active")?.dataset.status || "ALL"
      );
    } catch (error) {
      console.error("Error fetching tickets:", error);
      listEl.innerHTML = `<p class="muted error" style="color:red;">Lỗi tải dữ liệu: ${error.message}</p>`;
    }
  }

  function renderTickets(filterStatus = "ALL") {
    listEl.innerHTML = "";
    const filtered = allTickets.filter((t) => {
      if (filterStatus === "ALL") return true;
      return getTicketStatus(t) === filterStatus;
    });

    if (!filtered.length) {
      const p = document.createElement("p");
      p.className = "muted";
      p.textContent = "Chưa có phản ánh nào phù hợp bộ lọc.";
      listEl.appendChild(p);
      return;
    }

    filtered
      .slice()
      .sort(
        (a, b) =>
          new Date(b["Thời gian gửi phản ánh"]).getTime() -
          new Date(a["Thời gian gửi phản ánh"]).getTime()
      )
      .forEach((t) => {
        const card = document.createElement("article");
        card.className = "ticket";
        const status = getTicketStatus(t);
        const statusLabel = STATUS_LABEL[status] || "Đang chờ";
        const badgeClass = STATUS_BADGE_CLASS[status] || "badge";
        const maPhanAnh = t["Mã phản ánh"]
          ? `PA-${String(t["Mã phản ánh"]).padStart(4, "0")}`
          : "N/A";
        const thoiGianGui = t["Thời gian gửi phản ánh"];
        const noiDung = t["Nội dung phản ánh"];
        const phanHoi = t["Phản hồi"];

        // ⭐️ DỊCH MÃ LOẠI PHẢN ÁNH ⭐️
        const loaiPhanAnhCode = t["Loại phản ánh"];
        const loaiPhanAnhLabel = getCategoryLabel(loaiPhanAnhCode);

        card.innerHTML = `
                    <button class="ticket__row" type="button" aria-expanded="false">
                        <div>
                            <div class="ticket__title">${loaiPhanAnhLabel}: ${noiDung.length > 80 ? noiDung.substring(0, 80) + "..." : noiDung
          }</div>
                            <div class="ticket__meta">
                                Mã: ${maPhanAnh} • Gửi lúc ${fmtDateTime(
            thoiGianGui
          )}
                            </div>
                        </div>
                        <span class="${badgeClass}">${statusLabel}</span>
                    </button>
                    <div class="ticket__body" hidden>
                        <p><strong>Loại phản ánh:</strong> ${loaiPhanAnhLabel}</p>
                        <p><strong>Nội dung phản ánh:</strong><br>${noiDung}</p>
                        ${phanHoi
            ? `<p><strong>Phản hồi của Tổ dân phố:</strong><br>${phanHoi}</p>`
            : `<p class="muted"><em>Chưa có phản hồi.</em></p>`
          }
                        <p class="ticket__meta">
                            Trạng thái hiện tại: ${statusLabel}
                        </p>
                    </div>
                `;

        const rowBtn = card.querySelector(".ticket__row");
        const body = card.querySelector(".ticket__body");
        rowBtn.addEventListener("click", () => {
          const isHidden = body.hasAttribute("hidden");
          if (isHidden) {
            body.removeAttribute("hidden");
            rowBtn.setAttribute("aria-expanded", "true");
          } else {
            body.setAttribute("hidden", "");
            rowBtn.setAttribute("aria-expanded", "false");
          }
        });
        listEl.appendChild(card);
      });
  }

  async function sendNewTicket(formData) {
    // Đã sửa lỗi cú pháp URL template literal (dùng backticks)
    const apiUrl = `/api/newpetition/${currentCCCD}`;

    const data = {
      loai_phan_anh: formData.get("category"),
      noi_dung: formData.get("content"),
      cccd: currentCCCD,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      await processApiResponse(response); // Xử lý lỗi

      alert("Đã gửi phản ánh thành công! Tổ dân phố sẽ sớm phản hồi.");
    } catch (error) {
      console.error("Lỗi khi gửi phản ánh:", error);
      alert(`Lỗi: ${error.message}`);
      throw error;
    }
  }

  // --- XỬ LÝ SỰ KIỆN ---

  filterBar.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filterBar
      .querySelectorAll(".chip")
      .forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    const status = chip.dataset.status || "ALL";
    renderTickets(status);
  });

  btnShowNew.addEventListener("click", () => {
    const isHidden = newTicketPanel.hasAttribute("hidden");
    if (isHidden) {
      newTicketPanel.removeAttribute("hidden");
      btnShowNew.textContent = "Đóng";
      filterBar.querySelector('[data-status="ALL"]').click();
      newTicketPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      newTicketPanel.setAttribute("hidden", "");
      btnShowNew.textContent = "+ Tạo mới";

      newTicketForm.reset();
    }
  });

  newTicketForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = newTicketForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Đang gửi...";

    try {
      const formData = new FormData(newTicketForm);

      if (formData.getAll("files").some((file) => file.size > 0)) {
        console.warn(
          "Lưu ý: Không gửi file đính kèm trong phiên bản JSON này."
        );
      }

      await sendNewTicket(formData);

      newTicketForm.reset();
      newTicketPanel.setAttribute("hidden", "");
      btnShowNew.textContent = "+ Tạo mới";
      await fetchTickets();
    } catch (error) {
      // Lỗi đã được xử lý trong sendNewTicket
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Gửi phản ánh";
    }
  });

  // --- KHỞI TẠO ---
  fetchTickets();
})();
