// // ===== Helpers =====
// const $ = (sel) => document.querySelector(sel);
// const $$ = (sel) => Array.from(document.querySelectorAll(sel));
// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// const META_API = document.querySelector('meta[name="api-base"]');
// const API_BASE = (META_API && META_API.content) || "/api";

// function getToken() {
//   return localStorage.getItem("token") || sessionStorage.getItem("token") || "";
// }
// function getName() {
//   return localStorage.getItem("fullName") || "Cư dân";
// }

// function showToast(msg, ms = 2200) {
//   const t = $("#toast");
//   if (!t) return;
//   t.textContent = msg;
//   t.classList.add("show");
//   setTimeout(() => t.classList.remove("show"), ms);
// }

// async function apiFetch(path, opts = {}) {
//   const headers = Object.assign(
//     { Accept: "application/json" },
//     opts.headers || {}
//   );
//   const token = getToken();
//   if (token) headers["Authorization"] = `Bearer ${token}`;
//   try {
//     const res = await fetch(`${API_BASE}${path}`, {
//       ...opts,
//       headers,
//       credentials: "include",
//     });
//     if (res.status === 401) {
//       showToast("Hết phiên đăng nhập.");
//       await sleep(800);
//       location.href = "index.html";
//       return null;
//     }
//     if (!res.ok) {
//       throw new Error((await res.text()) || `HTTP ${res.status}`);
//     }
//     const ct = res.headers.get("content-type") || "";
//     return ct.includes("application/json")
//       ? await res.json()
//       : await res.text();
//   } catch (e) {
//     console.warn("apiFetch error:", e.message);
//     return null;
//   }
// }

// // ===== Greeting (sidebar): auto theo buổi + đồng hồ =====
// function setGreetingSidebar() {
//   const now = new Date();
//   const hour = now.getHours();
//   let hello = "Xin chào";
//   if (hour >= 5 && hour < 11) hello = "Chào buổi sáng";
//   else if (hour >= 11 && hour < 13) hello = "Chào buổi trưa";
//   else if (hour >= 13 && hour < 18) hello = "Chào buổi chiều";
//   else hello = "Chào buổi tối";
//   $("#sbHello").textContent = hello;
//   $("#sbRole").textContent = "Cư dân";
//   $("#sbDate").textContent = `${now.toLocaleTimeString("vi-VN", {
//     hour: "2-digit",
//     minute: "2-digit",
//   })} • ${now.toLocaleDateString("vi-VN")}`;
// }
// let _clock;
// function startClock() {
//   if (_clock) clearInterval(_clock);
//   setGreetingSidebar();
//   _clock = setInterval(setGreetingSidebar, 60 * 1000);
// }

