// resident.js

// ==========================================================
// 1. HÀM TIỆN ÍCH & BẢO MẬT
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

/**
 * Hàm Logout dùng chung: Xóa dữ liệu và đẩy về trang đăng nhập
 */
function handleLogout(msg) {
  if (msg) alert(msg);
  localStorage.removeItem("userToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("currentResidentStatus");
  window.location.replace("../Login/Login.html");
}

/**
 * Lấy CCCD từ Token, đồng thời kiểm tra token còn hạn hay không
 */
function getCCCDFromToken() {
  const token = localStorage.getItem("userToken");
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) return null;

  // Kiểm tra hết hạn (exp tính bằng giây, Date.now tính bằng mili giây)
  if (payload.exp * 1000 < Date.now()) {
    handleLogout("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
    return null;
  }

  return payload.userID; // Trả về CCCD
}

// ==========================================================
// 2. LOGIC FETCH DỮ LIỆU (KPI & TRẠNG THÁI)
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
  const token = localStorage.getItem("userToken");
  if (!cccd || !token) return;

  try {
    const res = await fetch(`/api/household/${cccd}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      handleLogout("Phiên làm việc hết hạn.");
      return;
    }

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
    if (headEl) headEl.textContent = `Chủ hộ: ${householderName || "—"}`;

    updateStatusChip(userStatus);
  } catch (error) {
    console.error("Lỗi khi fetch KPI:", error);
  }
}

// ==========================================================
// 3. LOGIC GIA HẠN TẠM TRÚ
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

async function fetchTempExtensionInfo() {
  const cccd = getCCCDFromToken();
  const token = localStorage.getItem("userToken");
  if (!cccd || !token) return;

  try {
    const resStatus = await fetch(`/api/status/${cccd}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resStatus.status === 401) {
      handleLogout("Phiên làm việc hết hạn.");
      return;
    }

    const status = await resStatus.json();

    const resHousehold = await fetch(`/api/household/${cccd}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resHousehold.ok) {
      const householdData = await resHousehold.json();
      householdMembers = householdData.members || [];
    }

    if (status.daysLeft <= 15 || status.pending || status.daysLeft <= 0) {
      if (btnExtendStay) btnExtendStay.hidden = false;
      if (extendRemainText) {
        extendRemainText.hidden = false;
        extendRemainText.textContent = status.message;
      }

      if (extendExpireDate && status.currentExpiry) {
        const date = new Date(status.currentExpiry);
        extendExpireDate.textContent = date.toLocaleDateString("vi-VN");
      }

      if (extendRemainDetail) extendRemainDetail.textContent = status.message;
    } else {
      if (btnExtendStay) btnExtendStay.hidden = true;
      if (extendRemainText) extendRemainText.hidden = true;
    }

    // Quản lý trạng thái khóa menu
    const lockPages = [
      "dang-ky-thuong-tru",
      "tam-tru-tam-vang",
      "phan-anh-cua-toi",
    ];
    lockPages.forEach((page) => {
      const btn = document.querySelector(`.sidenav__item[data-page="${page}"]`);
      if (btn) {
        if (status.isLocked) btn.classList.add("locked");
        else btn.classList.remove("locked");
      }
    });

    // Vô hiệu hóa nút nếu đang chờ duyệt
    if (status.pending && btnExtendStay) {
      btnExtendStay.style.opacity = "0.5";
      btnExtendStay.style.pointerEvents = "none";
      btnExtendStay.title = "Đang chờ duyệt đơn gia hạn";
    }
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái cư trú:", err);
  }
}

// Event Listeners cho Modal Gia Hạn
if (btnExtendStay) {
  btnExtendStay.addEventListener("click", () => {
    if (!householdMembers || householdMembers.length === 0) {
      alert("Đang tải dữ liệu, vui lòng thử lại sau.");
      return;
    }
    extendMemberList.innerHTML = householdMembers
      .map(
        (m) => `
                <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" checked disabled />
                    <span><strong>${m["Họ tên"]}</strong> - ${m["Quan hệ với chủ hộ"]}</span>
                </div>
            `
      )
      .join("");
    modalExtend.classList.remove("hide");
  });
}

[btnExtendClose, btnExtendCancel].forEach((btn) => {
  if (btn)
    btn.addEventListener("click", () => modalExtend.classList.add("hide"));
});

if (btnExtendSubmit) {
  btnExtendSubmit.addEventListener("click", async () => {
    const cccd = getCCCDFromToken();
    const token = localStorage.getItem("userToken");
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newEndDate }),
      });

      if (res.status === 401) {
        handleLogout("Phiên làm việc hết hạn.");
        return;
      }

      const result = await res.json();
      if (res.ok) {
        modalExtend.classList.add("hide");
        alert("Gửi yêu cầu gia hạn thành công!");
        await fetchTempExtensionInfo();
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi gửi yêu cầu.");
    }
  });
}

// ==========================================================
// 4. LOGIC KHỞI TẠO CHÍNH (DOMContentLoaded)
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  // A. KIỂM TRA BẢO MẬT NGAY LẬP TỨC
  const token = localStorage.getItem("userToken");
  if (!token) {
    handleLogout("Bạn chưa đăng nhập!");
    return;
  }

  const payload = decodeToken(token);
  if (!payload || payload.exp * 1000 < Date.now()) {
    handleLogout("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
    return;
  }

  // B. KHỞI TẠO DỮ LIỆU
  fetchTempExtensionInfo();
  fetchKPIData();

  // C. HIỂN THỊ THỜI GIAN & CHÀO HỎI
  const now = new Date();
  const h = now.getHours();
  let hello = "Chào buổi sáng";
  if (h >= 11 && h < 17) hello = "Chào buổi chiều";
  if (h >= 17 || h < 4) hello = "Chào buổi tối";

  const timeStr =
    now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) +
    " • " +
    now.toLocaleDateString("vi-VN");

  const sbHello = document.getElementById("sbHello");
  const sbDate = document.getElementById("sbDate");
  if (sbHello) sbHello.textContent = hello;
  if (sbDate) sbDate.textContent = timeStr;

  // D. COPY SỐ HỘ KHẨU
  const btnCopyHK = document.getElementById("btnCopyHK");
  if (btnCopyHK) {
    btnCopyHK.addEventListener("click", () => {
      const hkEl = document.getElementById("kpiHK");
      if (!hkEl || hkEl.textContent.includes("—")) return;
      navigator.clipboard?.writeText(hkEl.textContent.trim());
      alert("Đã sao chép số hộ khẩu!");
    });
  }

  // E. SPA - LOAD PAGE LOGIC
  const container = document.getElementById("pageContainer");
  const loadedCss = new Set();

  // Config các trang con (Dựa trên cấu trúc dự án của bạn)
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

  async function loadPage(pageKey) {
    const isLocked = document
      .querySelector(`.sidenav__item[data-page="${pageKey}"]`)
      ?.classList.contains("locked");
    if (isLocked) {
      alert("Chức năng này hiện đang bị khóa.");
      return;
    }

    const cfg = pageConfig[pageKey];
    if (!cfg || !container) return;

    try {
      const res = await fetch(cfg.html);
      container.innerHTML = await res.text();

      if (cfg.css && !loadedCss.has(cfg.css)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cfg.css;
        document.head.appendChild(link);
        loadedCss.add(cfg.css);
      }

      document
        .querySelectorAll("script[data-page-js]")
        .forEach((s) => s.remove());
      if (cfg.js) {
        const script = document.createElement("script");
        script.src = cfg.js;
        script.dataset.pageJs = pageKey;
        script.onload = () => {
          if (cfg.initFunc && window[cfg.initFunc]) window[cfg.initFunc]();
        };
        document.body.appendChild(script);
      }
    } catch (err) {
      console.error("Lỗi tải trang:", err);
    }
  }

  document
    .querySelectorAll(".sidenav__item, .action[data-page]")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const pk = btn.dataset.page;
        document
          .querySelectorAll(".sidenav__item")
          .forEach((b) => b.classList.remove("is-active"));
        document
          .querySelector(`.sidenav__item[data-page="${pk}"]`)
          ?.classList.add("is-active");
        loadPage(pk);
      });
    });

  // Trang mặc định
  loadPage("thong-tin-ca-nhan");

  // LOGOUT
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) handleLogout();
    });
  }
});
