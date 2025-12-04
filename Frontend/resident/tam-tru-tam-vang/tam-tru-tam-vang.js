// tam-tru-tam-vang.js
// Chạy ngay khi file được load vào resident (không dùng DOMContentLoaded)
(function () {
  const ttListEl = document.getElementById("ttList");
  const tvListEl = document.getElementById("tvList");
  const formTT = document.getElementById("formTT");
  const formTV = document.getElementById("formTV");
  const detailsTT = document.getElementById("ttForm");
  const detailsTV = document.getElementById("tvForm");

  // Nếu không có section (phòng trường hợp load sai) thì thôi
  if (!ttListEl || !tvListEl || !formTT || !formTV) return;

  // ======= DỮ LIỆU DEMO =======
  const tempStays = [
    {
      addr: "KTX Bách Khoa (Học tập)",
      from: "2025-08-01",
      to: "2026-02-01",
      reason: "Học tập"
    }
  ];

  const tempLeaves = [
    // mặc định chưa có bản ghi, để mảng rỗng
    // {
    //   dest: "Đà Nẵng, Việt Nam",
    //   from: "2025-06-01",
    //   to: "2025-06-20",
    //   reason: "Du lịch"
    // }
  ];

  // ======= HÀM FORMAT NGÀY dd/mm/yyyy =======
  function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  // ======= RENDER LIST TẠM TRÚ =======
  function renderTempStays() {
    ttListEl.innerHTML = "";

    if (!tempStays.length) {
      ttListEl.textContent = "—";
      return;
    }

    tempStays.forEach((item) => {
      const div = document.createElement("div");
      div.className = "item";
      div.textContent =
        `Từ ${fmtDate(item.from)} đến ${fmtDate(item.to)} – ` +
        `${item.addr}${item.reason ? ` (${item.reason})` : ""}`;
      ttListEl.appendChild(div);
    });
  }

  // ======= RENDER LIST TẠM VẮNG =======
  function renderTempLeaves() {
    tvListEl.innerHTML = "";

    if (!tempLeaves.length) {
      tvListEl.textContent = "—";
      return;
    }

    tempLeaves.forEach((item) => {
      const div = document.createElement("div");
      div.className = "item";
      div.textContent =
        `Từ ${fmtDate(item.from)} đến ${fmtDate(item.to)} – ` +
        `${item.dest}${item.reason ? ` (${item.reason})` : ""}`;
      tvListEl.appendChild(div);
    });
  }

  // ======= XỬ LÝ SUBMIT TẠM TRÚ =======
  formTT.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(formTT);
    tempStays.push({
      addr: data.get("addr"),
      from: data.get("from"),
      to: data.get("to"),
      reason: data.get("reason")
    });
    renderTempStays();
    formTT.reset();
    // Đóng panel lại cho gọn
    if (detailsTT) detailsTT.open = false;
    alert("Đã gửi đăng ký tạm trú (demo).");
  });

  // ======= XỬ LÝ SUBMIT TẠM VẮNG =======
  formTV.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(formTV);
    tempLeaves.push({
      dest: data.get("dest"),
      from: data.get("from"),
      to: data.get("to"),
      reason: data.get("reason")
    });
    renderTempLeaves();
    formTV.reset();
    if (detailsTV) detailsTV.open = false;
    alert("Đã gửi báo tạm vắng (demo).");
  });

  // ======= KHỞI TẠO LẦN ĐẦU =======
  renderTempStays();
  renderTempLeaves();
})();