// // // ===== Fallback demo data =====
// // const fallbackMe = {
// //   user: {
// //     id: "u1",
// //     fullName: "Nguyễn Văn A",
// //     phone: "0900000000",
// //     updatedAt: new Date().toISOString(),
// //   },
// //   citizen: {
// //     ho_ten: "Nguyễn Văn A",
// //     bi_danh: "Tý",
// //     ngay_sinh: "1998-05-20",
// //     gioi_tinh: 1,
// //     noi_sinh: "Hà Đông, Hà Nội",
// //     nguyen_quan: "La Khê, Hà Đông, Hà Nội",
// //     dan_toc: "Kinh",
// //     cccd: "012345678902",
// //     ngay_cap_cccd: "2016-06-01",
// //     noi_cap_cccd: "Cục CSQLHC về TTXH",
// //     nghe_nghiep: "Kỹ sư",
// //     noi_lam_viec: "Công ty TNHH ABC",
// //     quan_he_voi_chu_ho: "CON",
// //     so_dien_thoai: "0900000000",
// //     trang_thai: "THUONG_TRU",
// //     ngay_dang_ky_thuong_tru: "2010-01-01",
// //     thuong_tru: "Số 1 Ngõ 1, La Khê",
// //     thuong_tru_truoc_khi_chuyen_den: "Xã X, Huyện Y, Tỉnh Z",
// //   },
// //   household: {
// //     so_ho_khau: "HK000123",
// //     chu_ho: "Nguyễn Văn B",
// //     dia_chi: "Số 1 Ngõ 1, La Khê",
// //     ghi_chu: "—",
// //     members: [
// //       {
// //         ho_ten: "Nguyễn Văn B",
// //         quan_he: "CHU_HO",
// //         ngay_sinh: "1970-01-01",
// //         gioi_tinh: 1,
// //         cccd: "012345678900",
// //         nghe_nghiep: "Công chức nghỉ hưu",
// //         so_dien_thoai: "0901111111",
// //         trang_thai: "THUONG_TRU",
// //         thuong_tru: "Số 1 Ngõ 1, La Khê",
// //         ghi_chu: "Chủ hộ",
// //       },
// //       {
// //         ho_ten: "Trần Thị C",
// //         quan_he: "VO_CHONG",
// //         ngay_sinh: "1975-03-10",
// //         gioi_tinh: 2,
// //         cccd: "012345678901",
// //         nghe_nghiep: "Giáo viên",
// //         so_dien_thoai: "0902222222",
// //         trang_thai: "THUONG_TRU",
// //         thuong_tru: "Số 1 Ngõ 1, La Khê",
// //         ghi_chu: "Vợ chủ hộ",
// //       },
// //       {
// //         ho_ten: "Nguyễn Văn A",
// //         quan_he: "CON",
// //         ngay_sinh: "1998-05-20",
// //         gioi_tinh: 1,
// //         cccd: "012345678902",
// //         nghe_nghiep: "Kỹ sư",
// //         so_dien_thoai: "0900000000",
// //         trang_thai: "THUONG_TRU",
// //         thuong_tru: "Số 1 Ngõ 1, La Khê",
// //         ghi_chu: "Con trai (tài khoản đang đăng nhập)",
// //       },
// //     ],
// //   },
// //   leader: {
// //     name: "Trần Trung Hiếu",
// //     phone: "0901234567",
// //     email: "to7-lakhe@example.gov.vn",
// //     note: "Tiếp dân 19:00–21:00 T2,4,6",
// //   },
// //   tempStay: [
// //     {
// //       tu_ngay: "2025-08-01",
// //       den_ngay: "2026-02-01",
// //       noi: "KTX Bách Khoa",
// //       ly_do: "Học tập",
// //     },
// //   ],
// //   tempAbs: [],
// //   history: [
// //     {
// //       date: "2025-01-12",
// //       type: "CHUYEN_DEN",
// //       note: "Chuyển đến từ P. Trung Văn",
// //     },
// //     { date: "2025-09-02", type: "CAP_NHAT", note: "Cập nhật số điện thoại" },
// //   ],
// // };

// const fallbackNews = [
//   { id: 1, title: "Thay lịch thu phí vệ sinh tháng này", date: "2025-11-01" },
//   {
//     id: 2,
//     title: "Thông báo cắt điện bảo trì 19:00–21:00 ngày 6/11",
//     date: "2025-11-04",
//   },
//   { id: 3, title: "Mời họp tổ dân phố 20:00 thứ Sáu", date: "2025-11-07" },
// ];
// const fallbackTickets = [
//   {
//     id: 101,
//     title: "Đèn đường hỏng trước số 15",
//     status: "DANG_XU_LY",
//     date: "2025-10-25",
//     category: "HA_TANG",
//     content:
//       "Đèn đường trước số 15 bị hỏng 3 ngày nay, khu vực tối và nguy hiểm.",
//     lastNote: "Đã báo điện lực, dự kiến sửa trong tuần.",
//   },
//   {
//     id: 102,
//     title: "Xin xác nhận cư trú cho con",
//     status: "DA_TIEP_NHAN",
//     date: "2025-10-20",
//     category: "GIAY_TO",
//     content: "Đề nghị xác nhận cư trú cho con để nộp hồ sơ nhập học.",
//     lastNote: "Tổ trưởng đang chuẩn bị giấy xác nhận.",
//   },
//   {
//     id: 103,
//     title: "Cấp giấy tạm trú",
//     status: "HOAN_TAT",
//     date: "2025-09-11",
//     category: "GIAY_TO",
//     content: "Đề nghị cấp giấy tạm trú cho người thuê trọ.",
//     lastNote: "Đã cấp giấy tạm trú ngày 12/09.",
//   },
// ];

