const form = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

// Show password

togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";

    togglePassword.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  } else {
    passwordInput.type = "password";

    togglePassword.innerHTML = '<i class="fa-solid fa-eye"></i>';
  }
});

// Remember Email

window.onload = () => {
  const remember = localStorage.getItem("rememberEmail");

  if (remember) {
    emailInput.value = remember;
  }
};

// Login (dùng chung cho Admin / User / BTC)

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();

  const password = passwordInput.value.trim();

  if (email === "") {
    alert("Please enter email");

    return;
  }

  if (password === "") {
    alert("Please enter password");

    return;
  }

  try {
    const result = await API.POST("/auth/login", {
      email,
      password,
    });

    if (result.success) {
      // Lưu thông tin đăng nhập dùng chung cho toàn hệ thống
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("accountRole", result.role);
      localStorage.setItem("accountName", result.name);
      localStorage.setItem("accountEmail", result.email);
      localStorage.setItem("rememberEmail", email);

      if (result.role === "ADMIN") {
        // Giữ lại các key cũ để không phá vỡ các trang admin hiện có
        localStorage.setItem("adminToken", result.token);
        localStorage.setItem("adminName", result.name);
        localStorage.setItem("adminEmail", result.email);

        window.location.href = "dashboard.html";
      } else if (result.role === "USER") {
        window.location.href = "/customer/index.html";
      } else if (result.role === "BTC") {
        window.location.href = "/btc/index.html";
      } else {
        window.location.href = "dashboard.html";
      }
    } else {
      alert(result.message);
    }
  } catch (e) {
    alert("Login Failed");

    console.log(e);
  }
});
