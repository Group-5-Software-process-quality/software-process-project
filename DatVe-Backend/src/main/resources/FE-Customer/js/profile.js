// ==========================================
// EventSphere Customer - Hồ sơ cá nhân
// profile.js
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

// Nav + form: đổ dữ liệu người dùng hiện tại

cartBadge.innerHTML = MOCK_CART.length;
cartBadge.style.display = MOCK_CART.length > 0 ? "inline-block" : "none";

const lastName = MOCK_USER.name.split(" ").slice(-1)[0];
userAvatar.innerHTML = lastName[0];
userNameShort.innerHTML = lastName;

fullNameInput.value = MOCK_USER.name;
emailInput.value = MOCK_USER.email;
phoneInput.value = MOCK_USER.phone;

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

document.getElementById("profileForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // TODO: nối API thật (PUT /users/profile)
  MOCK_USER.name = fullNameInput.value.trim();
  MOCK_USER.phone = phoneInput.value.trim();

  userNameShort.innerHTML = MOCK_USER.name.split(" ").slice(-1)[0];

  showToast("Đã lưu thông tin");
});


// Đổi mật khẩu

document.getElementById("passwordForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // TODO: nối API thật (PUT /users/password)
  showToast("Đổi mật khẩu thành công");

  e.target.reset();
});

// Đăng xuất

document.getElementById("logoutBtn").addEventListener("click", () => {
  showToast("Đã đăng xuất (demo giao diện)");
});