// let currentMe = null;
// let ticketsData = [];
// let ticketFilter = "ALL";

// // ===== Loaders =====
// async function loadMe() {
//   const data = await apiFetch("/me");
//   return data || fallbackMe;
// }
// async function loadNews() {
//   return (await apiFetch("/announcements?limit=5")) || fallbackNews;
// }
// async function loadMyTickets() {
//   return (await apiFetch("/feedbacks?mine=true&limit=20")) || fallbackTickets;
// }

// // ===== Formatters =====
// const fmtDate = (d) => (!d ? "—" : new Date(d).toLocaleDateString("vi-VN"));
// const fmtGender = (g) =>
//   g === 1 || g === "1" || g === "NAM"
//     ? "Nam"
//     : g === 2 || g === "2" || g === "NU" || g === "NỮ"
//     ? "Nữ"
//     : "Khác";
// const fmtStatus = (s) =>
//   ({ THUONG_TRU: "Thường trú", TAM_TRU: "Tạm trú", TAM_VANG: "Tạm vắng" }[s] ||
//   s ||
//   "—");
// const maskCCCD = (v) => {
//   if (!v) return "—";
//   const s = String(v);
//   return s.length <= 4 ? s : s.slice(0, 4) + "••••" + s.slice(-3);
// };
// const fmtRelation = (r) =>
//   ({
//     CHU_HO: "Chủ hộ",
//     VO_CHONG: "Vợ/chồng",
//     CON: "Con",
//     CHA_ME: "Cha/mẹ",
//     ANH_EM: "Anh/chị/em",
//   }[r] ||
//   r ||
//   "—");

// // ===== History helper =====
// function pushLocalHistory(entry) {
//   if (!currentMe) currentMe = {};
//   if (!Array.isArray(currentMe.history)) currentMe.history = [];
//   currentMe.history.unshift(entry);
//   renderHistory(currentMe.history);
// }

// // ===== Renderers =====
// function renderLeader(leader) {
//   $("#leaderName").textContent = leader?.name || "—";
//   $("#leaderInfo").textContent = `SĐT: ${leader?.phone || "—"} • Email: ${
//     leader?.email || "—"
//   }`;
//   $("#leaderNote").textContent = leader?.note || "—";
//   $("#leaderAvatar").textContent = (leader?.name?.[0] || "T").toUpperCase();
// }

// function renderCitizen(c) {
//   const cit = c || {};
//   $("#citName").textContent = cit.ho_ten || "—";

//   const aliasEl = $("#citAlias");
//   if (aliasEl) aliasEl.textContent = cit.bi_danh || "—";

//   $("#citDob").textContent = fmtDate(cit.ngay_sinh);
//   $("#citGender").textContent = fmtGender(cit.gioi_tinh);
//   const birthPlace = cit.noi_sinh || cit.noi_sinh_khai_sinh || "";
//   const origin = cit.nguyen_quan || "";
//   const ethnicity = cit.dan_toc || "";
//   $("#citBirthPlace").textContent = birthPlace || "—";
//   $("#citOrigin").textContent = origin || "—";
//   $("#citEthnicity").textContent = ethnicity || "—";

//   $("#citCCCD").textContent = maskCCCD(cit.cccd);
//   $("#citCCCDDate").textContent = fmtDate(cit.ngay_cap_cccd || cit.ngay_cap);
//   $("#citCCCDPlace").textContent = cit.noi_cap_cccd || cit.noi_cap || "—";
//   $("#citJob").textContent = cit.nghe_nghiep || "—";
//   $("#citWorkplace").textContent = cit.noi_lam_viec || "—";
//   $("#citRelation").textContent = fmtRelation(cit.quan_he_voi_chu_ho);
//   $("#citStatus").textContent = fmtStatus(cit.trang_thai);
//   $("#citPermRegDate").textContent = fmtDate(
//     cit.ngay_dang_ky_thuong_tru || cit.ngay_thang_dang_ki_thuong_tru
//   );
//   $("#citAddress").textContent =
//     cit.thuong_tru || cit.dia_chi_thuong_tru || "—";
//   $("#citPrevAddress").textContent =
//     cit.thuong_tru_truoc_khi_chuyen_den ||
//     cit.dia_chi_thuong_tru_truoc_khi_chuyen_den ||
//     "—";
//   $("#citPhone").textContent = cit.so_dien_thoai || "—";
// }

