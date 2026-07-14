const form = document.getElementById("registerForm");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  } else {
    passwordInput.type = "password";
    togglePassword.innerHTML = '<i class="fa-solid fa-eye"></i>';
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();
  const role = document.querySelector('input[name="role"]:checked').value;

  if (!fullName || !email || !password) {
    alert("Vui lòng nhập đầy đủ họ tên, email và mật khẩu");
    return;
  }

  if (password !== confirmPassword) {
    alert("Mật khẩu xác nhận không khớp");
    return;
  }

  try {
    const result = await API.POST("/auth/register", {
      fullName,
      email,
      password,
      role,
    });

    if (result.success) {
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      window.location.href = "login.html";
    } else {
      alert(result.message);
    }
  } catch (err) {
    alert("Đăng ký thất bại");
    console.log(err);
  }
});
