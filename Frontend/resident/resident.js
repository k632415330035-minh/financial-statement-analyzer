// resident.js (Bản đầy đủ đã sửa)
// ==========================================================
// HÀM TIỆN ÍCH CẦN THIẾT
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
  if (statusString === "Thường trú") statusClass = "chip--primary";
  else if (statusString === "Tạm trú") statusClass = "chip--warning";
  else if (statusString === "Tạm vắng") statusClass = "chip--secondary";

  statusEl.textContent = statusString || "—";
  statusEl.className = `kpi__chip ${statusClass}`;
}

async function fetchKPIData() {
  const cccd = getCCCDFromToken();
  if (!cccd) return;

  try {
    const res = await fetch(`/api/household/${cccd}`);
    if (!res.ok) throw new Error(`Lỗi tải KPI: ${res.status}`);
    const data = await res.json();

    const hoKhauNumber = data.idHoKhau;
    const totalMembers = data.totalMembers;
    const householderName = data.householderName;
    const userStatus =
      data.members && data.members.length > 0
        ? (data.members.find((m) => m.CCCD === cccd) || data.members[0])[
            "Trạng thái cư trú"
          ]
        : "—";
    localStorage.setItem("currentResidentStatus", userStatus);

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
    document.getElementById("kpiHK").textContent = "Lỗi tải";
  }
}

// ==========================================================
// LOGIC GIA HẠN TẠM TRÚ + ĐỒNG HỒ
// ==========================================================
const btnExtendStay = document.getElementById("btnExtendStay");
const extendRemainText = document.getElementById("extendRemainText");
const modalExtend = document.getElementById("modalExtendStay");
const btnExtendClose = document.getElementById("btnExtendClose");
const btnExtendCancel = document.getElementById("btnExtendCancel");
const btnExtendSubmit = document.getElementById("btnExtendSubmit");
const extendExpireDate = document.getElementById("extendExpireDate");
const extendRemainDetail = document.getElementById("extendRemainDetail");
const extendMemberList = document.getElementById("extendMemberList");

let householdMembers = [];
let currentHouseId = null;
let hasPendingExtension = false;
let expired = false;

async function refreshHistory() {
  if (window.initHistoryPage) {
    await window.initHistoryPage();
  } else {
    const event = new CustomEvent("refreshHistory");
    document.dispatchEvent(event);
  }
}

async function fetchTempExtensionInfo() {
  const cccd = getCCCDFromToken();
  if (!cccd) return;

  try {
    const resStatus = await fetch(`/api/status/${cccd}`);
    if (!resStatus.ok) throw new Error("Không thể tải trạng thái cư trú");
    const status = await resStatus.json();

    const resHousehold = await fetch(`/api/household/${cccd}`);
    if (resHousehold.ok) {
      const householdData = await resHousehold.json();
      householdMembers = householdData.members || [];
    }

    if (status.daysLeft <= 15 || status.pending || status.daysLeft <= 0) {
      btnExtendStay.hidden = false;
      extendRemainText.hidden = false;
      extendRemainText.textContent = status.message;

      // Hiển thị ngày hết hạn lên Modal
      if (extendExpireDate && status.currentExpiry) {
        const date = new Date(status.currentExpiry);
        extendExpireDate.textContent = date.toLocaleDateString("vi-VN");
      }

      if (extendRemainDetail) {
        extendRemainDetail.textContent = status.message;
      }
    } else {
      btnExtendStay.hidden = true;
      extendRemainText.hidden = true;
    }

    const lockPages = [
      "dang-ky-thuong-tru",
      "tam-tru-tam-vang",
      "phan-anh-cua-toi",
    ];
    if (status.isLocked) {
      lockPages.forEach((page) => {
        const btn = document.querySelector(
          `.sidenav__item[data-page="${page}"]`
        );
        if (btn) btn.classList.add("locked");
      });
    } else {
      lockPages.forEach((page) => {
        const btn = document.querySelector(
          `.sidenav__item[data-page="${page}"]`
        );
        if (btn) btn.classList.remove("locked");
      });
    }

    if (status.pending) {
      btnExtendStay.style.opacity = "0.5";
      btnExtendStay.style.pointerEvents = "none";
      btnExtendStay.title = "Đang chờ duyệt đơn gia hạn";
    } else {
      btnExtendStay.style.opacity = "1";
      btnExtendStay.style.pointerEvents = "auto";
      btnExtendStay.title = "Gia hạn tạm trú";
    }
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái cư trú:", err);
  }
}

