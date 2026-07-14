// ==========================================
// EventSphere Organizer - Tổng quan
// index.js (dùng API thật)
// ==========================================

protectBtcPage();

// =========================
// Elements
// =========================

const sidebarName = document.getElementById("sidebarName");
const sidebarOrg = document.getElementById("sidebarOrg");

const statEventCount = document.getElementById("statEventCount");
const statEventSub = document.getElementById("statEventSub");
const statTicketsSold = document.getElementById("statTicketsSold");
const statRevenue = document.getElementById("statRevenue");

const emptyEventsBox = document.getElementById("emptyEventsBox");
const recentEventsTable = document.getElementById("recentEventsTable");
const recentEventsBody = document.getElementById("recentEventsBody");

// Sidebar

sidebarName.innerHTML = getBtcName();
sidebarOrg.innerHTML = getBtcEmail();

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await API.POST("/auth/logout");
  } catch (e) {}
  btcLogout();
});

// Tải số liệu tổng quan từ server

async function loadDashboard() {
  try {
    const dashboard = await API.GET("/organizer/events/dashboard");

    statEventCount.innerHTML = dashboard.eventCount;
    statEventSub.innerHTML = dashboard.approvedCount + " đang hiển thị · " + dashboard.pendingCount + " chờ duyệt";
    statTicketsSold.innerHTML = dashboard.totalSold;
    statRevenue.innerHTML = money(dashboard.totalRevenue);

    renderRecentEvents(dashboard.recentEvents);
  } catch (e) {
    showToast("Không thể tải dữ liệu tổng quan", "error");
  }
}

// Vẽ bảng sự kiện gần đây

function renderRecentEvents(events) {
  if (!events || events.length === 0) {
    emptyEventsBox.style.display = "block";
    recentEventsTable.style.display = "none";
    return;
  }

  emptyEventsBox.style.display = "none";
  recentEventsTable.style.display = "table";

  recentEventsBody.innerHTML = "";

  events.forEach((ev) => {
    const label = statusLabel(ev.status);

    recentEventsBody.innerHTML += `
      <tr>
        <td><strong>${escapeHtml(ev.title)}</strong></td>
        <td>${formatDate(ev.startTime)}</td>
        <td><span class="badge ${label[1]}">${label[0]}</span></td>
        <td>${ev.ticketsSold}</td>
        <td>${money(ev.revenue)}</td>
        <td><a href="event-edit.html?id=${ev.id}" class="btn btn-ghost btn-sm">Sửa</a></td>
      </tr>
    `;
  });
}

// First load

loadDashboard();
