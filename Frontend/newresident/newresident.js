const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const touched = new Set();

const state = {
  page: 1,
  step1: {
    householdType: "existing", // existing|new
    ownerCccd: "",
    ownerLookup: "idle", // idle|notfound|found
    ownerVerified: false,
    ownerInfo: null,
    addressText: "",
    residenceType: "permanent", // permanent|temporary
    tempFrom: "",
    tempTo: "",
  },
  step2: {
    person: {
      fullName: "",
      alias: "",
      ethnicity: "",
      dob: "",
      gender: "",
      cccd: "",
      issueDate: "",
      issuePlace: "",
      birthPlace: "",
      hometown: "",
      job: "",
      workplace: "",
      prevAddr: "",
      relation: "",
    },
    family: {
      extraCount: 0,
      active: 0,
      members: [], // [{name,dob,ageGroup,cccd,relation,prevAddr}]
    },
  },
};

// ===== helpers =====
function isValidCCCD(v) {
  return /^\d{9}(\d{3})?$/.test((v || "").trim());
}
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00").toLocaleDateString("vi-VN");
}
function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setPage(n) {
  state.page = n;
  qsa(".page").forEach((p) =>
    p.classList.toggle("active", Number(p.dataset.page) === n)
  );
  qsa(".stepBtn").forEach((b) =>
    b.classList.toggle("active", Number(b.dataset.step) === n)
  );
  if (n === 3) renderSummary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setMsg(key, type, text) {
  const el = qs(`[data-err="${key}"]`);
  if (!el) return;
  el.classList.remove("ok", "info");
  if (type === "ok") el.classList.add("ok");
  if (type === "info") el.classList.add("info");
  el.textContent = text || "";
}
function clearMsg(key) {
  setMsg(key, "", "");
}

function setInputState(input, type) {
  if (!input) return;
  input.classList.remove("is-valid", "is-invalid", "is-info");
  if (type === "ok") input.classList.add("is-valid");
  if (type === "bad") input.classList.add("is-invalid");
  if (type === "info") input.classList.add("is-info");
}

// ===== validators =====
function vText(key, el, showAll, msg) {
  const v = (el.value || "").trim();
  const show = showAll || touched.has(key);
  if (!v) {
    setInputState(el, "");
    if (show) setMsg(key, "", "✕ " + msg);
    else clearMsg(key);
    return false;
  }
  setInputState(el, "ok");
  if (show) setMsg(key, "ok", "✓ Hợp lệ");
  else clearMsg(key);
  return true;
}
function vDate(key, el, showAll, msg) {
  const v = el.value || "";
  const show = showAll || touched.has(key);
  if (!v) {
    setInputState(el, "");
    if (show) setMsg(key, "", "✕ " + msg);
    else clearMsg(key);
    return false;
  }
  setInputState(el, "ok");
  if (show) setMsg(key, "ok", "✓ Hợp lệ");
  else clearMsg(key);
  return true;
}
function vSelect(key, el, showAll, msg) {
  const v = el.value || "";
  const show = showAll || touched.has(key);
  if (!v) {
    setInputState(el, "");
    if (show) setMsg(key, "", "✕ " + msg);
    else clearMsg(key);
    return false;
  }
  setInputState(el, "ok");
  if (show) setMsg(key, "ok", "✓ Hợp lệ");
  else clearMsg(key);
  return true;
}
function vCCCD(key, el, showAll) {
  const v = (el.value || "").trim();
  const show = showAll || touched.has(key);
  if (!v) {
    setInputState(el, "");
    if (show) setMsg(key, "", "✕ Vui lòng nhập CCCD/CMND.");
    else clearMsg(key);
    return false;
  }
  if (!isValidCCCD(v)) {
    setInputState(el, "bad");
    if (show) setMsg(key, "", "✕ CCCD/CMND không hợp lệ (9 hoặc 12 số).");
    else clearMsg(key);
    return false;
  }
  setInputState(el, "ok");
  if (show) setMsg(key, "ok", "✓ Hợp lệ");
  else clearMsg(key);
  return true;
}

// ===== STEP 1 =====
function readStep1() {
  state.step1.householdType =
    qsa('input[name="householdType"]').find((r) => r.checked)?.value ||
    "existing";
  state.step1.residenceType =
    qsa('input[name="residenceType"]').find((r) => r.checked)?.value ||
    "permanent";
  state.step1.ownerCccd = (qs("#ownerCccd").value || "").trim();
  state.step1.addressText = (qs("#addressText").value || "").trim();
  state.step1.tempFrom = qs("#tempFrom").value || "";
  state.step1.tempTo = qs("#tempTo").value || "";
}

function syncStep1UI() {
  readStep1();
  const s1 = state.step1;
  const verified = Boolean(s1.ownerVerified && s1.ownerInfo);

  qs("#existingBox").style.display =
    s1.householdType === "existing" ? "block" : "none";

  // ✅ addressBox:
  // - hộ mới: luôn hiện
  // - hộ đã có: ẩn mặc định, chỉ hiện khi notfound (nhập thủ công)
  let showAddress = false;
  if (s1.householdType === "new") showAddress = true;
  if (
    s1.householdType === "existing" &&
    !verified &&
    s1.ownerLookup === "notfound"
  )
    showAddress = true;

  qs("#addressBox").style.display = showAddress ? "block" : "none";

  qs("#addressHint").textContent =
    s1.householdType === "new"
      ? "Bạn đang tạo hộ mới nên bắt buộc điền địa chỉ."
      : verified
      ? "Đã xác minh chủ hộ: địa chỉ lấy theo hộ và phần này bị ẩn."
      : s1.ownerLookup === "notfound"
      ? "Không tìm thấy chủ hộ: vui lòng nhập địa chỉ cư trú hiện tại để đăng ký thủ công."
      : "Hộ đã có: nhập CCCD chủ hộ và bấm “Kiểm tra” (địa chỉ đang ẩn).";

  qs("#tempDates").style.display =
    s1.residenceType === "temporary" ? "block" : "none";
  renderOwnerInfo();
}

function renderOwnerInfo() {
  const s1 = state.step1;
  const verified = Boolean(s1.ownerVerified && s1.ownerInfo);

  const infoBox = qs("#ownerInfo"); // Bảng thông tin chi tiết
  const hint = qs("#verifyHint");
  const btn = qs("#verifyOwnerBtn");
  const input = qs("#ownerCccd");

  // LUÔN ẨN bảng thông tin chi tiết theo yêu cầu
  if (infoBox) infoBox.style.display = "none";

  if (verified) {
    hint.textContent = "Đã xác minh ✓";
    qs("#verifyNotice").style.display = "none";

    input.disabled = true;
    btn.disabled = true;
    btn.textContent = "Đã xác nhận";

    setInputState(input, "ok");
    setMsg("ownerCccd", "ok", "✓ Đã xác minh");
  } else {
    hint.textContent = "Chưa xác minh";
    input.disabled = false;
    btn.disabled = false;
    btn.textContent = "Kiểm tra";
  }
}

async function verifyOwner() {
  readStep1();
  const s1 = state.step1;
  const input = qs("#ownerCccd");
  touched.add("ownerCccd");

  s1.ownerVerified = false;
  s1.ownerInfo = null;
  s1.ownerLookup = "idle";
  qs("#verifyNotice").style.display = "none";

  const token = localStorage.getItem("userToken"); // Lấy token từ localStorage

  // Kiểm tra tính hợp lệ của CCCD trước khi gọi API
  if (!s1.ownerCccd) {
    setInputState(input, "bad");
    setMsg("ownerCccd", "", "✕ Vui lòng nhập CCCD chủ hộ.");
    syncStep1UI();
    return;
  }
  if (!isValidCCCD(s1.ownerCccd)) {
    setInputState(input, "bad");
    setMsg("ownerCccd", "", "✕ CCCD không hợp lệ (9 hoặc 12 số).");
    syncStep1UI();
    return;
  }

  const btn = qs("#verifyOwnerBtn");
  btn.disabled = true;
  btn.textContent = "Đang kiểm tra...";

  try {
    // Sử dụng đường dẫn tương đối có tiền tố /api
    const response = await fetch(`/api/house/by-cccd/${s1.ownerCccd}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Header xác thực bắt buộc
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (result.success && result.data) {
      const house = result.data;
      s1.ownerLookup = "found";
      s1.ownerVerified = true;
      s1.ownerInfo = house; // Lưu dữ liệu vào state ngầm

      // Tự động đồng bộ Loại cư trú và Ngày hết hạn
      const resTypePermanent = qsa('input[name="residenceType"]').find(
        (r) => r.value === "permanent"
      );
      const resTypeTemporary = qsa('input[name="residenceType"]').find(
        (r) => r.value === "temporary"
      );

      if (house.type === "Thường trú") {
        resTypePermanent.checked = true;
        s1.residenceType = "permanent";
        resTypeTemporary.disabled = true;
        resTypePermanent.disabled = false;
      } else {
        resTypeTemporary.checked = true;
        s1.residenceType = "temporary";
        resTypePermanent.disabled = true;
        resTypeTemporary.disabled = false;

        if (house.latest_end) {
          const endDate = house.latest_end;
          qs("#tempTo").value = endDate;
          qs("#tempTo").readOnly = true;
          s1.tempTo = endDate;
        }
      }
    } else {
      throw new Error(result.message || "Không tìm thấy chủ hộ");
    }
  } catch (err) {
    s1.ownerLookup = "notfound";
    const notice = qs("#verifyNotice");
    notice.textContent =
      "Không tìm thấy chủ hộ. Hãy nhập địa chỉ cư trú hiện tại để đăng ký thủ công.";
    notice.className = "notice";
    notice.style.display = "block";

    setInputState(input, "bad");
    setMsg("ownerCccd", "", "✕ " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Kiểm tra";
    syncStep1UI(); // Hàm này sẽ gọi lại renderOwnerInfo ở trên
  }
}

function syncResidenceTypeWithHouse(house) {
  const s1 = state.step1;
  const resTypePermanent = qsa('input[name="residenceType"]').find(
    (r) => r.value === "permanent"
  );
  const resTypeTemporary = qsa('input[name="residenceType"]').find(
    (r) => r.value === "temporary"
  );

  if (house.type === "Thường trú") {
    resTypePermanent.checked = true;
    s1.residenceType = "permanent";
    // Disable lựa chọn còn lại
    resTypeTemporary.disabled = true;
    resTypePermanent.disabled = false;
  } else {
    resTypeTemporary.checked = true;
    s1.residenceType = "temporary";
    resTypePermanent.disabled = true;
    resTypeTemporary.disabled = false;

    // Fix ngày kết thúc từ backend
    if (house.latest_end) {
      const endDate = house.latest_end.split("T")[0];
      qs("#tempTo").value = endDate;
      qs("#tempTo").readOnly = true; // Khóa không cho sửa
      s1.tempTo = endDate;
    }
  }
}

function changeOwner() {
  const s1 = state.step1;
  s1.ownerVerified = false;
  s1.ownerInfo = null;
  s1.ownerLookup = "idle";
  s1.ownerCccd = "";
  qs("#ownerCccd").value = "";
  qs("#verifyNotice").style.display = "none";
  setInputState(qs("#ownerCccd"), "");
  clearMsg("ownerCccd");
  syncStep1UI();
}

function validateStep1(showAll = false) {
  readStep1();
  const s1 = state.step1;
  let ok = true;

  const verified = Boolean(s1.ownerVerified && s1.ownerInfo);

  if (s1.householdType === "existing") {
    const ownerEl = qs("#ownerCccd");
    const show = showAll || touched.has("ownerCccd");

    if (!s1.ownerCccd) {
      setInputState(ownerEl, "bad");
      if (show) setMsg("ownerCccd", "", "✕ Vui lòng nhập CCCD chủ hộ.");
      ok = false;
    } else if (!isValidCCCD(s1.ownerCccd)) {
      setInputState(ownerEl, "bad");
      if (show) setMsg("ownerCccd", "", "✕ CCCD không hợp lệ (9 hoặc 12 số).");
      ok = false;
    } else if (verified) {
      setInputState(ownerEl, "ok");
      if (show) setMsg("ownerCccd", "ok", "✓ Đã xác minh");
    } else if (s1.ownerLookup === "notfound") {
      ok =
        vText(
          "addressText",
          qs("#addressText"),
          showAll,
          "Vui lòng nhập địa chỉ đầy đủ."
        ) && ok;
    } else {
      setInputState(ownerEl, "info");
      if (show)
        setMsg(
          "ownerCccd",
          "info",
          "Định dạng hợp lệ — bấm “Kiểm tra” để xác minh."
        );
      ok = false;
    }
  } else {
    ok =
      vText(
        "addressText",
        qs("#addressText"),
        showAll,
        "Vui lòng nhập địa chỉ đầy đủ."
      ) && ok;
  }

  if (s1.residenceType === "temporary") {
    ok =
      vDate("tempFrom", qs("#tempFrom"), showAll, "Chọn ngày bắt đầu.") && ok;
    ok = vDate("tempTo", qs("#tempTo"), showAll, "Chọn ngày kết thúc.") && ok;
  } else {
    clearMsg("tempFrom");
    clearMsg("tempTo");
    setInputState(qs("#tempFrom"), "");
    setInputState(qs("#tempTo"), "");
  }

  return ok;
}

// ===== FAMILY AGE GROUP HELPERS =====
function getAgeGroupFromUI() {
  return (
    qsa('input[name="mAgeGroup"]').find((r) => r.checked)?.value || "over14"
  );
}
function setAgeGroupToUI(val) {
  qsa('input[name="mAgeGroup"]').forEach((r) => (r.checked = r.value === val));
}

function toggleMemberCccdUI(ageGroup) {
  const under14 = ageGroup === "under14";

  const items = [
    {
      wrap: "#mCccdWrap",
      input: "#mCccd",
      key: "mCccd",
      placeholder: "Không yêu cầu (dưới 14 tuổi)",
    },
    {
      wrap: "#mIssueDateWrap",
      input: "#mIssueDate",
      key: "mIssueDate",
      placeholder: "",
    },
    {
      wrap: "#mIssuePlaceWrap",
      input: "#mIssuePlace",
      key: "mIssuePlace",
      placeholder: "Không yêu cầu (dưới 14 tuổi)",
    },
  ];

  items.forEach((it) => {
    const w = qs(it.wrap);
    const el = qs(it.input);
    if (!w || !el) return;

    w.style.display = "block";
    el.disabled = under14;

    if (under14) {
      el.value = "";
      if ("placeholder" in el && it.placeholder)
        el.placeholder = it.placeholder;
      clearMsg(it.key);
      setInputState(el, "info");
    } else {
      if ("placeholder" in el && it.placeholder) el.placeholder = "";
      setInputState(el, "");
    }
  });
}

// ===== STEP 2 =====
function readStep2() {
  const p = state.step2.person;
  p.fullName = (qs("#fullName").value || "").trim();
  p.alias = (qs("#alias").value || "").trim();
  p.ethnicity = (qs("#ethnicity").value || "").trim();
  p.dob = qs("#dob").value || "";
  p.gender = qs("#gender").value || "";
  p.cccd = (qs("#cccd").value || "").trim();
  p.issueDate = qs("#issueDate").value || "";
  p.issuePlace = (qs("#issuePlace").value || "").trim();
  p.birthPlace = (qs("#birthPlace").value || "").trim();
  p.hometown = (qs("#hometown").value || "").trim();
  p.job = (qs("#job").value || "").trim();
  p.workplace = (qs("#workplace").value || "").trim();

  p.prevAddr = (qs("#prevAddr").value || "").trim();
  p.relation = qs("#pRelation").value || "";

  flushActiveMember(false);
}

function validateStep2(showAll = false) {
  readStep2();
  let ok = true;

  ok =
    vText("fullName", qs("#fullName"), showAll, "Vui lòng nhập họ tên.") && ok;
  ok =
    vText("ethnicity", qs("#ethnicity"), showAll, "Vui lòng nhập dân tộc.") &&
    ok;
  ok = vDate("dob", qs("#dob"), showAll, "Vui lòng chọn ngày sinh.") && ok;
  ok =
    vSelect("gender", qs("#gender"), showAll, "Vui lòng chọn giới tính.") && ok;
  ok = vCCCD("cccd", qs("#cccd"), showAll) && ok;

  ok =
    vDate("issueDate", qs("#issueDate"), showAll, "Vui lòng chọn ngày cấp.") &&
    ok;
  ok =
    vText("issuePlace", qs("#issuePlace"), showAll, "Vui lòng nhập nơi cấp.") &&
    ok;
  ok =
    vText(
      "birthPlace",
      qs("#birthPlace"),
      showAll,
      "Vui lòng nhập nơi sinh."
    ) && ok;
  ok =
    vText("hometown", qs("#hometown"), showAll, "Vui lòng nhập nguyên quán.") &&
    ok;

  ok = vText("job", qs("#job"), showAll, "Vui lòng nhập nghề nghiệp.") && ok;
  ok =
    vText(
      "workplace",
      qs("#workplace"),
      showAll,
      "Vui lòng nhập nơi làm việc."
    ) && ok;

  ok =
    vText(
      "prevAddr",
      qs("#prevAddr"),
      showAll,
      "Vui lòng nhập địa chỉ thường trú trước đây."
    ) && ok;
  ok =
    vSelect(
      "pRelation",
      qs("#pRelation"),
      showAll,
      "Vui lòng chọn mối quan hệ với chủ hộ."
    ) && ok;
  clearMsg("familyAll");
  const f = state.step2.family;

  if (showAll && f.extraCount > 0) {
    for (let i = 0; i < f.extraCount; i++) {
      const m = f.members[i];
      const ageGroup = m?.ageGroup || "over14";
      const needsCccd = ageGroup === "over14";
      const full =
        m &&
        m.name &&
        m.dob &&
        m.gender &&
        m.birthPlace &&
        m.hometown &&
        m.job &&
        m.workplace &&
        m.prevAddr &&
        m.relation &&
        (!needsCccd || (isValidCCCD(m.cccd) && m.issueDate && m.issuePlace));
      if (!full) {
        setMsg("familyAll", "", `✕ TV ${i + 1} chưa đủ thông tin bắt buộc.`);
        f.active = i;
        renderFamilyTabs();
        renderActiveMember();
        validateActiveMember(true);
        ok = false;
        break;
      }
    }
  }

  return ok;
}

// ===== Family tabs / data =====
function ensureFamily(n) {
  const f = state.step2.family;
  const count = Math.max(0, Math.min(10, Number(n) || 0));
  f.extraCount = count;
  f.active = 0;

  if (f.members.length < count) {
    while (f.members.length < count) {
      f.members.push({
        name: "",
        dob: "",
        ageGroup: "over14",
        gender: "",
        cccd: "",
        issueDate: "",
        issuePlace: "",
        birthPlace: "",
        hometown: "",
        job: "",
        workplace: "",
        prevAddr: "",
        relation: "",
      });
    }
  } else if (f.members.length > count) {
    f.members = f.members.slice(0, count);
  }

  qs("#familyTabs").style.display = count > 0 ? "flex" : "none";
  qs("#familyBox").style.display = count > 0 ? "block" : "none";

  renderFamilyTabs();
  renderActiveMember();
}

function renderFamilyTabs() {
  const f = state.step2.family;
  const tabs = qs("#familyTabs");
  tabs.innerHTML = "";

  for (let i = 0; i < f.extraCount; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tabBtn" + (i === f.active ? " active" : "");
    b.textContent = `TV ${i + 1}`;
    b.onclick = () => {
      flushActiveMember(true);
      f.active = i;
      renderFamilyTabs();
      renderActiveMember();
    };
    tabs.appendChild(b);
  }
}

function resetMemberTouched() {
  [
    "mAgeGroup",
    "mName",
    "mDob",
    "mGender",
    "mCccd",
    "mIssueDate",
    "mIssuePlace",
    "mBirthPlace",
    "mHometown",
    "mJob",
    "mWorkplace",
    "mPrevAddr",
    "mRelation",
  ].forEach((k) => touched.delete(k));
}

function renderActiveMember() {
  const f = state.step2.family;
  if (f.extraCount <= 0) return;

  resetMemberTouched();

  const i = f.active;
  const m = f.members[i];

  if (!m.ageGroup) m.ageGroup = "over14";

  qs("#memberTitle").textContent = `Thành viên ${i + 1}`;
  qs("#memCounter").textContent = `Thành viên ${i + 1}/${f.extraCount}`;

  setAgeGroupToUI(m.ageGroup);
  toggleMemberCccdUI(m.ageGroup);

  qs("#mName").value = m.name || "";
  qs("#mAlias").value = m.alias || "";
  qs("#mEthnicity").value = m.ethnicity || "";
  qs("#mDob").value = m.dob || "";
  qs("#mGender").value = m.gender || "";

  qs("#mCccd").value = m.cccd || "";
  qs("#mIssueDate").value = m.issueDate || "";
  qs("#mIssuePlace").value = m.issuePlace || "";

  qs("#mBirthPlace").value = m.birthPlace || "";
  qs("#mHometown").value = m.hometown || "";
  qs("#mJob").value = m.job || "";
  qs("#mWorkplace").value = m.workplace || "";

  qs("#mPrevAddr").value = m.prevAddr || "";
  qs("#mRelation").value = m.relation || "";
  qs("#memPrevBtn").disabled = i === 0;
  qs("#memNextBtn").disabled = i === f.extraCount - 1;

  [
    "mAgeGroup",
    "mName",
    "mDob",
    "mGender",
    "mCccd",
    "mIssueDate",
    "mIssuePlace",
    "mBirthPlace",
    "mHometown",
    "mJob",
    "mWorkplace",
    "mPrevAddr",
    "mRelation",
  ].forEach((k) => clearMsg(k));
  [
    "#mName",
    "#mDob",
    "#mGender",
    "#mCccd",
    "#mIssueDate",
    "#mIssuePlace",
    "#mBirthPlace",
    "#mHometown",
    "#mJob",
    "#mWorkplace",
    "#mPrevAddr",
    "#mRelation",
  ].forEach((sel) => setInputState(qs(sel), ""));
}

function flushActiveMember(showErr = false) {
  const f = state.step2.family;
  if (f.extraCount <= 0) return true;

  const i = f.active;
  const ageGroup = getAgeGroupFromUI();

  f.members[i] = {
    name: (qs("#mName").value || "").trim(),
    alias: (qs("#mAlias").value || "").trim(),
    ethnicity: (qs("#mEthnicity").value || "").trim(),
    dob: qs("#mDob").value || "",
    ageGroup,
    gender: qs("#mGender").value || "",

    cccd: (qs("#mCccd").value || "").trim(),
    issueDate: qs("#mIssueDate").value || "",
    issuePlace: (qs("#mIssuePlace").value || "").trim(),

    birthPlace: (qs("#mBirthPlace").value || "").trim(),
    hometown: (qs("#mHometown").value || "").trim(),
    job: (qs("#mJob").value || "").trim(),
    workplace: (qs("#mWorkplace").value || "").trim(),

    prevAddr: (qs("#mPrevAddr").value || "").trim(),
    relation: qs("#mRelation").value || "",
  };

  toggleMemberCccdUI(ageGroup);
  if (ageGroup === "under14") {
    f.members[i].cccd = "";
    f.members[i].issueDate = "";
    f.members[i].issuePlace = "";
  }
  return validateActiveMember(showErr);
}

function validateActiveMember(showAll = false) {
  const f = state.step2.family;
  if (f.extraCount <= 0) return true;

  let ok = true;

  // ageGroup
  const ageGroup = getAgeGroupFromUI();
  const showAge = showAll || touched.has("mAgeGroup");
  if (!ageGroup) {
    if (showAge) setMsg("mAgeGroup", "", "✕ Vui lòng chọn nhóm tuổi.");
    ok = false;
  } else {
    if (showAge) setMsg("mAgeGroup", "ok", "✓ Hợp lệ");
  }
  toggleMemberCccdUI(ageGroup);

  ok = vText("mName", qs("#mName"), showAll, "Vui lòng nhập họ tên.") && ok;
  ok =
    vText("mEthnicity", qs("#mEthnicity"), showAll, "Vui lòng nhập dân tộc.") &&
    ok;
  ok = vDate("mDob", qs("#mDob"), showAll, "Vui lòng chọn ngày sinh.") && ok;
  ok =
    vSelect("mGender", qs("#mGender"), showAll, "Vui lòng chọn giới tính.") &&
    ok;

  if (ageGroup === "over14") {
    ok = vCCCD("mCccd", qs("#mCccd"), showAll) && ok;
    ok =
      vDate(
        "mIssueDate",
        qs("#mIssueDate"),
        showAll,
        "Vui lòng chọn ngày cấp."
      ) && ok;
    ok =
      vText(
        "mIssuePlace",
        qs("#mIssuePlace"),
        showAll,
        "Vui lòng nhập nơi cấp."
      ) && ok;
  } else {
    // Dưới 14 tuổi: vẫn HIỂN THỊ nhưng KHÔNG bắt buộc
    ["mCccd", "mIssueDate", "mIssuePlace"].forEach((k) => clearMsg(k));
    ["#mCccd", "#mIssueDate", "#mIssuePlace"].forEach((sel) =>
      setInputState(qs(sel), "info")
    );
  }

  ok =
    vText(
      "mBirthPlace",
      qs("#mBirthPlace"),
      showAll,
      "Vui lòng nhập nơi sinh."
    ) && ok;
  ok =
    vText(
      "mHometown",
      qs("#mHometown"),
      showAll,
      "Vui lòng nhập nguyên quán."
    ) && ok;
  ok = vText("mJob", qs("#mJob"), showAll, "Vui lòng nhập nghề nghiệp.") && ok;
  ok =
    vText(
      "mWorkplace",
      qs("#mWorkplace"),
      showAll,
      "Vui lòng nhập nơi làm việc."
    ) && ok;
  ok =
    vText(
      "mPrevAddr",
      qs("#mPrevAddr"),
      showAll,
      "Vui lòng nhập địa chỉ thường trú trước đây."
    ) && ok;

  ok =
    vSelect(
      "mRelation",
      qs("#mRelation"),
      showAll,
      "Vui lòng chọn mối quan hệ."
    ) && ok;

  return ok;
}

// ===== SUMMARY =====
function renderSummary() {
  readStep1();
  readStep2();

  const s1 = state.step1;
  const s2 = state.step2;
  const verified = Boolean(s1.ownerVerified && s1.ownerInfo);

  const addr =
    s1.householdType === "existing" && verified
      ? s1.ownerInfo.address
      : (s1.addressText || "").trim();

  qs("#sumResidence").innerHTML = `
    <div class="sumItem"><div class="sumK">Loại hộ</div><div class="sumV">${escapeHtml(
      s1.householdType === "existing" ? "Hộ đã có" : "Hộ mới"
    )}</div></div>
    <div class="sumItem"><div class="sumK">Địa chỉ</div><div class="sumV">${escapeHtml(
      addr || "—"
    )}</div></div>
    <div class="sumItem"><div class="sumK">Loại cư trú</div><div class="sumV">${escapeHtml(
      s1.residenceType === "temporary" ? "Tạm trú" : "Thường trú"
    )}</div></div>
    <div class="sumItem"><div class="sumK">Thời gian tạm trú</div><div class="sumV">${
      s1.residenceType === "temporary"
        ? `${fmtDate(s1.tempFrom)} đến ${fmtDate(s1.tempTo)}`
        : "—"
    }</div></div>
  `;

  const p = s2.person;
  qs("#sumPerson").innerHTML = `
    <div class="sumItem"><div class="sumK">Họ tên</div><div class="sumV">${escapeHtml(
      p.fullName || "—"
    )}</div></div>
    <div class="sumItem"><div class="sumK">Bí danh</div><div class="sumV">${escapeHtml(
      p.alias || "Không có"
    )}</div></div> <div class="sumItem"><div class="sumK">Dân tộc</div><div class="sumV">${escapeHtml(
    p.ethnicity || "—"
  )}</div></div> 
    <div class="sumItem"><div class="sumK">Ngày sinh</div><div class="sumV">${escapeHtml(
      fmtDate(p.dob)
    )}</div></div>
    <div class="sumItem"><div class="sumK">Giới tính</div><div class="sumV">${escapeHtml(
      p.gender || "—"
    )}</div></div>
    <div class="sumItem"><div class="sumK">CCCD</div><div class="sumV">${escapeHtml(
      p.cccd || "—"
    )}</div></div>
    <div class="sumItem"><div class="sumK">Ngày cấp</div><div class="sumV">${escapeHtml(
      fmtDate(p.issueDate)
    )}</div></div>
    <div class="sumItem"><div class="sumK">Nơi cấp</div><div class="sumV">${escapeHtml(
      p.issuePlace || "—"
    )}</div></div>
    <div class="sumItem"><div class="sumK">Nghề nghiệp</div><div class="sumV">${escapeHtml(
      p.job || "—"
    )}</div></div>
    <div class="sumItem"><div class="sumK">Nơi làm việc</div><div class="sumV">${escapeHtml(
      p.workplace || "—"
    )}</div></div>
    <div class="sumItem"><div class="sumK">Địa chỉ thường trú trước đây</div><div class="sumV">${escapeHtml(
      p.prevAddr || "—"
    )}</div></div>
    <div class="sumItem"><div class="sumK">Mối quan hệ với chủ hộ</div><div class="sumV">${escapeHtml(
      p.relation || "—"
    )}</div></div>
  `;
  const f = s2.family;
  const sumFamily = qs("#sumFamily");
  if (f.extraCount <= 0) {
    sumFamily.textContent = "Không có";
    sumFamily.className = "muted";
  } else {
    sumFamily.className = "";

    sumFamily.innerHTML = f.members
      .map((m, i) => {
        const ageText =
          m.ageGroup === "under14" ? "Dưới 14 tuổi" : "Từ 14 tuổi trở lên";
        const cccdText =
          m.ageGroup === "under14" ? "Không yêu cầu" : m.cccd || "—";
        const issueDateText =
          m.ageGroup === "under14" ? "Không yêu cầu" : fmtDate(m.issueDate);
        const issuePlaceText =
          m.ageGroup === "under14" ? "Không yêu cầu" : m.issuePlace || "—";

        return `
    <div class="subcard" style="background:var(--nr-soft);">
      <div class="strong">TV ${i + 1}: ${escapeHtml(m.name || "—")}</div>

      <div class="muted small" style="margin-top:4px;">
        Nhóm tuổi: ${escapeHtml(ageText)} · Ngày sinh: ${escapeHtml(
          fmtDate(m.dob)
        )} · Giới tính: ${escapeHtml(m.gender || "—")}
      </div>

      <div class="muted small" style="margin-top:4px;">
        CCCD/CMND: ${escapeHtml(cccdText)} · Ngày cấp: ${escapeHtml(
          issueDateText
        )} · Nơi cấp: ${escapeHtml(issuePlaceText)} · Quan hệ: ${escapeHtml(
          m.relation || "—"
        )}
      </div>

      <div class="muted small" style="margin-top:6px;">
        Nơi sinh: ${escapeHtml(
          m.birthPlace || "—"
        )} · Nguyên quán: ${escapeHtml(m.hometown || "—")}
      </div>

      <div class="muted small" style="margin-top:4px;">
        Nghề nghiệp: ${escapeHtml(m.job || "—")} · Nơi làm việc: ${escapeHtml(
          m.workplace || "—"
        )}
      </div>

      <div class="muted small" style="margin-top:4px;">Đ/c thường trú trước đây: ${escapeHtml(
        m.prevAddr || "—"
      )}</div>
    </div>
  `;
      })
      .join("");
  }
}

function handleLogout(msg) {
  alert(msg);
  localStorage.clear();
  window.location.replace("../Login/Login.html");
}

// ===== init =====
document.addEventListener("DOMContentLoaded", () => {
  // 1. Lấy token và kiểm tra sự tồn tại trước
  const token = localStorage.getItem("userToken");

  if (!token) {
    handleLogout("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
    return;
  }

  // 2. Kiểm tra hết hạn Token
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));

    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      handleLogout("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    console.log(
      "Token hợp lệ đến:",
      new Date(payload.exp * 1000).toLocaleString()
    );
  } catch (error) {
    console.error("Token không hợp lệ:", error);
    handleLogout("Lỗi xác thực (Token sai định dạng), vui lòng đăng nhập lại.");
    return;
  }

  // 3. Khởi tạo Logic trang Web (Chỉ chạy khi token đã qua kiểm tra)
  state.step1.ownerLookup = "idle";
  syncStep1UI();

  // --- Giữ nguyên các Event Listeners bên dưới ---

  // stepper click
  qsa(".stepBtn").forEach((b) =>
    b.addEventListener("click", () => {
      const target = Number(b.dataset.step);
      if (target === 1) return setPage(1);
      if (target === 2) {
        if (!validateStep1(true)) return;
        return setPage(2);
      }
      if (target === 3) {
        if (!validateStep1(true)) return;
        if (!validateStep2(true)) return;
        return setPage(3);
      }
    })
  );

  // Nút Logout
  const btnLogout = document.getElementById("logoutBtn");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất không?");
      if (!confirmLogout) return;
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      window.location.replace("../Login/Login.html"); // Chuyển về login thay vì index nếu muốn ép đăng nhập lại
    });
  }

  // household type change
  qsa('input[name="householdType"]').forEach((r) =>
    r.addEventListener("change", () => {
      readStep1();
      const s1 = state.step1;

      if (s1.householdType === "new") {
        s1.ownerVerified = false;
        s1.ownerInfo = null;
        s1.ownerLookup = "idle";
        qs("#verifyNotice").style.display = "none";
        clearMsg("ownerCccd");
        setInputState(qs("#ownerCccd"), "");
      } else {
        s1.ownerVerified = false;
        s1.ownerInfo = null;
        s1.ownerLookup = "idle";
        qs("#verifyNotice").style.display = "none";
      }
      syncStep1UI();
    })
  );

  // residence type change
  qsa('input[name="residenceType"]').forEach((r) =>
    r.addEventListener("change", () => {
      syncStep1UI();
      validateStep1(false);
    })
  );

  // typing CCCD owner => reset lookup
  qs("#ownerCccd").addEventListener("input", () => {
    touched.add("ownerCccd");
    const s1 = state.step1;
    s1.ownerVerified = false;
    s1.ownerInfo = null;
    s1.ownerLookup = "idle";
    qs("#verifyNotice").style.display = "none";
    syncStep1UI();
    validateStep1(false);
  });

  ["addressText", "tempFrom", "tempTo"].forEach((id) => {
    const el = qs("#" + id);
    el.addEventListener("input", () => {
      touched.add(id);
      validateStep1(false);
    });
    el.addEventListener("change", () => {
      touched.add(id);
      validateStep1(false);
    });
  });

  qs("#verifyOwnerBtn").addEventListener("click", verifyOwner);
  qs("#changeOwnerBtn").addEventListener("click", changeOwner);

  // next/back
  qs("#next1Btn").addEventListener("click", () => {
    if (validateStep1(true)) setPage(2);
  });
  qs("#back2Btn").addEventListener("click", () => setPage(1));
  qs("#next2Btn").addEventListener("click", () => {
    if (validateStep2(true)) setPage(3);
  });
  qs("#back3Btn").addEventListener("click", () => setPage(2));

  // step2 live validate
  const bindTouch = (key, el, fn) => {
    el.addEventListener("input", () => {
      touched.add(key);
      fn(false);
    });
    el.addEventListener("change", () => {
      touched.add(key);
      fn(false);
    });
  };
  bindTouch("fullName", qs("#fullName"), validateStep2);
  bindTouch("alias", qs("#alias"), validateStep2);
  bindTouch("ethnicity", qs("#ethnicity"), validateStep2);
  bindTouch("dob", qs("#dob"), validateStep2);
  bindTouch("gender", qs("#gender"), validateStep2);
  bindTouch("cccd", qs("#cccd"), validateStep2);
  bindTouch("issueDate", qs("#issueDate"), validateStep2);
  bindTouch("issuePlace", qs("#issuePlace"), validateStep2);
  bindTouch("birthPlace", qs("#birthPlace"), validateStep2);
  bindTouch("hometown", qs("#hometown"), validateStep2);
  bindTouch("job", qs("#job"), validateStep2);
  bindTouch("workplace", qs("#workplace"), validateStep2);
  bindTouch("prevAddr", qs("#prevAddr"), validateStep2);
  bindTouch("pRelation", qs("#pRelation"), validateStep2);

  // family create
  qs("#createFamilyBtn").addEventListener("click", () => {
    ensureFamily(Number(qs("#extraCount").value || 0));
  });

  // age group change (live)
  qsa('input[name="mAgeGroup"]').forEach((r) => {
    r.addEventListener("change", () => {
      touched.add("mAgeGroup");
      flushActiveMember(false);
      validateActiveMember(false);
    });
  });

  // member live validate
  const bindMember = (key, el) => {
    if (!el) return;
    el.addEventListener("input", () => {
      touched.add(key);
      flushActiveMember(false);
      validateActiveMember(false);
    });
    el.addEventListener("change", () => {
      touched.add(key);
      flushActiveMember(false);
      validateActiveMember(false);
    });
  };

  bindMember("mName", qs("#mName"));
  bindMember("mAlias", qs("#mAlias"));
  bindMember("mEthnicity", qs("#mEthnicity"));
  bindMember("mDob", qs("#mDob"));
  bindMember("mGender", qs("#mGender"));
  bindMember("mCccd", qs("#mCccd"));
  bindMember("mIssueDate", qs("#mIssueDate"));
  bindMember("mIssuePlace", qs("#mIssuePlace"));
  bindMember("mBirthPlace", qs("#mBirthPlace"));
  bindMember("mHometown", qs("#mHometown"));
  bindMember("mJob", qs("#mJob"));
  bindMember("mWorkplace", qs("#mWorkplace"));
  bindMember("mPrevAddr", qs("#mPrevAddr"));
  bindMember("mRelation", qs("#mRelation"));
  qs("#memPrevBtn").addEventListener("click", () => {
    const f = state.step2.family;
    if (!flushActiveMember(true)) return;
    f.active = Math.max(0, f.active - 1);
    renderFamilyTabs();
    renderActiveMember();
  });

  qs("#memNextBtn").addEventListener("click", () => {
    const f = state.step2.family;
    if (!flushActiveMember(true)) return;
    f.active = Math.min(f.extraCount - 1, f.active + 1);
    renderFamilyTabs();
    renderActiveMember();
  });

  // submit
  qs("#submitBtn").addEventListener("click", async () => {
    // 1. Kiểm tra cam kết
    const a1 = qs("#agree1").checked;
    const a2 = qs("#agree2").checked;
    if (!a1 || !a2) {
      setMsg("agreements", "", "✕ Vui lòng tích đủ 2 ô cam kết.");
      return;
    }

    // 2. Chuẩn bị mảng people
    const people = [];
    // Người điền đơn (Applicant)
    const p = state.step2.person;
    people.push({
      isApplicant: true,
      cccd: p.cccd,
      ho_ten: p.fullName,
      bi_danh: p.alias || null,
      dan_toc: p.ethnicity,
      ngay_sinh: p.dob,
      gioi_tinh: p.gender,
      ngay_cap: p.issueDate,
      noi_cap: p.issuePlace,
      noi_sinh: p.birthPlace,
      que_quan: p.hometown,
      nghe_nghiep: p.job,
      noi_lam_viec: p.workplace,
      thuong_tru_truoc_day: p.prevAddr,
      quan_he_voi_chu_ho: p.relation,
    });

    // Thành viên đi cùng
    if (state.step2.family && state.step2.family.members.length > 0) {
      state.step2.family.members.forEach((m) => {
        // Chỉ push nếu thành viên này có tên (tránh push form rỗng)
        if (m.name) {
          people.push({
            isApplicant: false,
            cccd: m.cccd || null,
            ho_ten: m.name,
            bi_danh: m.alias || null,
            dan_toc: m.ethnicity,
            ngay_sinh: m.dob,
            gioi_tinh: m.gender,
            ngay_cap: m.issueDate || null,
            noi_cap: m.issuePlace || null,
            noi_sinh: m.birthPlace,
            que_quan: m.hometown,
            nghe_nghiep: m.job,
            noi_lam_viec: m.workplace,
            thuong_tru_truoc_day: m.prevAddr,
            quan_he_voi_chu_ho: m.relation,
          });
        }
      });
    }

    // 3. Xác định API endpoint và Body
    const isExisting =
      state.step1.householdType === "existing" && state.step1.ownerVerified;
    const url = isExisting
      ? "/api/newregister/existing-house"
      : "/api/newregister/new-house";

    const payload = isExisting
      ? {
          cccdChuHo: state.step1.ownerCccd,
          donDangKy: {
            begin: state.step1.tempFrom || null,
            end: state.step1.tempTo || null,
          },
          people,
        }
      : {
          donDangKy: {
            address: state.step1.addressText,
            _type:
              state.step1.residenceType === "permanent"
                ? "Thường trú"
                : "Tạm trú",
            begin: state.step1.tempFrom || null,
            end: state.step1.tempTo || null,
          },
          people,
        };

    // 4. Gọi API
    try {
      // Lấy token để vượt qua authMiddleware
      const token = localStorage.getItem("userToken");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // THÊM DÒNG NÀY: Gửi Token định dạng Bearer
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        qs("#submitOk").style.display = "block";
        qs("#submitOk").textContent =
          "Gửi đơn thành công! Bạn sẽ được chuyển về trang đăng nhập sau 3 giây...";
        qs("#submitBtn").disabled = true;

        // Đợi 3 giây để người dùng đọc thông báo rồi tự động chuyển trang
        setTimeout(() => {
          window.location.replace("../Login/login.html");
        }, 3000);
      } else {
        // Đây chính là nơi thông báo "Không có token" được hiển thị
        alert("Lỗi: " + result.message);
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ!");
    }
  });
});
