// ==========================================
// EventSphere Customer - Auth helper
// Dùng chung 1 hệ thống đăng nhập với Admin/BTC (bảng "accounts", role = USER)
// ==========================================

function isCustomerLoggedIn() {
  return (
    localStorage.getItem("authToken") !== null &&
    localStorage.getItem("accountRole") === "USER"
  );
}

function getCustomerName() {
  return localStorage.getItem("accountName") || "Bạn";
}

function customerLogout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("accountRole");
  localStorage.removeItem("accountName");
  localStorage.removeItem("accountEmail");

  window.location.href = "/login.html";
}

// Cập nhật ô "user-pill" trên thanh nav (nếu trang có)
document.addEventListener("DOMContentLoaded", () => {
  const nameEl = document.getElementById("userNameShort");
  const avatarEl = document.getElementById("userAvatar");
  const pillEl = document.querySelector(".user-pill");

  if (isCustomerLoggedIn()) {
    const name = getCustomerName();
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.trim().charAt(0).toUpperCase();
  } else if (pillEl) {
    // Chưa đăng nhập -> bấm vào sẽ đưa tới trang đăng nhập chung
    pillEl.setAttribute("href", "/login.html");
    if (nameEl) nameEl.textContent = "Đăng nhập";
  }
});
