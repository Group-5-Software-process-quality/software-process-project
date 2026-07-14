// ==========================================
// EventSphere Customer - Hồ sơ cá nhân
// profile.js (dùng API thật)
// ==========================================

// Elements

const cartBadge = document.getElementById("cartBadge");
const userAvatar = document.getElementById("userAvatar");
const userNameShort = document.getElementById("userNameShort");

const tabInfoBtn = document.getElementById("tabInfoBtn");
const tabPasswordBtn = document.getElementById("tabPasswordBtn");
const tabInfo = document.getElementById("tabInfo");
const tabPassword = document.getElementById("tabPassword");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

// Yêu cầu đăng nhập

if (!isCustomerLoggedIn()) {
  window.location.href = "/login.html";
}

// Nav + form: đổ dữ liệu người dùng hiện tại

async function loadProfile() {
  const lastName = getCustomerName().split(" ").slice(-1)[0];
  userAvatar.innerHTML = lastName[0];
  userNameShort.innerHTML = lastName;

  try {
    const profile = await API.GET("/profile");
    fullNameInput.value = profile.fullName || "";
    emailInput.value = profile.email || "";
    phoneInput.value = profile.phone || "";
  } catch (e) {
    showToast("Không thể tải thông tin hồ sơ", "error");
  }

  try {
    const cart = await API.GET("/cart");
    cartBadge.innerHTML = cart.length;
    cartBadge.style.display = cart.length > 0 ? "inline-block" : "none";
  } catch (e) {
    cartBadge.style.display = "none";
  }
}

// Chuyển tab

tabInfoBtn.addEventListener("click", () => {
  tabInfoBtn.classList.add("active");
  tabPasswordBtn.classList.remove("active");
  tabInfo.style.display = "block";
  tabPassword.style.display = "none";
});

tabPasswordBtn.addEventListener("click", () => {
  tabPasswordBtn.classList.add("active");
  tabInfoBtn.classList.remove("active");
  tabPassword.style.display = "block";
  tabInfo.style.display = "none";
});

// Lưu thông tin

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const updated = await API.PUT("/profile", {
      fullName: fullNameInput.value.trim(),
      phone: phoneInput.value.trim(),
    });

    localStorage.setItem("accountName", updated.fullName);
    userNameShort.innerHTML = updated.fullName.split(" ").slice(-1)[0];

    showToast("Đã lưu thông tin");
  } catch (e) {
    showToast(e.message || "Không thể lưu thông tin", "error");
  }
});

// Đổi mật khẩu

document.getElementById("passwordForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    await API.PUT("/profile/password", {
      currentPassword: document.getElementById("currentPassword").value,
      newPassword: document.getElementById("newPassword").value,
    });

    showToast("Đổi mật khẩu thành công");
    e.target.reset();
  } catch (e) {
    showToast(e.message || "Đổi mật khẩu thất bại", "error");
  }
});

// Đăng xuất

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await API.POST("/auth/logout");
  } catch (e) {
    // bỏ qua lỗi, vẫn đăng xuất phía client
  }
  customerLogout();
});

// First load

loadProfile();
