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

// Login

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
    const result = await API.POST("/admin/login", {
      email,
      password,
    });

    if (result.success) {
      localStorage.setItem("adminToken", result.token);

      localStorage.setItem("adminName", result.admin.fullName);

      localStorage.setItem("adminEmail", result.admin.email);

      localStorage.setItem("rememberEmail", email);

      window.location.href = "dashboard.html";
    } else {
      alert(result.message);
    }
  } catch (e) {
    alert("Login Failed");

    console.log(e);
  }
});