// function renderHousehold(hh) {
//   $("#hhNo").textContent = hh?.so_ho_khau || "—";
//   $("#hhHead").textContent = hh?.chu_ho || "—";
//   $("#hhAddress").textContent = hh?.dia_chi || "—";
//   $("#hhNote").textContent = hh?.ghi_chu || "—";

//   let members = hh?.members || [];
//   // sort: chủ hộ -> vợ/chồng -> con -> khác
//   const order = { CHU_HO: 1, VO_CHONG: 2, CON: 3 };
//   members = members.slice().sort((a, b) => {
//     const ra = order[a.quan_he] || 99;
//     const rb = order[b.quan_he] || 99;
//     if (ra !== rb) return ra - rb;
//     return (a.ho_ten || "").localeCompare(b.ho_ten || "", "vi");
//   });

//   const tbody = $("#hhMembers tbody");
//   tbody.innerHTML = members
//     .map((m, idx) => {
//       const isHead = m.quan_he === "CHU_HO";
//       const name = isHead ? `${m.ho_ten} (Chủ hộ)` : m.ho_ten;
//       return `
//       <tr>
//         <td>${name}</td>
//         <td>
//           <button class="icon-btn member-view" data-idx="${idx}" title="Xem chi tiết">
//             👁️
//           </button>
//         </td>
//       </tr>`;
//     })
//     .join("");

//   bindMemberDetail(members);
// }

// function renderTemp(tt = [], tv = []) {
//   $("#ttList").innerHTML =
//     (tt || [])
//       .map(
//         (r) =>
//           `<div class="item">Từ ${fmtDate(r.tu_ngay)} đến ${fmtDate(
//             r.den_ngay
//           )} – ${r.noi || r.noi_tam_tru || ""} (${r.ly_do || ""})</div>`
//       )
//       .join("") || "—";
//   $("#tvList").innerHTML =
//     (tv || [])
//       .map(
//         (r) =>
//           `<div class="item">Từ ${fmtDate(r.tu_ngay)} đến ${fmtDate(
//             r.den_ngay
//           )} – ${r.noi_den || r.dest || ""} (${
//             r.ly_do || r.reason || ""
//           })</div>`
//       )
//       .join("") || "—";
// }

// function renderHistory(arr = []) {
//   $("#historyList").innerHTML =
//     (arr || [])
//       .map(
//         (e) =>
//           `<div class="ev"><b>${fmtDate(e.date)}</b> • ${e.type} – ${
//             e.note || ""
//           }</div>`
//       )
//       .join("") || "—";
// }

// function renderNews(list = []) {
//   const box = $("#newsList");
//   box.innerHTML =
//     (list || [])
//       .map(
//         (n) => `
//     <div class="news__item">
//       <div class="news__title">${n.title}</div>
//       <div class="news__meta">${fmtDate(n.date)}</div>
//     </div>`
//       )
//       .join("") || '<div class="muted">Hiện chưa có thông báo.</div>';
// }

// function statusBadge(s) {
//   const map = { HOAN_TAT: "ok", DANG_XU_LY: "proc", DA_TIEP_NHAN: "new" };
//   const label =
//     {
//       HOAN_TAT: "Hoàn tất",
//       DANG_XU_LY: "Đang xử lý",
//       DA_TIEP_NHAN: "Đã tiếp nhận",
//     }[s] || s;
//   return `<span class="badge ${map[s] || "new"}">${label}</span>`;
// }

