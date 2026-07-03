// ==========================================
// EventSphere Admin Dashboard
// ==========================================

let revenueChart = null;

protectPage();

// ==========================
// Elements
// ==========================

const adminName = document.getElementById("adminName");
const today = document.getElementById("today");

const userCount = document.getElementById("userCount");
const eventCount = document.getElementById("eventCount");
const orderCount = document.getElementById("orderCount");
const revenue = document.getElementById("revenue");

const recentOrders = document.getElementById("recentOrders");
const recentUsers = document.getElementById("recentUsers");

const logoutBtn = document.getElementById("logoutBtn");

// ==========================
// Header
// ==========================

adminName.innerHTML = getAdminName() || "Administrator";

today.innerHTML = new Date().toLocaleDateString("vi-VN");

logoutBtn.onclick = () => {
  if (confirm("Logout ?")) {
    logout();
  }
};

// ==========================
// Dashboard
// ==========================

async function loadDashboard() {
  try {
    const users = await API.GET("/users");

    const events = await API.GET("/events");

    const orders = await API.GET("/orders");

    userCount.innerHTML = users.length;

    eventCount.innerHTML = events.length;

    orderCount.innerHTML = orders.length;

    let totalRevenue = 0;

    orders.forEach((order) => {
      if (order.status === "PAID") {
        totalRevenue += order.totalAmount;
      }
    });

    revenue.innerHTML = money(totalRevenue);

    renderRecentUsers(users);

    renderRecentOrders(orders);

    renderChart(orders);
  } catch (e) {
    console.log(e);

    alert("Cannot connect server.");
  }
}

// ==========================
// Recent Users
// ==========================

function renderRecentUsers(users) {
  recentUsers.innerHTML = "";

  users
    .slice(-5)
    .reverse()
    .forEach((user) => {
      recentUsers.innerHTML += `

                <li>

                    <strong>${user.fullName}</strong>

                    <br>

                    <small>ID : ${user.id}</small>

                    <br>

                    <small>${user.email}</small>

                </li>

            `;
    });
}

// ==========================
// Recent Orders
// ==========================

function renderRecentOrders(orders) {
  recentOrders.innerHTML = "";

  orders
    .slice(-5)
    .reverse()
    .forEach((order) => {
      recentOrders.innerHTML += `

                <tr>

                    <td>${order.id}</td>

                    <td>${order.user.fullName}</td>

                    <td>${order.event.title}</td>

                    <td>

                        <span class="badge bg-${statusColor(order.status)}">

                            ${order.status}

                        </span>

                        <br>

                        <small>${money(order.totalAmount)}</small>

                    </td>

                </tr>

            `;
    });
}

// ==========================
// Revenue Chart
// ==========================

function renderChart(orders) {
  const paidOrders = orders.filter((o) => o.status === "PAID");

  const labels = paidOrders.map((o) => "Order " + o.id);

  const data = paidOrders.map((o) => o.totalAmount);

  if (revenueChart) {
    revenueChart.destroy();
  }

  revenueChart = new Chart(
    document.getElementById("revenueChart"),

    {
      type: "bar",

      data: {
        labels: labels,

        datasets: [
          {
            label: "Revenue (VNĐ)",

            data: data,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: true,
          },
        },
      },
    },
  );
}

// ==========================
// Status Color
// ==========================

function statusColor(status) {
  switch (status) {
    case "PAID":
      return "success";

    case "PENDING":
      return "warning";

    case "CANCELLED":
      return "danger";

    default:
      return "secondary";
  }
}

// ==========================
// First Load
// ==========================

loadDashboard();

setInterval(loadDashboard, 5000);
