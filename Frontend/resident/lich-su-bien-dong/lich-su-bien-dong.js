// lich-su-bien-dong.js
// IIFE – chạy ngay khi script được chèn bởi resident.js
(function () {
  const timelineEl = document.getElementById("lsbdTimeline");
  const filterBar = document.getElementById("lsbdFilters");

  if (!timelineEl || !filterBar) return;

  // ===== DỮ LIỆU DEMO LỊCH SỬ BIẾN ĐỘNG =====
  // Sau này bạn chỉ cần thay mảng này bằng dữ liệu API là xong
  const changes = [
    {
      id: 1,
      date: "2025-11-20",
      type: "TAM_TRU",
      title: "Đăng ký tạm trú tại KTX Bách Khoa",
      person: "Nguyễn Văn A",
      detail: "Thời gian từ 01/08/2025 đến 01/02/2026, lý do: Học tập.",
    },
    {
      id: 2,
      date: "2025-10-05",
      type: "THUONG_TRU",
      title: "Đăng ký thường trú cho Nguyễn Văn A",
      person: "Nguyễn Văn A",
      detail: "Chuyển từ Xã X, Huyện Y, Tỉnh Z về Số 1 Ngõ 1, La Khê, Hà Đông.",
    },
    {
      id: 3,
      date: "2025-08-10",
      type: "TAM_VANG",
      title: "Báo tạm vắng đi Đà Nẵng",
      person: "Trần Thị C",
      detail: "Đi công tác tại Đà Nẵng từ 10/08/2025 đến 20/08/2025.",
    },
    {
      id: 4,
      date: "2025-05-01",
      type: "CHUYEN_DI",
      title: "Chuyển đi nơi khác",
      person: "Nguyễn Văn D",
      detail: "Chuyển thường trú về Quận 1, TP.HCM.",
    },
  ];

  const TYPE_LABEL = {
    THUONG_TRU: "Thường trú",
    TAM_TRU: "Tạm trú",
    TAM_VANG: "Tạm vắng",
    CHUYEN_DI: "Chuyển đi",
  };

  // ===== HÀM FORMAT NGÀY dd/mm/yyyy =====
  function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  // ===== RENDER TIMELINE =====
  function renderTimeline(filterType = "ALL") {
    timelineEl.innerHTML = "";

    const filtered =
      filterType === "ALL"
        ? changes
        : changes.filter((c) => c.type === filterType);

    if (!filtered.length) {
      const p = document.createElement("p");
      p.className = "muted";
      p.textContent = "Chưa có biến động nào cho bộ lọc hiện tại.";
      timelineEl.appendChild(p);
      return;
    }

    // sắp xếp mới nhất lên trên
    filtered
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((ev) => {
        const div = document.createElement("div");
        div.className = "ev";

        const typeLabel = TYPE_LABEL[ev.type] || "Khác";

        div.innerHTML = `
          <div class="lsbd-title">
            ${ev.title}
            <span class="lsbd-badge ${ev.type}">${typeLabel}</span>
          </div>
          <div class="lsbd-meta">
            Ngày: ${fmtDate(ev.date)} • Nhân khẩu: ${ev.person}
          </div>
          <div class="lsbd-body">
            ${ev.detail}
          </div>
        `;

        timelineEl.appendChild(div);
      });
  }

  // ===== GẮN SỰ KIỆN CHO CÁC CHIP LỌC =====
  filterBar.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;

    // đổi active
    filterBar.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");

    const type = chip.dataset.type || "ALL";
    renderTimeline(type);
  });

  // ===== KHỞI TẠO LẦN ĐẦU =====
  renderTimeline("ALL");
})();
