// ==========================================
// EventSphere Organizer - Tổng quan
// index.js
// ==========================================

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

sidebarName.innerHTML = ORG_USER.name;
sidebarOrg.innerHTML = ORG_USER.organization;

document.getElementById("logoutBtn").addEventListener("click", () => {
  showToast("Đã đăng xuất (demo giao diện)");
});

// Tính số liệu tổng quan

function loadDashboard() {
  let totalRevenue = 0;
  let totalSold = 0;
  let approvedCount = 0;
  let pendingCount = 0;

  ORG_EVENTS.forEach((ev) => {
    totalRevenue += ev.revenue;
    totalSold += ev.ticketsSold;

    if (ev.status === "approved") approvedCount++;
    if (ev.status === "pending") pendingCount++;
  });

  statEventCount.innerHTML = ORG_EVENTS.length;
  statEventSub.innerHTML = approvedCount + " đang hiển thị · " + pendingCount + " chờ duyệt";
  statTicketsSold.innerHTML = totalSold;
  statRevenue.innerHTML = money(totalRevenue);

  renderRecentEvents();
}

// Vẽ bảng sự kiện gần đây

function renderRecentEvents() {
  if (ORG_EVENTS.length === 0) {
    emptyEventsBox.style.display = "block";
    recentEventsTable.style.display = "none";
    return;
  }

  recentEventsBody.innerHTML = "";

  ORG_EVENTS.slice(0, 8).forEach((ev) => {
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
