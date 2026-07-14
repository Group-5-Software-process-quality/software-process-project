// ==========================================
// EventSphere BTC - Auth helper
// Dùng chung 1 hệ thống đăng nhập với Admin/Customer (bảng "accounts", role = BTC)
// ==========================================

function isBtcLoggedIn() {
  return (
    localStorage.getItem("authToken") !== null &&
    localStorage.getItem("accountRole") === "BTC"
  );
}

function getBtcName() {
  return localStorage.getItem("accountName") || "BTC";
}

function getBtcEmail() {
  return localStorage.getItem("accountEmail") || "";
}

function protectBtcPage() {
  if (!isBtcLoggedIn()) {
    window.location.href = "/login.html";
  }
}

function btcLogout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("accountRole");
  localStorage.removeItem("accountName");
  localStorage.removeItem("accountEmail");

  window.location.href = "/login.html";
}
