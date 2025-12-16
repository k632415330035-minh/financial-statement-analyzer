// dang-ky-thuong-tru.js
(function () {
  const form = document.getElementById("permForm");
  if (!form) return;

  // Radio loại đăng ký
  const permTypeRadios = form.querySelectorAll('input[name="permType"]');
  const tempTimeRow = document.getElementById("tempTimeRow");
  const tempFromInput = document.getElementById("tempFrom");
  const tempToInput = document.getElementById("tempTo");

  function updateTempTimeVisibility() {
    let isTemp = false;

    permTypeRadios.forEach((radio) => {
      if (radio.checked && radio.value === "TEMP") {
        isTemp = true;
      }
    });

    if (isTemp) {
      // Hiện ô thời gian tạm trú + bắt buộc nhập
      tempTimeRow.style.removeProperty("display");
      if (tempFromInput) tempFromInput.required = true;
      if (tempToInput) tempToInput.required = true;
    } else {
      // Ẩn ô thời gian tạm trú + bỏ required
      tempTimeRow.style.display = "none";
      if (tempFromInput) {
        tempFromInput.required = false;
        tempFromInput.value = "";
      }
      if (tempToInput) {
        tempToInput.required = false;
        tempToInput.value = "";
      }
    }
  }

  // Lần đầu vào trang
  updateTempTimeVisibility();

  // Đổi loại đăng ký: thường trú / tạm trú
  permTypeRadios.forEach((radio) => {
    radio.addEventListener("change", updateTempTimeVisibility);
  });

  // Submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Xác định loại đăng ký đang chọn
    let typeLabel = "thường trú";
    permTypeRadios.forEach((radio) => {
      if (radio.checked && radio.value === "TEMP") {
        typeLabel = "tạm trú";
      }
    });

    alert(
      "Đã gửi yêu cầu đăng ký " +
        typeLabel +
        " cho trẻ em (demo). Sau này sẽ gửi lên server."
    );

    form.reset();
    updateTempTimeVisibility();
  });
})();
