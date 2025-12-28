// lich-su-bien-dong.js
(function () {
  const API_BASE_URL = "/api/history";
  const TIMELINE_CONTAINER = document.getElementById("lsbdTimeline");
  const FILTER_CHIPS = document.querySelectorAll("#lsbdFilters button");

  let ALL_HISTORY_DATA = [];

  /* ======================= TOKEN ======================= */
  function decodeToken(token) {
    if (!token) return null;
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  function getCCCDFromToken() {
    const token = localStorage.getItem("userToken");
    const payload = decodeToken(token);
    return payload?.userID || null;
  }

  /* ======================= DATE ======================= */
  function formatDate(dateString) {
    if (!dateString) return "—";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()}`;
    } catch {
      return dateString;
    }
  }

  /* ======================= STATUS COLOR (QUAN TRỌNG) ======================= */
  function getStatusColorImportant(status) {
    if (!status) return "";
    const s = status.toLowerCase();

    if (s.includes("đã")) return "color:#166534 !important"; // xanh
    if (s.includes("chưa") || s.includes("đợi") || s.includes("chờ"))
      return "color:#92400e !important"; // vàng
    if (s.includes("từ chối")) return "color:#b91c1c !important"; // đỏ

    return "";
  }

  /* ======================= RENDER EVENT ======================= */
  function createTimelineEvent(e) {
    if (!e || !e.type) return "";

    let statusHtml = "";
    if ((e.type === "THUONG_TRU" || e.type === "TAM_TRU") && e.status) {
      statusHtml = `
        <div class="lsbd-status" style="${getStatusColorImportant(e.status)}">
          ${e.status}
        </div>
      `;
    }

    let titleText = "";
    let bodyText = "";

    if (e.type === "THUONG_TRU") {
      titleText = "Thường trú / tạm trú";
      bodyText = `Thường trú trước đây: ${e.thuongTruTruocDay || "Không có"}`;
    }

    if (e.type === "TAM_TRU") {
      titleText = "Thường trú / Tạm trú";
      bodyText = `Thời gian từ ${formatDate(e.beginDate)} đến ${formatDate(
        e.endDate
      )}`;
    }

    if (e.type === "TAM_VANG") {
      titleText = "Tạm vắng";
      bodyText = `
        Lý do: ${e.reason || "—"}<br>
        Thời gian: ${formatDate(e.beginDate)} đến ${formatDate(e.endDate)}
      `;
    }

    if (e.type === "CHUYEN_DI") {
      titleText = "Chuyển đi nơi khác";
      bodyText = `Lý do: ${e.destination || "—"}`;
    }

    return `
      <div class="timeline__event ev">
        <div class="timeline__point"></div>
        <div class="timeline__content">

          <div class="lsbd-header">
            <div class="lsbd-title">
              ${titleText}
              <span class="lsbd-badge ${e.type}">
                ${e.typeDisplay}
              </span>
            </div>
            ${statusHtml}
          </div>

          <div class="lsbd-meta">
            Ngày: ${formatDate(e.date)} • Nhân khẩu: ${e.hoTen || "—"}
          </div>

          <div class="lsbd-body">
            ${bodyText}
          </div>

        </div>
      </div>
    `;
  }

  function renderTimeline(data) {
    if (!TIMELINE_CONTAINER) return;

    TIMELINE_CONTAINER.innerHTML = "";

    if (!data || !data.length) {
      TIMELINE_CONTAINER.innerHTML =
        '<p class="muted" style="text-align:center">Không có dữ liệu phù hợp bộ lọc</p>';
      return;
    }

    data.forEach((e) => {
      const html = createTimelineEvent(e);
      if (html) TIMELINE_CONTAINER.innerHTML += html;
    });
  }

  /* ======================= NORMALIZE ======================= */
  function normalizeData(data, source) {
    if (!Array.isArray(data)) return [];

    return data.map((i) => {
      if (!i) return null;

      if (source === "REST") {
        const isTemp = (i._type || "").trim() === "Tạm trú";
        return {
          date: i.date_time,
          hoTen: i.ho_ten,
          type: isTemp ? "TAM_TRU" : "THUONG_TRU",
          typeDisplay: isTemp ? "Tạm trú" : "Thường trú",
          status: i.state,
          beginDate: i.begin,
          endDate: i.end,
          thuongTruTruocDay: i.thuong_tru_truoc_day,
          sortKey: i.date_time,
        };
      }

      if (source === "ABSENT") {
        return {
          date: i.date_time,
          hoTen: i["Họ tên"],
          type: "TAM_VANG",
          typeDisplay: "Tạm vắng",
          status: "Đã duyệt",
          beginDate: i["Ngày bắt đầu"],
          endDate: i["Ngày kết thúc"],
          reason: i["Lý do"],
          sortKey: i.date_time,
        };
      }

      if (source === "MOVE") {
        return {
          date: i.ngay_chuyen,
          hoTen: i.ho_ten,
          type: "CHUYEN_DI",
          typeDisplay: "Chuyển đi",
          status: "Đã chuyển",
          destination: i.ghi_chu,
          sortKey: i.ngay_chuyen,
        };
      }

      return null;
    });
  }

  /* ======================= FETCH ======================= */
  async function fetchAllHistoryData() {
    const cccd = getCCCDFromToken();
    if (!cccd) {
      TIMELINE_CONTAINER.innerHTML =
        '<p style="color:red">Không tìm thấy CCCD</p>';
      return;
    }

    try {
      const [r1, r2, r3] = await Promise.all([
        fetch(`${API_BASE_URL}/restem/${cccd}`).then((r) => r.json()),
        fetch(`${API_BASE_URL}/absent/${cccd}`).then((r) => r.json()),
        fetch(`${API_BASE_URL}/move/${cccd}`).then((r) => r.json()),
      ]);

      ALL_HISTORY_DATA = [
        ...normalizeData(r1, "REST"),
        ...normalizeData(r2, "ABSENT"),
        ...normalizeData(r3, "MOVE"),
      ]
        .filter(Boolean)
        .sort((a, b) => new Date(b.sortKey) - new Date(a.sortKey));

      renderTimeline(ALL_HISTORY_DATA);
    } catch (err) {
      console.error(err);
      TIMELINE_CONTAINER.innerHTML = '<p style="color:red">Lỗi tải dữ liệu</p>';
    }
  }

  /* ======================= FILTER ======================= */
  function initFilters() {
    FILTER_CHIPS.forEach((btn) => {
      btn.onclick = () => {
        FILTER_CHIPS.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        const type = btn.dataset.type;
        renderTimeline(
          type === "ALL"
            ? ALL_HISTORY_DATA
            : ALL_HISTORY_DATA.filter((e) => e.type === type)
        );
      };
    });
  }

  /* ======================= INIT ======================= */
  window.initHistoryPage = function () {
    if (!TIMELINE_CONTAINER) return;
    initFilters();
    fetchAllHistoryData();
  };
})();
