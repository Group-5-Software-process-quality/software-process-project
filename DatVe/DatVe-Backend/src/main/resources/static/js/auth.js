// ==========================================
// Authentication
// auth.js
// ==========================================

function isLogin() {
  return localStorage.getItem("adminToken") !== null;
}

function protectPage() {
  if (!isLogin()) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminName");
  localStorage.removeItem("adminEmail");

  window.location.href = "login.html";
}

function getAdminName() {
  return localStorage.getItem("adminName") || "Administrator";
}

function getAdminEmail() {
  return localStorage.getItem("adminEmail") || "";
}