// function renderTickets(list) {
//   if (list !== undefined && list !== null) {
//     ticketsData = list;
//   }
//   const data =
//     ticketFilter === "ALL"
//       ? ticketsData
//       : ticketsData.filter((t) => t.status === ticketFilter);

//   const box = $("#ticketList");
//   if (!data.length) {
//     box.innerHTML = '<div class="muted">Bạn chưa có phản ánh nào.</div>';
//     return;
//   }

//   box.innerHTML = data
//     .map((t) => {
//       const idStr = t.id ? `#${t.id}` : "";
//       const cat = t.category || t.loai || "";
//       const content =
//         t.content || t.noi_dung || "(Chưa có nội dung chi tiết để hiển thị.)";
//       const lastNote = t.lastNote || t.ghi_chu_to_truong || "";
//       return `
//       <div class="ticket">
//         <button class="ticket__row ticket-toggle" data-id="${t.id || ""}">
//           <div>
//             <div class="ticket__title">${t.title}</div>
//             <div class="ticket__id">${idStr}${cat ? " • " + cat : ""}</div>
//             <div class="news__meta">${fmtDate(t.date)}</div>
//           </div>
//           <div>${statusBadge(t.status)}</div>
//         </button>
//         <div class="ticket__body" hidden>
//           <div><b>Nội dung:</b> ${content}</div>
//           ${
//             lastNote
//               ? `<div style="margin-top:4px;"><b>Ghi chú của Tổ trưởng:</b> ${lastNote}</div>`
//               : ""
//           }
//         </div>
//       </div>`;
//     })
//     .join("");

//   bindTicketDetails();
// }

// // KPI + sparkline
// function renderKPI(me) {
//   const hh = me.household || me.ho_khau || {};
//   $("#kpiHousehold .kpi__val").textContent = hh.so_ho_khau || "—";
//   $("#kpiMembers").textContent = String((hh.members || []).length);
//   $("#kpiHead").textContent = `Chủ hộ: ${hh.chu_ho || "—"}`;
//   $("#kpiStatus").textContent = fmtStatus(
//     me.citizen?.trang_thai || me.nhan_khau?.trang_thai || "—"
//   );

//   const data = [5, 7, 6, 9, 11, 10, 12, 13, 12, 14, 15, 16];
//   const w = 180,
//     h = 34,
//     max = Math.max(...data),
//     min = Math.min(...data);
//   const pts = data
//     .map(
//       (v, i) =>
//         `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`
//     )
//     .join(" ");
//   $(
//     "#sparkStay"
//   ).innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
//     <polyline points="${pts}" fill="none" stroke="#1f4ad8" stroke-width="2"/>
//   </svg>`;
// }

// // ===== Behaviour =====
// function navigateToSection(id) {
//   $$("[data-section]").forEach(
//     (sec) => (sec.hidden = sec.id !== id.replace("#", ""))
//   );
//   const layout = document.querySelector(".layout-3");
//   if (layout) {
//     window.scrollTo({ top: layout.offsetTop - 8, behavior: "smooth" });
//   }
// }
// function bindQuickActions() {
//   $$(".action").forEach((b) => {
//     b.addEventListener("click", () => {
//       const a = b.dataset.action;
//       switch (a) {
//         case "tempPermit":
//           navigateToSection("secTemp");
//           $("#ttForm").open = true;
//           $("#tvForm").open = false;
//           document.querySelector('#ttForm input[name="addr"]').focus();
//           break;
//         case "tempAbs":
//           navigateToSection("secTemp");
//           $("#tvForm").open = true;
//           $("#ttForm").open = false;
//           document.querySelector('#tvForm input[name="dest"]').focus();
//           break;
//         case "meetLeader":
//           openMeet();
//           break;
//       }
//     });
//   });
// }
// function bindSidebarNav() {
//   const btns = $$(".sidenav__item");
//   btns.forEach((btn) => {
//     const target = btn.getAttribute("data-target");
//     if (!target) return;
//     btn.addEventListener("click", () => {
//       btns.forEach((b) => b.classList.remove("is-active"));
//       btn.classList.add("is-active");
//       navigateToSection(target);
//     });
//   });
// }

