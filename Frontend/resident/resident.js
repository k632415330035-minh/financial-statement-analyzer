// resident.js (Phiên bản đã sửa lỗi tải động và thêm fetch KPI)

// ==========================================================
// HÀM TIỆN ÍCH CẦN THIẾT (Nếu chưa có trong phạm vi toàn cục)
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
    return null;
  }
}

function getCCCDFromToken() {
  const token = localStorage.getItem("userToken");
  if (!token) return null;

  const payload = decodeToken(token);
  return payload ? payload.userID : null;
}

// ==========================================================
// LOGIC FETCH DỮ LIỆU CHO KPI
// ==========================================================

function updateStatusChip(statusString) {
  const statusEl = document.getElementById("kpiStatus");
  if (!statusEl) return;

  let statusClass = "chip--unknown";
  if (statusString === "Thường trú") {
    statusClass = "chip--primary";
  } else if (statusString === "Tạm trú") {
    statusClass = "chip--warning";
  } else if (statusString === "Tạm vắng") {
    statusClass = "chip--secondary";
  }

  statusEl.textContent = statusString || "—";
  statusEl.className = `kpi__chip ${statusClass}`;
}

async function fetchKPIData() {
  const cccd = getCCCDFromToken();
  if (!cccd) {
    console.warn("Không thể lấy CCCD để tải KPI.");
    return;
  }

  const apiURL = `/api/household/${cccd}`;

  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`Lỗi tải KPI: ${response.status}`);
    }
    const data = await response.json();

    // Lấy thông tin từ response
    const hoKhauNumber = data.idHoKhau;
    const totalMembers = data.totalMembers;
    const householderName = data.householderName;
    // Lấy trạng thái cư trú của chính người dùng (lấy từ bản ghi đầu tiên, hoặc từ API /resident/:cccd nếu có)
    const userStatus =
      data.members && data.members.length > 0
        ? (data.members.find((m) => m.CCCD === cccd) || data.members[0])[
            "Trạng thái cư trú"
          ]
        : "—";

    // Điền dữ liệu vào các khung KPI
    const hkEl = document.getElementById("kpiHK");
    const memEl = document.getElementById("kpiMembers");
    const headEl = document.getElementById("kpiHead");

    if (hkEl) hkEl.textContent = hoKhauNumber ? `HK${hoKhauNumber}` : "—";
    if (memEl) memEl.textContent = totalMembers || "—";
    if (headEl)
      headEl.textContent = `Chủ hộ: ${householderName}` || "Chủ hộ: —";

    updateStatusChip(userStatus);
  } catch (error) {
    console.error("Lỗi khi fetch KPI:", error);
    // Để lại dữ liệu mặc định hoặc hiển thị lỗi nhẹ
    document.getElementById("kpiHK").textContent = "Lỗi tải";
  }
}

