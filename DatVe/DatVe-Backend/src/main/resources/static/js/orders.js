// =========================================
// EventSphere Admin
// orders.js
// =========================================

protectPage();

const table = document.getElementById("orderTable");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");

let orders = [];
let filteredOrders = [];

let currentPage = 1;
const pageSize = 10;

// ========================
// Logout
// ========================

logoutBtn.onclick = () => {
  if (confirm("Logout ?")) {
    logout();
  }
};

// ========================
// Load Orders
// ========================

async function loadOrders() {
  try {
    orders = await API.GET("/orders");

    filteredOrders = [...orders];

    renderTable();
  } catch (e) {
    console.log(e);

    alert("Cannot connect server.");
  }
}

// ========================
// Render
// ========================

function renderTable() {
  table.innerHTML = "";

  const start = (currentPage - 1) * pageSize;

  const end = start + pageSize;

  filteredOrders.slice(start, end).forEach((order) => {
    table.innerHTML += `

        <tr>

            <td>${order.id}</td>

            <td>${order.user.fullName}</td>

            <td>${order.event.title}</td>

            <td>${order.quantity}</td>

            <td>${money(order.totalAmount)}</td>

            <td>${order.paymentMethod}
            <br>
            <small>${order.paymentStatus}</small>
            </td>

            <td>
            <span class="badge ${statusColor(order.status)}">
            ${order.status}
            </span>
            </td>

            <td>${formatDate(order.createdAt)}</td>

            <td>

    ${
      order.status === "PENDING"
        ? `
        <button class="btn btn-success btn-sm"
            onclick="confirmOrder(${order.id})">
            Confirm
        </button>
    `
        : ""
    }

    <button class="btn btn-info btn-sm"
        onclick="viewOrder(${order.id})">
        View
    </button>

    <button class="btn btn-danger btn-sm"
        onclick="deleteOrder(${order.id})">
        Delete
    </button>

</td>

        </tr>

        `;
  });

  document.getElementById("pageNumber").innerHTML = `Page ${currentPage}`;
}

// ========================
// Search
// ========================

searchInput.onkeyup = filterOrders;

statusFilter.onchange = filterOrders;

function filterOrders() {
  const key = searchInput.value.toLowerCase();

  const status = statusFilter.value;

  filteredOrders = orders.filter((order) => {
    const okName = order.user.fullName.toLowerCase().includes(key);

    const okStatus = status == "" || order.status == status;

    return okName && okStatus;
  });

  currentPage = 1;

  renderTable();
}

// ========================
// Refresh
// ========================

refreshBtn.onclick = loadOrders;

// ========================
// Previous
// ========================

document.getElementById("prevBtn").onclick = () => {
  if (currentPage > 1) {
    currentPage--;

    renderTable();
  }
};

// ========================
// Next
// ========================

document.getElementById("nextBtn").onclick = () => {
  const max = Math.ceil(filteredOrders.length / pageSize);

  if (currentPage < max) {
    currentPage++;

    renderTable();
  }
};

// ========================
// View Detail
// ========================

function viewOrder(id) {
  const order = orders.find((o) => o.id === id);

  if (!order) return;

  alert(
    `Order #${order.id}

Customer : ${order.user.fullName}

Email : ${order.user.email}

Event : ${order.event.title}

Location : ${order.event.location}

Date : ${formatDate(order.event.eventDate)}

Quantity : ${order.quantity}

Total : ${money(order.totalAmount)}

Payment : ${order.paymentMethod}

Status : ${order.status}

Created : ${formatDate(order.createdAt)}`,
  );
}

// ========================
// Delete
// ========================

async function deleteOrder(id) {
  if (!confirm("Delete order ?")) return;

  try {
    await API.DELETE("/orders/" + id);

    alert("Delete Success");

    loadOrders();
  } catch (e) {
    console.log(e);

    alert("Delete Failed");
  }
}

// ========================
// Status Color
// ========================

function statusColor(status) {
  switch (status) {
    case "PAID":
      return "bg-success";

    case "PENDING":
      return "bg-warning";

    case "CANCELLED":
      return "bg-danger";

    default:
      return "bg-secondary";
  }
}

// ========================
// First Load
// ========================

loadOrders();

setInterval(loadOrders, 5000);

// ========================
// Confirm Order
// ========================

async function confirmOrder(id) {
  if (!confirm("Confirm payment?")) return;

  try {
    await API.PUT("/orders/" + id + "/confirm", {});

    alert("Order confirmed");

    loadOrders();
  } catch (e) {
    console.log(e);

    alert("Confirm failed");
  }
}