// // ===== Form tạo phản ánh trong "Phản ánh của tôi" =====
// function toggleTicketForm(show) {
//   const form = $("#ticketForm");
//   const btn = $("#btnNewTicket");
//   if (!form || !btn) return;

//   if (show) {
//     form.removeAttribute("hidden");
//     btn.textContent = "Đóng";
//     const titleInput = form.querySelector('input[name="title"]');
//     if (titleInput) titleInput.focus();
//   } else {
//     form.setAttribute("hidden", "");
//     btn.textContent = "+ Tạo mới";
//     form.reset();
//   }
// }

// function bindTicketForm() {
//   const form = $("#ticketForm");
//   const btn = $("#btnNewTicket");
//   const cancelBtn = $("#ticketCancel");
//   if (!form || !btn) return;

//   btn.addEventListener("click", () => {
//     const isHidden = form.hasAttribute("hidden");
//     toggleTicketForm(isHidden);
//   });

//   if (cancelBtn) {
//     cancelBtn.addEventListener("click", () => toggleTicketForm(false));
//   }

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const fd = new FormData(form);
//     if (fd.getAll("files").length > 3) {
//       showToast("Chỉ đính kèm tối đa 3 ảnh.");
//       return;
//     }

//     let ok = false;
//     try {
//       const token = getToken();
//       const res = await fetch(`${API_BASE}/feedbacks`, {
//         method: "POST",
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//         body: fd,
//         credentials: "include",
//       });
//       ok = res.ok;
//       if (!ok) throw new Error(await res.text());
//     } catch {
//       const payload = {
//         category: fd.get("category"),
//         title: fd.get("title"),
//         content: fd.get("content"),
//         shareContact: !!fd.get("shareContact"),
//       };
//       const res2 = await apiFetch("/feedbacks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       ok = !!res2;
//     }

//     if (ok) {
//       showToast("Đã gửi phản ánh/yêu cầu. Cảm ơn bạn!");
//       toggleTicketForm(false);
//       const tickets = await loadMyTickets();
//       renderTickets(tickets);
//     } else {
//       showToast("Gửi thất bại. Vui lòng thử lại.");
//     }
//   });
// }

// // Ticket filters
// function bindTicketFilters() {
//   const container = $("#ticketFilters");
//   if (!container) return;
//   container.addEventListener("click", (e) => {
//     const btn = e.target.closest(".chip");
//     if (!btn) return;
//     $$("#ticketFilters .chip").forEach((c) => c.classList.remove("is-active"));
//     btn.classList.add("is-active");
//     ticketFilter = btn.dataset.status || "ALL";
//     renderTickets(); // dùng data đã load
//   });
// }

// // Ticket details accordion
// function bindTicketDetails() {
//   $$(".ticket-toggle").forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const ticket = btn.closest(".ticket");
//       const body = ticket.querySelector(".ticket__body");
//       if (!body) return;
//       body.hidden = !body.hidden;
//     });
//   });
// }

// // ===== Đăng ký thường trú =====

// // bật/tắt các field "người lớn" khi chọn Trẻ em
// function updatePermSubjectMode() {
//   const sel = $("#permSubject");
//   const form = $("#permForm");
//   if (!sel || !form) return;

//   const isChild = sel.value === "CHILD";
//   $$("#permForm [data-adult-only]").forEach((label) => {
//     const control = label.querySelector("input,select,textarea");
//     if (control) control.disabled = isChild;
//     label.classList.toggle("is-child-only", isChild);
//   });
// }

// function bindPermReg() {
//   const form = $("#permForm");
//   if (!form) return;

//   const subjectSelect = $("#permSubject");
//   if (subjectSelect) {
//     subjectSelect.addEventListener("change", updatePermSubjectMode);
//     updatePermSubjectMode();
//   }

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const fd = new FormData(form);

//     const files = fd.getAll("files");
//     if (files.length > 3) {
//       showToast("Chỉ đính kèm tối đa 3 file.");
//       return;
//     }