// ==========================================================
// LOGIC KHỞI TẠO CHÍNH (Đã sửa lỗi tải động và thêm fetch KPI)
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Chào buổi sáng + ngày giờ
  const now = new Date();
  const h = now.getHours();
  let hello = "Chào buổi sáng";
  if (h >= 11 && h < 17) hello = "Chào buổi chiều";
  if (h >= 17 || h < 4) hello = "Chào buổi tối";

  const timeStr =
    now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) +
    " • " +
    now.toLocaleDateString("vi-VN");

  document.getElementById("sbHello").textContent = hello;
  document.getElementById("sbDate").textContent = timeStr;

  // 2. KHỞI TẠO DỮ LIỆU KPI THẬT
  fetchKPIData();

  // 3. Xử lý copy Số hộ khẩu
  const btnCopyHK = document.getElementById("btnCopyHK");
  if (btnCopyHK) {
    btnCopyHK.addEventListener("click", () => {
      const hkEl = document.getElementById("kpiHK");
      if (!hkEl || hkEl.textContent.includes("—")) return;
      const val = hkEl.textContent.trim();
      navigator.clipboard?.writeText(val);
      alert("Đã sao chép số hộ khẩu: " + val);
    });
  }

  // 4. Cấu hình các "trang con"
  const pageConfig = {
    "thong-tin-ca-nhan": {
      html: "thong-tin-ca-nhan/thong-tin-ca-nhan.html",
      css: "thong-tin-ca-nhan/thong-tin-ca-nhan.css",
      js: "thong-tin-ca-nhan/thong-tin-ca-nhan.js",
      initFunc: "initPersonalInfoPage",
    },
    "thong-tin-ho-khau": {
      html: "thong-tin-ho-khau/thong-tin-ho-khau.html",
      css: "thong-tin-ho-khau/thong-tin-ho-khau.css",
      js: "thong-tin-ho-khau/thong-tin-ho-khau.js",
      initFunc: "initHoKhauPage",
    },
    "dang-ky-thuong-tru": {
      html: "dang-ky-thuong-tru/dang-ky-thuong-tru.html",
      css: "dang-ky-thuong-tru/dang-ky-thuong-tru.css",
      js: "dang-ky-thuong-tru/dang-ky-thuong-tru.js",
    },
    "tam-tru-tam-vang": {
      html: "tam-tru-tam-vang/tam-tru-tam-vang.html",
      css: "tam-tru-tam-vang/tam-tru-tam-vang.css",
      js: "tam-tru-tam-vang/tam-tru-tam-vang.js",
    },
    "lich-su-bien-dong": {
      html: "lich-su-bien-dong/lich-su-bien-dong.html",
      css: "lich-su-bien-dong/lich-su-bien-dong.css",
      js: "lich-su-bien-dong/lich-su-bien-dong.js",
    },
    "phan-anh-cua-toi": {
      html: "phan-anh-cua-toi/phan-anh-cua-toi.html",
      css: "phan-anh-cua-toi/phan-anh-cua-toi.css",
      js: "phan-anh-cua-toi/phan-anh-cua-toi.js",
    },
  };

  const loadedCss = new Set();
  const container = document.getElementById("pageContainer");

  async function loadPage(pageKey) {
    const cfg = pageConfig[pageKey];
    if (!cfg || !container) return;

    // 1. Load HTML
    try {
      const res = await fetch(cfg.html);
      if (!res.ok) throw new Error("Không tải được " + cfg.html);
      const html = await res.text();
      container.innerHTML = html; // CHÈN HTML VÀO DOM TRƯỚC
    } catch (err) {
      console.error(err);
      container.innerHTML =
        `<section class="card"><div class="card__header"><h2>Lỗi tải trang</h2></div>` +
        `<p class="muted">Không tải được nội dung: ${cfg.html}</p></section>`;
      return;
    }

    // 2. CSS cho trang
    if (cfg.css && !loadedCss.has(cfg.css)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cfg.css;
      link.dataset.pageCss = pageKey;
      document.head.appendChild(link);
      loadedCss.add(cfg.css);
    }

    // 3. JS cho trang
    document
      .querySelectorAll("script[data-page-js]")
      .forEach((s) => s.remove());

    if (cfg.js) {
      await new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = cfg.js;
        script.dataset.pageJs = pageKey;
        script.onload = resolve;
        script.onerror = () => {
          console.error(`Lỗi tải script: ${cfg.js}`);
          resolve();
        };
        document.body.appendChild(script);
      });
    }

    // 4. GỌI HÀM INIT
    if (cfg.initFunc && window[cfg.initFunc]) {
      console.log(`Đang gọi hàm khởi tạo: ${cfg.initFunc}`);
      window[cfg.initFunc]();
      delete window[cfg.initFunc];
    }
  }

  // 5. Bắt sự kiện click menu + lối tắt
  const menuButtons = document.querySelectorAll(
    ".sidenav__item, .action[data-page]"
  );

  function setActive(pageKey) {
    document
      .querySelectorAll(".sidenav__item")
      .forEach((b) => b.classList.remove("is-active"));
    document
      .querySelector(`.sidenav__item[data-page="${pageKey}"]`)
      ?.classList.add("is-active");
  }

  menuButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pageKey = btn.dataset.page;
      if (!pageKey) return;
      setActive(pageKey);
      loadPage(pageKey);
    });
  });

  // 6. Load mặc định "Thông tin cá nhân" lúc mở trang
  loadPage("thong-tin-ca-nhan");

  // 7. XỬ LÝ ĐĂNG XUẤT
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất không?");
      if (!confirmLogout) return;

      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");

      window.location.replace("../index.html");
    });
  }
});
