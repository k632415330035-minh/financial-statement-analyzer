// ====== WIZARD ĐĂNG KÝ CƯ TRÚ ======
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const resultBox = document.getElementById('resultMessage');

  // ====== HÀM HỖ TRỢ HIỂN THỊ LỖI ======
  function setFieldError(field, message) {
    if (!field) return;
    const group = field.closest('.form-group');
    if (!group) return;

    let errorEl = group.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'field-error';
      group.appendChild(errorEl);
    }

    if (message) {
      group.classList.add('has-error');
      errorEl.textContent = message;
    } else {
      group.classList.remove('has-error');
      errorEl.textContent = '';
    }
  }

  function getRequestType() {
    const typeRadio = document.querySelector('input[name="requestType"]:checked');
    return typeRadio ? typeRadio.value : 'tam_tru';
  }

  // ====== CHUYỂN GIỮA TẠM TRÚ / THƯỜNG TRÚ ======
  const requestTypeRadios = document.querySelectorAll('input[name="requestType"]');
  const tamTruSection = document.getElementById('tamTruSection');
  const thuongTruSection = document.getElementById('thuongTruSection');

  if (requestTypeRadios.length && tamTruSection && thuongTruSection) {
    requestTypeRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        const type = getRequestType();
        if (type === 'tam_tru') {
          tamTruSection.classList.remove('hidden');
          thuongTruSection.classList.add('hidden');
        } else {
          thuongTruSection.classList.remove('hidden');
          tamTruSection.classList.add('hidden');
        }
      });
    });
  }

  // ====== WIZARD 3 BƯỚC ======
  let currentStep = 1;
  const maxStep = 3;

  const stepPanes = document.querySelectorAll('.step-pane');
  const stepButtons = document.querySelectorAll('.steps .step');
  const prevBtn = document.getElementById('prevStep');
  const nextBtn = document.getElementById('nextStep');
  const submitBtn = document.getElementById('submitBtn');

  function goToStep(step) {
    if (step < 1 || step > maxStep) return;
    currentStep = step;

    stepPanes.forEach((pane) => {
      const paneStep = Number(pane.dataset.step);
      pane.classList.toggle('hidden', paneStep !== currentStep);
    });

    stepButtons.forEach((btn) => {
      const btnStep = Number(btn.dataset.step);
      btn.classList.toggle('step-active', btnStep === currentStep);
    });

    if (prevBtn) prevBtn.disabled = currentStep === 1;

    if (nextBtn && submitBtn) {
      if (currentStep === maxStep) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
      } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
      }
    }

    const cardRight = document.querySelector('.card-right');
    if (cardRight && typeof cardRight.scrollIntoView === 'function') {
      cardRight.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  stepButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetStep = Number(btn.dataset.step);
      goToStep(targetStep);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToStep(currentStep + 1);
    });
  }

  // ====== THÀNH VIÊN CÙNG HỘ - LẬT TRANG ======
  const householdCountInput = document.getElementById('householdCount');
  const generateMembersBtn = document.getElementById('generateMembersBtn');
  const membersWrapper = document.getElementById('householdMembersWrapper');
  const householdMembersContainer = document.getElementById('householdMembers');
  const memberTabs = document.getElementById('memberTabs');
  const memberNav = document.getElementById('memberNav');
  const prevMemberBtn = document.getElementById('prevMember');
  const nextMemberBtn = document.getElementById('nextMember');
  const memberStatus = document.getElementById('memberStatus');

  let currentMemberIndex = 0;

  function updateMemberNav() {
    if (!memberNav || !memberStatus || !householdMembersContainer) return;
    const cards = householdMembersContainer.querySelectorAll('.member-card');
    const total = cards.length;

    if (!total) {
      memberNav.classList.add('hidden');
      memberStatus.textContent = '';
      return;
    }

    memberNav.classList.toggle('hidden', total <= 1);
    memberStatus.textContent = `${currentMemberIndex + 1} / ${total}`;

    if (prevMemberBtn) prevMemberBtn.disabled = currentMemberIndex === 0;
    if (nextMemberBtn) nextMemberBtn.disabled = currentMemberIndex === total - 1;
  }

  function setActiveMember(index) {
    if (!householdMembersContainer || !memberTabs) return;
    const cards = householdMembersContainer.querySelectorAll('.member-card');
    const tabs = memberTabs.querySelectorAll('.member-tab');
    const total = cards.length;
    if (!total) return;

    if (index < 0) index = 0;
    if (index > total - 1) index = total - 1;
    currentMemberIndex = index;

    cards.forEach((card, i) => {
      card.classList.toggle('active', i === currentMemberIndex);
    });
    tabs.forEach((tab, i) => {
      tab.classList.toggle('member-tab-active', i === currentMemberIndex);
    });

    updateMemberNav();
  }

  function renderHouseholdMembers() {
    if (!householdMembersContainer || !householdCountInput) return;

    let count = parseInt(householdCountInput.value, 10);
    if (isNaN(count) || count < 0) count = 0;
    if (count > 10) count = 10;
    householdCountInput.value = count;

    currentMemberIndex = 0;

    householdMembersContainer.innerHTML = '';
    if (memberTabs) memberTabs.innerHTML = '';

    if (membersWrapper) {
      membersWrapper.classList.toggle('hidden', count === 0);
    }

    if (count === 0) {
      updateMemberNav();
      return;
    }

    for (let i = 1; i <= count; i++) {
      const idx = i - 1;

      // Tab trên
      if (memberTabs) {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'member-tab';
        tab.dataset.index = String(idx);
        tab.textContent = `Thành viên ${i}`;
        memberTabs.appendChild(tab);
      }

      // Card nội dung
      const member = document.createElement('div');
      member.className = 'member-card';
      member.dataset.index = String(idx);

      member.innerHTML = `
        <div class="member-card-header">
          <div class="member-title">Thành viên ${i}</div>
        </div>
        <div class="member-body">
          <div class="grid">
            <div class="form-group">
              <label>Họ và tên <span class="required">*</span></label>
              <input type="text" name="memberFullName[]" />
            </div>
            <div class="form-group">
              <label>Ngày sinh <span class="required">*</span></label>
              <input type="date" name="memberDob[]" />
            </div>
            <div class="form-group">
              <label>Giới tính</label>
              <select name="memberGender[]">
                <option value="">-- Chọn --</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="memberPhone[]" placeholder="VD: 09xxxxxxxx" />
            </div>
            <div class="form-group">
              <label>Số CCCD/CMND <span class="required">*</span></label>
              <input type="text" name="memberIdNumber[]" />
            </div>
            <div class="form-group">
              <label>Ngày cấp</label>
              <input type="date" name="memberIdIssueDate[]" />
            </div>
            <div class="form-group">
              <label>Nơi cấp</label>
              <input type="text" name="memberIdIssuePlace[]" placeholder="VD: Cục CSQLHC về TTXH" />
            </div>
            <div class="form-group">
              <label>Quốc tịch</label>
              <input type="text" name="memberNationality[]" placeholder="VD: Việt Nam" />
            </div>
            <div class="form-group">
              <label>Dân tộc</label>
              <input type="text" name="memberEthnicity[]" placeholder="VD: Kinh" />
            </div>
            <div class="form-group">
              <label>Nơi sinh</label>
              <input type="text" name="memberBirthPlace[]" placeholder="VD: Hà Đông, Hà Nội" />
            </div>
            <div class="form-group full-width">
              <label>Nguyên quán</label>
              <input type="text" name="memberOrigin[]" placeholder="VD: La Khê, Hà Đông, Hà Nội" />
            </div>
            <div class="form-group">
              <label>Quan hệ với chủ hộ</label>
              <input type="text" name="memberRelation[]" placeholder="VD: Vợ, con,…" />
            </div>
          </div>
        </div>
      `;

      householdMembersContainer.appendChild(member);
    }

    setActiveMember(0);
  }

  if (generateMembersBtn) {
    generateMembersBtn.addEventListener('click', renderHouseholdMembers);
  }

  if (memberTabs) {
    memberTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.member-tab');
      if (!btn) return;
      const idx = parseInt(btn.dataset.index || '0', 10);
      if (!Number.isNaN(idx)) {
        setActiveMember(idx);
      }
    });
  }

  if (prevMemberBtn) {
    prevMemberBtn.addEventListener('click', () => {
      setActiveMember(currentMemberIndex - 1);
    });
  }

  if (nextMemberBtn) {
    nextMemberBtn.addEventListener('click', () => {
      setActiveMember(currentMemberIndex + 1);
    });
  }

  if (householdMembersContainer) {
    // Live validate: gõ vào trường bắt buộc thì xoá lỗi
    householdMembersContainer.addEventListener('input', (e) => {
      const target = e.target;
      if (
        target.matches('input[name="memberFullName[]"]') ||
        target.matches('input[name="memberDob[]"]') ||
        target.matches('input[name="memberIdNumber[]"]')
      ) {
        if (target.value.trim()) {
          setFieldError(target, '');
        }
      }
    });
  }

  // ====== VALIDATE NGƯỜI ĐĂNG KÝ CHÍNH ======

  function validateFullName() {
    const el = document.getElementById('fullName');
    if (!el) return { valid: true };
    const value = el.value.trim();
    let message = '';
    let valid = true;

    if (!value) {
      message = 'Vui lòng nhập Họ và tên.';
      valid = false;
    } else if (value.length < 3) {
      message = 'Họ và tên phải có ít nhất 3 ký tự.';
      valid = false;
    }

    setFieldError(el, message);
    return { valid, field: el, step: 1 };
  }

  function validateDob() {
    const el = document.getElementById('dob');
    if (!el) return { valid: true };
    let message = '';
    let valid = true;

    if (!el.value) {
      message = 'Vui lòng chọn Ngày sinh.';
      valid = false;
    }

    setFieldError(el, message);
    return { valid, field: el, step: 1 };
  }

  function validateIdNumber() {
    const el = document.getElementById('idNumber');
    if (!el) return { valid: true };
    const value = el.value.trim();
    let message = '';
    let valid = true;

    if (!value) {
      message = 'Vui lòng nhập Số CCCD/CMND.';
      valid = false;
    } else if (!/^[0-9]{9,12}$/.test(value)) {
      message = 'Số CCCD/CMND chỉ gồm 9-12 chữ số.';
      valid = false;
    }

    setFieldError(el, message);
    return { valid, field: el, step: 1 };
  }

  function validateTamTruDates() {
    const fromEl = document.getElementById('tamTruFrom');
    const toEl = document.getElementById('tamTruTo');
    const type = getRequestType();

    if (type !== 'tam_tru' || !fromEl || !toEl) return { valid: true };

    const fromVal = fromEl.value;
    const toVal = toEl.value;
    let messageFrom = '';
    let messageTo = '';
    let valid = true;

    if (fromVal && toVal) {
      const fromDate = new Date(fromVal);
      const toDate = new Date(toVal);
      if (fromDate > toDate) {
        messageFrom = 'Ngày bắt đầu không được sau ngày kết thúc.';
        messageTo = 'Ngày kết thúc không được trước ngày bắt đầu.';
        valid = false;
      }
    }

    setFieldError(fromEl, messageFrom);
    setFieldError(toEl, messageTo);

    return { valid, field: fromEl, step: 2 };
  }

  function validateThuongTruAddress() {
    const type = getRequestType();
    if (type !== 'thuong_tru') return { valid: true };

    const el = document.getElementById('thuongTruAddress');
    if (!el) return { valid: true };

    const value = el.value.trim();
    let message = '';
    let valid = true;

    if (!value) {
      message = 'Vui lòng nhập Địa chỉ thường trú.';
      valid = false;
    }

    setFieldError(el, message);
    return { valid, field: el, step: 2 };
  }

  function validateAgreement() {
    const el = document.getElementById('agreement');
    if (!el) return { valid: true };

    let message = '';
    let valid = true;

    if (!el.checked) {
      message = 'Vui lòng tích vào ô cam kết trước khi gửi.';
      valid = false;
    }

    setFieldError(el, message);
    return { valid, field: el, step: 3 };
  }

  function validateMembers() {
    const cards = document.querySelectorAll('#householdMembers .member-card');
    if (!cards.length) {
      // Không thêm thành viên nào thì bỏ qua
      return { valid: true };
    }

    let valid = true;
    let firstField = null;

    cards.forEach((card) => {
      const fullNameInput = card.querySelector('input[name="memberFullName[]"]');
      const dobInput = card.querySelector('input[name="memberDob[]"]');
      const idInput = card.querySelector('input[name="memberIdNumber[]"]');

      if (fullNameInput) {
        const v = fullNameInput.value.trim();
        let msg = '';
        if (!v) {
          msg = 'Vui lòng nhập Họ và tên của thành viên.';
          valid = false;
          if (!firstField) firstField = fullNameInput;
        } else if (v.length < 3) {
          msg = 'Họ và tên thành viên phải có ít nhất 3 ký tự.';
          valid = false;
          if (!firstField) firstField = fullNameInput;
        }
        setFieldError(fullNameInput, msg);
      }

      if (dobInput) {
        const v = dobInput.value;
        let msg = '';
        if (!v) {
          msg = 'Vui lòng chọn Ngày sinh của thành viên.';
          valid = false;
          if (!firstField) firstField = dobInput;
        }
        setFieldError(dobInput, msg);
      }

      if (idInput) {
        const v = idInput.value.trim();
        let msg = '';
        if (!v) {
          msg = 'Vui lòng nhập Số CCCD/CMND của thành viên.';
          valid = false;
          if (!firstField) firstField = idInput;
        } else if (!/^[0-9]{9,12}$/.test(v)) {
          msg = 'Số CCCD/CMND của thành viên chỉ gồm 9-12 chữ số.';
          valid = false;
          if (!firstField) firstField = idInput;
        }
        setFieldError(idInput, msg);
      }
    });

    return { valid, field: firstField, step: 1 };
  }

  // ====== GÁN SỰ KIỆN LIVE VALIDATE ======
  const fullNameEl = document.getElementById('fullName');
  const dobEl = document.getElementById('dob');
  const idNumberEl = document.getElementById('idNumber');
  const tamTruFromEl = document.getElementById('tamTruFrom');
  const tamTruToEl = document.getElementById('tamTruTo');
  const thuongTruAddressEl = document.getElementById('thuongTruAddress');
  const agreementEl = document.getElementById('agreement');

  if (fullNameEl) {
    fullNameEl.addEventListener('blur', validateFullName);
    fullNameEl.addEventListener('input', validateFullName);
  }
  if (dobEl) {
    dobEl.addEventListener('change', validateDob);
  }
  if (idNumberEl) {
    idNumberEl.addEventListener('blur', validateIdNumber);
    idNumberEl.addEventListener('input', validateIdNumber);
  }
  if (tamTruFromEl || tamTruToEl) {
    const handler = () => validateTamTruDates();
    if (tamTruFromEl) tamTruFromEl.addEventListener('change', handler);
    if (tamTruToEl) tamTruToEl.addEventListener('change', handler);
  }
  if (thuongTruAddressEl) {
    thuongTruAddressEl.addEventListener('blur', validateThuongTruAddress);
    thuongTruAddressEl.addEventListener('input', validateThuongTruAddress);
  }
  if (agreementEl) {
    agreementEl.addEventListener('change', validateAgreement);
  }

  // ====== SUBMIT FORM ======

  function validateAll() {
    const validators = [
      validateFullName,
      validateDob,
      validateIdNumber,
      validateTamTruDates,
      validateThuongTruAddress,
      validateAgreement,
      validateMembers
    ];

    const errors = [];

    validators.forEach((fn) => {
      const res = fn();
      if (res && res.valid === false) {
        errors.push(res);
      }
    });

    if (errors.length > 0) {
      const first = errors[0];
      if (first.step) {
        goToStep(first.step);
      }
      if (first.field && typeof first.field.focus === 'function') {
        first.field.focus();
      }
      return false;
    }

    return true;
  }

  function handleSubmit() {
    if (!validateAll()) return;

    if (resultBox) {
      const type = getRequestType();
      let typeText = 'tạm trú';
      if (type === 'thuong_tru') typeText = 'thường trú';

      resultBox.classList.remove('hidden');
      resultBox.textContent = `Yêu cầu đăng ký ${typeText} của bạn đã được ghi nhận. Ban Quản lý sẽ xem xét và phản hồi trong thời gian sớm nhất.`;
    }
  }

  const submitBtnClick = document.getElementById('submitBtn');
  if (submitBtnClick) {
    submitBtnClick.addEventListener('click', (e) => {
      e.preventDefault();
      handleSubmit();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit();
    });
  }
});