// Hiển thị modal khi nhấn nút gia hạn
if (btnExtendStay) {
  btnExtendStay.addEventListener("click", () => {
    // Kiểm tra nếu chưa có dữ liệu thành viên thì yêu cầu đợi hoặc fetch lại
    if (!householdMembers || householdMembers.length === 0) {
      alert("Đang tải dữ liệu thành viên, vui lòng thử lại sau giây lát.");
      return;
    }

    // Render danh sách thành viên vào Modal
    extendMemberList.innerHTML = householdMembers
      .map(
        (m) => `
      <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
        <input type="checkbox" class="extend-member" data-id="${m.id_cd}" checked disabled />
        <span><strong>${m["Họ tên"]}</strong> - ${m["Quan hệ với chủ hộ"]}</span>
      </div>
    `
      )
      .join("");

    // Hiển thị ngày hết hạn cũ lên modal (nếu có)
    const expireDateEl = document.getElementById("extendExpireDate");
    if (expireDateEl && householdMembers[0]) {
      // Có thể lấy ngày từ phần tử đầu tiên hoặc lưu từ API status
    }

    modalExtend.classList.remove("hide");
  });
}

// Đóng modal
[btnExtendClose, btnExtendCancel].forEach((btn) => {
  btn.addEventListener("click", () => {
    modalExtend.classList.add("hide");
  });
});

// Gửi yêu cầu gia hạn
if (btnExtendSubmit) {
  btnExtendSubmit.addEventListener("click", async () => {
    const cccd = getCCCDFromToken();
    const newEndDate = document.getElementById("extendToDate").value;

    if (!newEndDate) {
      alert("Vui lòng chọn ngày gia hạn.");
      return;
    }

    try {
      const res = await fetch(`/api/request/${cccd}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newEndDate }), // Chỉ gửi newEndDate theo model createExtensionRequest
      });

      const result = await res.json();
      if (res.ok) {
        modalExtend.classList.add("hide");
        alert("Gửi yêu cầu gia hạn thành công, vui lòng chờ duyệt");
        await fetchTempExtensionInfo(); // Cập nhật lại giao diện để khóa nút/hiện thông báo chờ
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi gửi yêu cầu.");
    }
  });
}

// Đóng modal khi click backdrop
document.querySelectorAll("[data-close-extend]").forEach((el) => {
  el.addEventListener("click", () => modalExtend.classList.add("hide"));
});

// ==========================================================
// LOGIC KHỞI TẠO CHÍNH
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  fetchTempExtensionInfo();
  fetchKPIData();

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

  const btnCopyHK = document.getElementById("btnCopyHK");
  if (btnCopyHK) {
    btnCopyHK.addEventListener("click", () => {
      const hkEl = document.getElementById("kpiHK");
      if (!hkEl || hkEl.textContent.includes("—")) return;
      navigator.clipboard?.writeText(hkEl.textContent.trim());
      alert("Đã sao chép số hộ khẩu: " + hkEl.textContent.trim());
    });
  }

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
      initFunc: "initPermRegFormLogic",
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
      initFunc: "initHistoryPage",
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
    const lockPages = [
      "dang-ky-thuong-tru",
      "tam-tru-tam-vang",
      "phan-anh-cua-toi",
    ];
    const isLocked = document
      .querySelector(`.sidenav__item[data-page="${pageKey}"]`)
      ?.classList.contains("locked");

    if (lockPages.includes(pageKey) && isLocked) {
      alert("Chức năng này hiện đang bị khóa.");
      return;
    }
    const cfg = pageConfig[pageKey];

    if (!cfg || !container) return;
    try {
      const res = await fetch(cfg.html);
      if (!res.ok) throw new Error("Không tải được " + cfg.html);
      const html = await res.text();
      container.innerHTML = html;
    } catch (err) {
      console.error(err);
      container.innerHTML =
        `<section class="card"><div class="card__header"><h2>Lỗi tải trang</h2></div>` +
        `<p class="muted">Không tải được nội dung: ${cfg.html}</p></section>`;
      return;
    }
    if (cfg.css && !loadedCss.has(cfg.css)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cfg.css;
      link.dataset.pageCss = pageKey;
      document.head.appendChild(link);
      loadedCss.add(cfg.css);
    }
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
    if (cfg.initFunc && window[cfg.initFunc]) {
      console.log(`Đang gọi hàm khởi tạo: ${cfg.initFunc}`);
      window[cfg.initFunc]();
      delete window[cfg.initFunc];
    }
  }

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

  loadPage("thong-tin-ca-nhan");

  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất không?");
      if (!confirmLogout) return;
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("currentResidentStatus");
      window.location.replace("../index.html");
    });
  }
});