//     let ok = false;
//     // 1) gửi multipart (có file)
//     try {
//       const token = getToken();
//       const res = await fetch(`${API_BASE}/permanent-registrations`, {
//         method: "POST",
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//         body: fd,
//         credentials: "include",
//       });
//       ok = res.ok;
//       if (!ok) throw new Error(await res.text());
//     } catch {
//       // 2) fallback gửi JSON
//       const payload = {};
//       for (const [key, value] of fd.entries()) {
//         if (key === "files") continue;
//         if (value instanceof File) continue;
//         payload[key] = value;
//       }
//       const res2 = await apiFetch("/permanent-registrations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       ok = !!res2;
//     }

//     if (ok) {
//       const hoTen = fd.get("ho_ten") || fd.get("full_name") || "thành viên mới";
//       showToast("Đã gửi đăng ký thường trú. Tổ trưởng sẽ xem xét.");
//       form.reset();
//       updatePermSubjectMode();

//       pushLocalHistory({
//         date: new Date().toISOString(),
//         type: "DK_THUONG_TRU",
//         note: `Đăng ký thường trú cho ${hoTen}.`,
//       });
//     } else {
//       showToast("Gửi đăng ký thường trú thất bại. Vui lòng thử lại.");
//     }
//   });
// }

// // ===== Tạm trú / Tạm vắng =====
// function bindTempForms() {
//   const formTT = $("#formTT");
//   const formTV = $("#formTV");

//   if (formTT) {
//     formTT.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const fd = new FormData(formTT);
//       const payload = {
//         addr: fd.get("addr"),
//         from: fd.get("from"),
//         to: fd.get("to"),
//         reason: fd.get("reason"),
//       };
//       await apiFetch("/temp-stay", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       showToast("Đã gửi đăng ký tạm trú.");
//       pushLocalHistory({
//         date: new Date().toISOString(),
//         type: "TAM_TRU",
//         note: `Đăng ký tạm trú tại ${payload.addr || ""}.`,
//       });
//       formTT.reset();
//     });
//   }

//   if (formTV) {
//     formTV.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const fd = new FormData(formTV);
//       const payload = {
//         dest: fd.get("dest"),
//         from: fd.get("from"),
//         to: fd.get("to"),
//         reason: fd.get("reason"),
//       };
//       await apiFetch("/temp-absence", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       showToast("Đã gửi báo tạm vắng.");
//       pushLocalHistory({
//         date: new Date().toISOString(),
//         type: "TAM_VANG",
//         note: `Báo tạm vắng đi ${payload.dest || ""}.`,
//       });
//       formTV.reset();
//     });
//   }
// }

// // ===== FAB: hộp thư – nhảy nhanh tới "Phản ánh của tôi" =====
// function bindFabShortcut() {
//   const fab = $("#btnFabFeedback");
//   if (!fab) return;

//   fab.addEventListener("click", () => {
//     const btns = $$(".sidenav__item");
//     btns.forEach((b) => {
//       const target = b.getAttribute("data-target");
//       if (target === "#secMyTickets") {
//         b.classList.add("is-active");
//       } else {
//         b.classList.remove("is-active");
//       }
//     });

//     navigateToSection("secMyTickets");
//     toggleTicketForm(true);
//   });
// }

// // Meeting modal
// function openMeet() {
//   $("#meetModal").classList.remove("hide");
// }
// function closeMeet() {
//   $("#meetModal").classList.add("hide");
// }
// function bindMeet() {
//   $("#meetClose").addEventListener("click", closeMeet);
//   $("#meetCancel").addEventListener("click", closeMeet);
//   $("#meetBackdrop").addEventListener("click", closeMeet);
//   $("#meetForm").addEventListener("submit", (e) => {
//     e.preventDefault();
//     closeMeet();
//     showToast("Đã gửi yêu cầu đặt lịch. Tổ trưởng sẽ xác nhận sớm.");
//   });
// }

