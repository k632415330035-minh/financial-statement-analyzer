// dang-ky-thuong-tru.js
(function () {
  const form = document.getElementById("permForm");
  if (!form) return;

  const subjectSelect = document.getElementById("permSubject");
  const adultOnlyLabels = form.querySelectorAll("label[data-adult-only]");

  function updateAdultFields() {
    const isChild = subjectSelect.value === "CHILD";

    adultOnlyLabels.forEach((label) => {
      const controls = label.querySelectorAll("input, select, textarea");

      if (isChild) {
        label.classList.add("is-child-only"); // CSS trong resident.css đã hỗ trợ
        controls.forEach((c) => {
          c.disabled = true;
          c.required = false;
        });
      } else {
        label.classList.remove("is-child-only");
        controls.forEach((c) => {
          c.disabled = false;
        });
      }
    });
  }

  // Lần đầu vào trang
  updateAdultFields();

  // Đổi Người lớn / Trẻ em
  subjectSelect.addEventListener("change", updateAdultFields);

  // Submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Sau này chỗ này gọi API; giờ demo show alert thôi
    alert("Đã gửi yêu cầu đăng ký thường trú (demo). Sau này sẽ gửi lên server.");

    form.reset();
    // reset lại trạng thái Người lớn / Trẻ em
    subjectSelect.value = "ADULT";
    updateAdultFields();
  });
})();
