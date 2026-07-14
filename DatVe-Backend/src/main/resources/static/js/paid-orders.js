// =========================================
// EventSphere Admin
// paid-orders.js
// =========================================

protectPage();

const table = document.getElementById("orderTable");
const emptyBox = document.getElementById("emptyBox");
const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");

let orders = [];
let filteredOrders = [];

let currentPage = 1;
const pageSize = 10;

// =========================
// Logout
// =========================

logoutBtn.onclick = () => {
  if (confirm("Logout ?")) {
    logout();
  }
};

// =========================
// Load
// =========================

async function loadPaidOrders() {
  try {
    orders = await API.GET("/admin/orders/paid");

    filteredOrders = [...orders];

    renderTable();
  } catch (e) {
    console.log(e);

    alert("Cannot connect server.");
  }
}

// =========================
// Render
// =========================

function renderTable() {
  table.innerHTML = "";

  if (filteredOrders.length === 0) {
    emptyBox.style.display = "block";
  } else {
    emptyBox.style.display = "none";
  }

  const start = (currentPage - 1) * pageSize;

  const end = start + pageSize;

  filteredOrders.slice(start, end).forEach((order) => {
    table.innerHTML += `

        <tr>

            <td>${order.orderCode || "-"}</td>

            <td>${order.customerName || "-"}</td>

            <td>${order.customerEmail || "-"}</td>

            <td>${order.eventTitle || "-"}</td>

            <td>${order.quantity}</td>

            <td>${money(order.totalAmount)}</td>

            <td>${order.paymentMethod || "-"}</td>

            <td>${order.qrCode || "-"}</td>

            <td>${formatDate(order.createdAt)}</td>

        </tr>

        `;
  });

  document.getElementById("pageNumber").innerHTML = `Page ${currentPage}`;
}

// =========================
// Search
// =========================

searchInput.onkeyup = () => {
  const key = searchInput.value.toLowerCase();

  filteredOrders = orders.filter(
    (o) =>
      (o.customerName || "").toLowerCase().includes(key) ||
      (o.customerEmail || "").toLowerCase().includes(key) ||
      (o.eventTitle || "").toLowerCase().includes(key) ||
      (o.orderCode || "").toLowerCase().includes(key),
  );

  currentPage = 1;

  renderTable();
};

// =========================
// Refresh
// =========================

refreshBtn.onclick = loadPaidOrders;

// =========================
// Previous / Next
// =========================

document.getElementById("prevBtn").onclick = () => {
  if (currentPage > 1) {
    currentPage--;

    renderTable();
  }
};

document.getElementById("nextBtn").onclick = () => {
  const max = Math.ceil(filteredOrders.length / pageSize);

  if (currentPage < max) {
    currentPage++;

    renderTable();
  }
};

// =========================
// First Load
// =========================

loadPaidOrders();

setInterval(loadPaidOrders, 5000);
