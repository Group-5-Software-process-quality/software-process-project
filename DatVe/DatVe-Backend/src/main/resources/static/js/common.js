// =========================================
// EventSphere Admin
// common.js
// =========================================

// =========================
// API URL
// =========================

const API_URL = "http://localhost:8080/api";

// =========================
// Get Token
// =========================

function getToken() {
  return localStorage.getItem("adminToken");
}

// =========================
// Request Headers
// =========================

function getHeaders(isJSON = true) {
  const headers = {};

  const token = getToken();

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  if (isJSON) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

// =========================
// Money Format
// =========================

function money(value) {
  if (value == null) return "0 ₫";

  return Number(value).toLocaleString("vi-VN") + " ₫";
}

// =========================
// Date Format
// =========================

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleString("vi-VN");
}

// =========================
// Confirm Delete
// =========================

function confirmDelete(message = "Delete this item?") {
  return confirm(message);
}

// =========================
// Success Alert
// =========================

function success(message) {
  alert(message);
}

// =========================
// Error Alert
// =========================

function error(message) {
  alert(message);
}

// =========================
// Preview Image
// =========================

function previewImage(input, image) {
  if (!input.files || input.files.length === 0) return;

  image.src = URL.createObjectURL(input.files[0]);

  image.style.display = "block";
}

// =========================
// Clear Image Preview
// =========================

function clearPreview(image) {
  image.src = "";

  image.style.display = "none";
}

// =========================
// Loading Button
// =========================

function setButtonLoading(button, text = "Loading...") {
  button.disabled = true;

  button.dataset.oldText = button.innerHTML;

  button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${text}`;
}

// =========================
// Restore Button
// =========================

function resetButton(button) {
  button.disabled = false;

  if (button.dataset.oldText) {
    button.innerHTML = button.dataset.oldText;
  }
}
