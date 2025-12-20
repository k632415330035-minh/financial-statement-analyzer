window.initPermRegFormLogic = function () {
  const form = document.getElementById("permForm");
  if (!form) return;

  const permTypeRadios = form.querySelectorAll('input[name="permType"]');
  const tempTimeRow = document.getElementById("tempTimeRow");
  const tempFromInput = document.getElementById("tempFrom");
  const tempToInput = document.getElementById("tempTo");

  // Giới hạn ngày sinh
  const ngaySinhInput = form.querySelector('input[name="ngay_sinh"]');
  if (ngaySinhInput) {
    ngaySinhInput.max = new Date().toISOString().split("T")[0];
  }

  // Lấy trạng thái hộ khẩu từ localStorage
  const currentStatus = localStorage.getItem("currentResidentStatus");
  const radioPerm = form.querySelector('input[value="PERM"]');
  const radioTemp = form.querySelector('input[value="TEMP"]');

  // Khóa radio theo trạng thái hộ
  if (currentStatus === "Tạm trú") {
    radioTemp.checked = true;
    radioPerm.disabled = true;
  } else if (currentStatus === "Thường trú") {
    radioPerm.checked = true;
    radioTemp.disabled = true;
  }

  // Lấy “Đến ngày” tạm trú từ API, parse UTC -> local VN
  async function loadTempExpiryForHousehold() {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const res = await fetch("/api/register/temp-expiry", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;
      const data = await res.json();
      if (data.temp_expiry) {
        const d = new Date(data.temp_expiry); // parse UTC
        // Lấy ngày theo local timezone VN
        const day =
          d.getFullYear() +
          "-" +
          String(d.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(d.getDate()).padStart(2, "0");
        tempToInput.value = day;
        tempToInput.readOnly = true;
      }
    } catch (err) {
      console.error("Lỗi load temp expiry:", err);
    }
  }

  function updateTempTimeVisibility() {
    const isTemp = [...permTypeRadios].some(
      (r) => r.checked && r.value === "TEMP"
    );

    if (isTemp) {
      tempTimeRow.style.display = "flex";
      tempFromInput.required = true;

      tempToInput.required = false;
      tempToInput.readOnly = true;

      loadTempExpiryForHousehold();
    } else {
      tempTimeRow.style.display = "none";
      tempFromInput.value = "";
      tempToInput.value = "";
      tempFromInput.required = false;
      tempToInput.readOnly = false;
    }
  }

  // Cập nhật hiển thị ban đầu
  updateTempTimeVisibility();

  // Lắng nghe thay đổi radio
  permTypeRadios.forEach((r) =>
    r.addEventListener("change", updateTempTimeVisibility)
  );

  // Submit form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Xác định loại đăng ký
    let loaiDangKy = "Thường trú";
    permTypeRadios.forEach((r) => {
      if (r.checked && r.value === "TEMP") loaiDangKy = "Tạm trú";
    });

    // Lấy trực tiếp giá trị từ input (YYYY-MM-DD), không parse Date
    const beginDate = tempFromInput.value || null;
    const endDate = tempToInput.value || null;

    // Tạo payload đầy đủ
    const payload = {
      ho_ten: formData.get("ho_ten") || null,
      bi_danh: formData.get("bi_danh") || null,
      gioi_tinh: formData.get("gioi_tinh") || null,
      ngay_sinh: formData.get("ngay_sinh") || null,
      noi_sinh: formData.get("noi_sinh") || null,
      nguyen_quan: formData.get("nguyen_quan") || null,
      dan_toc: formData.get("dan_toc") || null,
      nghe_nghiep: formData.get("nghe_nghiep") || null,
      noi_lam_viec: formData.get("noi_lam_viec") || null,
      quan_he_voi_chu_ho: formData.get("quan_he_voi_chu_ho") || null,
      thuong_tru_truoc_day:
        formData.get("thuong_tru_truoc_khi_chuyen_den") || null,
      loai_dang_ky: loaiDangKy,
      begin_date: loaiDangKy === "Tạm trú" ? beginDate : null,
      end_date: loaiDangKy === "Tạm trú" ? endDate : null,
    };

    try {
      const token = localStorage.getItem("userToken");
      if (!token) return alert("Bạn chưa đăng nhập.");

      const res = await fetch("/api/register/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(data.message || "Đăng ký thành công");
      form.reset();

      // Giữ nguyên loại đăng ký sau reset
      if (currentStatus === "Tạm trú") radioTemp.checked = true;
      if (currentStatus === "Thường trú") radioPerm.checked = true;
      updateTempTimeVisibility();
    } catch (err) {
      alert(err.message);
    }
  });

  // Nút reset chỉ xóa thông tin, giữ nguyên loại đăng ký cố định
  const resetBtn = form.querySelector('button[type="reset"]');
  resetBtn?.addEventListener("click", () => {
    setTimeout(() => {
      if (currentStatus === "Tạm trú") radioTemp.checked = true;
      if (currentStatus === "Thường trú") radioPerm.checked = true;
      updateTempTimeVisibility();
    }, 0);
  });
};