// // Clipboard & logout
// function bindClipboard() {
//   $("#btnCopyHK").addEventListener("click", async () => {
//     const text = $("#kpiHousehold .kpi__val").textContent.trim();
//     if (!text || text === "—") return;
//     try {
//       await navigator.clipboard.writeText(text);
//       showToast("Đã sao chép số hộ khẩu");
//     } catch {
//       showToast("Không sao chép được");
//     }
//   });
// }
// // function bindLogout() {
// //   $("#btnLogout").addEventListener("click", () => {
// //     localStorage.removeItem("token");
// //     sessionStorage.removeItem("token");
// //     showToast("Đã đăng xuất");
// //     setTimeout(() => (location.href = "index.html"), 800);
// //   });
// // }

// // ===== Modal thành viên hộ khẩu =====
// function openMemberModal(m) {
//   if (!m) return;

//   let detail = { ...m };
//   if (currentMe?.citizen && m.ho_ten === currentMe.citizen.ho_ten) {
//     detail = { ...detail, ...currentMe.citizen };
//   }

//   $("#memName").textContent = detail.ho_ten || "—";

//   let role = "Thành viên trong hộ";
//   if (detail.quan_he === "CHU_HO") role = "Chủ hộ";
//   if (currentMe?.citizen && detail.ho_ten === currentMe.citizen.ho_ten) {
//     role = role + " (tài khoản đang đăng nhập)";
//   }
//   $("#memRole").textContent = role;

//   $("#memRelation").textContent = fmtRelation(detail.quan_he);
//   $("#memDob").textContent = fmtDate(detail.ngay_sinh);
//   $("#memGender").textContent = fmtGender(detail.gioi_tinh);
//   $("#memCCCD").textContent = maskCCCD(detail.cccd);
//   $("#memJob").textContent = detail.nghe_nghiep || "—";
//   $("#memStatus").textContent = fmtStatus(detail.trang_thai);
//   $("#memPhone").textContent = detail.so_dien_thoai || "—";
//   $("#memAddress").textContent =
//     detail.thuong_tru || detail.dia_chi || detail.noi_o || "—";
//   $("#memNote").textContent = detail.ghi_chu || detail.note || "—";

//   const modal = $("#memberModal");
//   if (!modal) return;
//   modal.classList.remove("hide");
//   modal.setAttribute("aria-hidden", "false");
// }

// function closeMemberModal() {
//   const modal = $("#memberModal");
//   if (!modal) return;
//   modal.classList.add("hide");
//   modal.setAttribute("aria-hidden", "true");
// }

// function bindMemberModalStatic() {
//   const modal = $("#memberModal");
//   if (!modal) return;
//   const btnClose = $("#memberClose");
//   const backdrop = $("#memberBackdrop");
//   btnClose && btnClose.addEventListener("click", closeMemberModal);
//   backdrop && backdrop.addEventListener("click", closeMemberModal);
// }

// function bindMemberDetail(membersParam) {
//   const members = membersParam || currentMe?.household?.members || [];
//   $$(".member-view").forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const idx = Number(btn.dataset.idx);
//       const m = members[idx];
//       if (m) openMemberModal(m);
//     });
//   });
// }

// // ===== Init =====
// window.addEventListener("DOMContentLoaded", async () => {
//   startClock();

//   bindSidebarNav();
//   bindQuickActions();
//   bindMeet();
//   bindClipboard();
//   // bindLogout();
//   bindTicketForm();
//   bindTicketFilters();
//   bindFabShortcut();
//   bindPermReg();
//   bindTempForms();
//   bindMemberModalStatic();

//   const [me, news, tickets] = await Promise.all([
//     loadMe(),
//     loadNews(),
//     loadMyTickets(),
//   ]);
//   currentMe = me;

//   renderLeader(me.leader || me.to_truong || {});
//   renderCitizen(me.citizen || me.nhan_khau || {});
//   renderHousehold(me.household || me.ho_khau || {});
//   renderTemp(me.tempStay || me.tam_tru || [], me.tempAbs || me.tam_vang || []);
//   renderHistory(me.history || me.bien_dong || []);
//   renderKPI(me);
//   renderNews(news);
//   renderTickets(tickets);

//   // --- C. XỬ LÝ ĐĂNG XUẤT ---
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
// });
