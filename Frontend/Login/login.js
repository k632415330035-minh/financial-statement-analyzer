document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================
  // 1. CẤU HÌNH KẾT NỐI SERVER
  // ==========================================================
  // Server chạy trên port 3000, prefix là /api (theo server.js)
  const API_BASE_URL = "http://localhost:3000/api";

  // ==========================================================
  // 2. KHAI BÁO BIẾN DOM
  // ==========================================================
  const container = document.getElementById("container");

  // Form Đăng Ký
  const formRegister = document.getElementById("form-register");
  const cccdRegister = document.getElementById("cccd-register");
  const passRegister = document.getElementById("register-password");
  const btnRegisterSwitch = document.getElementById("register"); // Nút chuyển tab

  // Form Đăng Nhập
  const formLogin = document.getElementById("form-login");
  const cccdLogin = document.getElementById("cccd-login");
  const passLogin = document.getElementById("login-password");
  const btnLoginSwitch = document.getElementById("login"); // Nút chuyển tab

  // ==========================================================
  // 3. CÁC HÀM XỬ LÝ UI & VALIDATION
  // ==========================================================

  // Hiển thị lỗi ngay dưới input
  function setError(input, message) {
    const field = input.closest(".field");
    const errorEl = field?.querySelector(".error");
    if (errorEl) errorEl.textContent = message || "";

    field?.classList.toggle("is-invalid", !!message);
    input.setAttribute("aria-invalid", !!message);
  }

  // Xóa sạch lỗi khi chuyển tab hoặc đăng ký thành công
  function clearErrors() {
    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
    document
      .querySelectorAll(".field")
      .forEach((el) => el.classList.remove("is-invalid"));
    document
      .querySelectorAll("[aria-invalid]")
      .forEach((el) => el.removeAttribute("aria-invalid"));
  }

  // Validate CCCD: Phải là 12 chữ số
  function validateCCCD(input) {
    if (!input) return false;
    const val = input.value.trim();
    // Kiểm tra: không rỗng và đúng format 12 số
    const ok = val.length > 0 && /^\d{12}$/.test(val);
    setError(input, ok ? "" : "CCCD phải đủ 12 chữ số.");
    return ok;
  }

  // Validate Mật khẩu: Tối thiểu 6 ký tự
  function validatePassword(input) {
    if (!input) return false;
    const val = input.value.trim();
    const ok = val.length >= 6;
    setError(input, ok ? "" : "Mật khẩu tối thiểu 6 ký tự.");
    return ok;
  }

  // ==========================================================
  // 4. GẮN SỰ KIỆN UI (CHUYỂN TAB, ẨN/HIỆN PASS)
  // ==========================================================

  // Chuyển qua lại giữa Login / Register
  if (btnRegisterSwitch) {
    btnRegisterSwitch.addEventListener("click", () => {
      container.classList.add("active");
      clearErrors();
      formRegister.reset();
    });
  }

  if (btnLoginSwitch) {
    btnLoginSwitch.addEventListener("click", () => {
      container.classList.remove("active");
      clearErrors();
      formLogin.reset();
    });
  }

  // Validate "live" khi người dùng nhập liệu
  [cccdRegister, cccdLogin].forEach((el) => {
    if (el) {
      el.addEventListener("input", () => validateCCCD(el));
      el.addEventListener("blur", () => validateCCCD(el));
    }
  });

  [passRegister, passLogin].forEach((el) => {
    if (el) {
      el.addEventListener("input", () => validatePassword(el));
      el.addEventListener("blur", () => validatePassword(el));
    }
  });

  // Nút con mắt (Ẩn/Hiện password)
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPwd = input.type === "password";
      input.type = isPwd ? "text" : "password";
      btn.textContent = isPwd ? "🙈" : "👁";
    });
  });

  // ==========================================================
  // 5. LOGIC GỌI API (FETCH)
  // ==========================================================

  // --- A. XỬ LÝ ĐĂNG KÝ ---
  if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault();

      // 1. Kiểm tra hợp lệ phía Client trước
      const isCCCDValid = validateCCCD(cccdRegister);
      const isPassValid = validatePassword(passRegister);
      if (!isCCCDValid || !isPassValid) return;

      // 2. Chuẩn bị dữ liệu
      const payload = {
        UserID: cccdRegister.value.trim(),
        Password: passRegister.value.trim(),
      };

      // 3. Gửi lên Server
      try {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
          container.classList.remove("active"); // Chuyển về tab đăng nhập
          formRegister.reset();
          clearErrors();
        } else {
          // Hiển thị lỗi từ backend (ví dụ: CCCD đã tồn tại)
          alert(`Lỗi đăng ký: ${data.message || "Có lỗi xảy ra."}`);
        }
      } catch (error) {
        console.error("Register Error:", error);
        alert("Không thể kết nối đến máy chủ.");
      }
    });
  }

  // --- B. XỬ LÝ ĐĂNG NHẬP ---
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();

      // 1. Validate
      const isCCCDValid = validateCCCD(cccdLogin);
      const isPassValid = validatePassword(passLogin);
      if (!isCCCDValid || !isPassValid) return;

      // 2. Chuẩn bị dữ liệu
      const payload = {
        UserID: cccdLogin.value.trim(),
        Password: passLogin.value.trim(),
      };

      // 3. Gửi lên Server
      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        let data = {};
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          }
        } catch (e) {
          // Lỗi này xảy ra nếu Server gửi status lỗi nhưng body rỗng hoặc không phải JSON
          console.warn("Không thể phân tích phản hồi JSON:", e.message);
        }

        if (response.ok) {
          // 4. Đăng nhập thành công (Status 200-299)
          localStorage.setItem("userToken", data.token);
          localStorage.setItem("userRole", data.role);
          window.location.replace("../index.html");
        } else {
          // 5. Lỗi từ Server (4xx, 5xx)
          // Nếu có data.message, dùng nó. Nếu không có (do lỗi JSON parse ở trên), dùng thông báo mặc định.
          alert(
            `Đăng nhập thất bại: ${data.message || "Sai tài khoản hoặc mật khẩu."
            }`
          );
        }
      } catch (error) {
        // Đây chỉ nên là lỗi MẠNG (ví dụ: localhost:3000 không chạy)
        console.error("Login Network/Unexpected Error:", error);
        alert("Lỗi kết nối đến máy chủ.");
      }
    });
  }
});