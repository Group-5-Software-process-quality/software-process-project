// ==========================================
// EventSphere Customer
// common.js
// ==========================================

// Money Format

function money(value) {
  if (!value) return "Miễn phí";

  return Number(value).toLocaleString("vi-VN") + " đ";
}

// Date Format


function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Toast (thông báo góc màn hình)

function showToast(message, type = "success") {
  let stack = document.querySelector(".toast-stack");

  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }

  const toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.innerHTML = message;

  stack.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}

// Escape HTML (chống lỗi khi chèn text người dùng nhập)

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}
