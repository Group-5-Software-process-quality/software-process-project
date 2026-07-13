// ==========================================
// EventSphere Organizer - Báo cáo doanh thu
// reports.js
// ==========================================

const params = new URLSearchParams(window.location.search);
let selectedEventId = Number(params.get("event")) || null;

const reportableEvents = [];

ORG_EVENTS.forEach((ev) => {
  if (ev.status === "approved" || ev.status === "pending") {
    reportableEvents.push(ev);
  }
});

// Elements


const sidebarName = document.getElementById("sidebarName");
const sidebarOrg = document.getElementById("sidebarOrg");

const noEventsBox = document.getElementById("noEventsBox");
const reportsPage = document.getElementById("reportsPage");
const eventSelect = document.getElementById("eventSelect");

const statSold = document.getElementById("statSold");
const progressFill = document.getElementById("progressFill");
const statRevenue = document.getElementById("statRevenue");
const statFillRate = document.getElementById("statFillRate");

const emptyTicketTypesBox = document.getElementById("emptyTicketTypesBox");
const ticketTypesTable = document.getElementById("ticketTypesTable");
const ticketTypesBody = document.getElementById("ticketTypesBody");

const emptyOrdersBox = document.getElementById("emptyOrdersBox");
const ordersTable = document.getElementById("ordersTable");
const ordersBody = document.getElementById("ordersBody");

// Sidebar

sidebarName.innerHTML = ORG_USER.name;
sidebarOrg.innerHTML = ORG_USER.organization;

document.getElementById("logoutBtn").addEventListener("click", () => {
  showToast("Đã đăng xuất (demo giao diện)");
});


function init() {
  if (reportableEvents.length === 0) {
    noEventsBox.style.display = "block";
    reportsPage.style.display = "none";
    return;
  }

  noEventsBox.style.display = "none";
  reportsPage.style.display = "block";

  let found = false;

  reportableEvents.forEach((ev) => {
    if (ev.id === selectedEventId) found = true;
  });

  if (!selectedEventId || !found) {
    selectedEventId = reportableEvents[0].id;
  }

  eventSelect.innerHTML = "";

  reportableEvents.forEach((ev) => {
    const option = document.createElement("option");
    option.value = ev.id;
    option.innerHTML = ev.title;
    if (ev.id === selectedEventId) option.selected = true;
    eventSelect.appendChild(option);
  });

  loadSummary();
}

eventSelect.addEventListener("change", () => {
  selectedEventId = Number(eventSelect.value);
  loadSummary();
});

document.getElementById("exportAttendeesBtn").addEventListener("click", () => {
  showToast("Xuất CSV cần nối API thật (GET .../attendees.csv)");
});

document.getElementById("exportRevenueBtn").addEventListener("click", () => {
  showToast("Xuất CSV cần nối API thật (GET .../revenue.csv)");
});

// Tính & vẽ số liệu báo cáo

function loadSummary() {
  let event = null;

  ORG_EVENTS.forEach((ev) => {
    if (ev.id === selectedEventId) event = ev;
  });

  const ticketTypes = event.ticketTypes;

  let totalSold = 0;
  let totalCapacity = 0;
  let totalRevenue = 0;

  ticketTypes.forEach((tt) => {
    totalSold += tt.sold;
    totalCapacity += tt.total;
    totalRevenue += tt.sold * tt.price;
  });

  if (totalCapacity === 0) totalCapacity = event.capacity;

  const fillRate = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;

  statSold.innerHTML = totalSold + " / " + totalCapacity;
  progressFill.style.width = fillRate + "%";
  statRevenue.innerHTML = money(totalRevenue);
  statFillRate.innerHTML = fillRate + "%";

  renderTicketTypes(ticketTypes);
  renderOrders(ORG_RECENT_ORDERS[selectedEventId] || []);
}

// Bảng theo loại vé

function renderTicketTypes(ticketTypes) {
  if (ticketTypes.length === 0) {
    emptyTicketTypesBox.style.display = "block";
    ticketTypesTable.style.display = "none";
    return;
  }

  emptyTicketTypesBox.style.display = "none";
  ticketTypesTable.style.display = "table";

  ticketTypesBody.innerHTML = "";

  ticketTypes.forEach((tt) => {
    ticketTypesBody.innerHTML += `
      <tr>
        <td>${escapeHtml(tt.name)}</td>
        <td>${money(tt.price)}</td>
        <td>${tt.sold} / ${tt.total}</td>
        <td>${money(tt.sold * tt.price)}</td>
      </tr>
    `;
  });
}

// Bảng đơn hàng gần đây

function renderOrders(orders) {
  if (orders.length === 0) {
    emptyOrdersBox.style.display = "block";
    ordersTable.style.display = "none";
    return;
  }

  emptyOrdersBox.style.display = "none";
  ordersTable.style.display = "table";

  ordersBody.innerHTML = "";

  orders.forEach((o) => {
    const label = statusLabel(o.status);

    ordersBody.innerHTML += `
      <tr>
        <td class="ticket-code">${o.code}</td>
        <td>${escapeHtml(o.customer)}</td>
        <td>${money(o.amount)}</td>
        <td><span class="badge ${label[1]}">${label[0]}</span></td>
        <td>${formatDate(o.date)}</td>
      </tr>
    `;
  });
}

// First load

init();
