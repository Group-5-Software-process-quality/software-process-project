let statusChart = null;
let revenueChart = null;

// ==============================
// Header
// ==============================

document.getElementById("adminName").innerText =
  localStorage.getItem("adminName") || "Administrator";

document.getElementById("today").innerText = new Date().toLocaleDateString(
  "vi-VN",
);

// ==============================
// Statistics
// ==============================

async function loadStatistics() {
  try {
    const orders = await API.GET("/orders");

    console.log("Orders:", orders);

    let revenue = 0;
    let paid = 0;
    let pending = 0;
    let cancelled = 0;

    orders.forEach((order) => {
      if (order.status === "PAID") {
        revenue += Number(order.totalAmount);
        paid++;
      } else if (order.status === "PENDING") {
        pending++;
      } else if (order.status === "CANCELLED") {
        cancelled++;
      }
    });

    document.getElementById("totalRevenue").innerHTML =
      revenue.toLocaleString("vi-VN") + " ₫";

    document.getElementById("totalOrders").innerHTML = orders.length;

    document.getElementById("paidOrders").innerHTML = paid;

    document.getElementById("pendingOrders").innerHTML = pending;

    // ==========================
    // Status Chart
    // ==========================

    if (statusChart != null) {
      statusChart.destroy();
    }

    statusChart = new Chart(document.getElementById("statusChart"), {
      type: "doughnut",

      data: {
        labels: ["Paid", "Pending", "Cancelled"],

        datasets: [
          {
            data: [paid, pending, cancelled],

            backgroundColor: ["#16a34a", "#f59e0b", "#ef4444"],

            borderWidth: 0,

            hoverOffset: 10,
          },
        ],
      },

      options: {
        responsive: true,

        cutout: "65%",

        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });

    // ==========================
    // Revenue Chart
    // ==========================

    if (revenueChart != null) {
      revenueChart.destroy();
    }

    revenueChart = new Chart(document.getElementById("revenueChart"), {
      type: "bar",

      data: {
        labels: orders.map((o) => o.event.title),

        datasets: [
          {
            label: "Revenue",

            data: orders.map((o) => o.totalAmount),

            backgroundColor: "#2563eb",

            borderRadius: 8,
          },
        ],
      },

      options: {
        responsive: true,

        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    alert("Cannot load statistics.");
  }
}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.onclick = () => {
  if (confirm("Logout?")) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");

    window.location.href = "login.html";
  }
};

loadStatistics();
