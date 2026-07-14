// ==========================================
// EventSphere Organizer - Báo cáo doanh thu
// reports.js (dùng API thật)
// ==========================================

protectBtcPage();

const params = new URLSearchParams(window.location.search);
let selectedEventId = Number(params.get("event")) || null;

let reportableEvents = [];

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

sidebarName.innerHTML = getBtcName();
sidebarOrg.innerHTML = getBtcEmail();

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await API.POST("/auth/logout");
  } catch (e) {}
  btcLogout();
});

async function init() {
  let allEvents = [];

  try {
    allEvents = await API.GET("/organizer/events");
  } catch (e) {
    showToast("Không thể tải danh sách sự kiện", "error");
    return;
  }

  reportableEvents = allEvents.filter((ev) => ev.status === "approved" || ev.status === "pending");

  if (reportableEvents.length === 0) {
    noEventsBox.style.display = "block";
    reportsPage.style.display = "none";
    return;
  }

  noEventsBox.style.display = "none";
  reportsPage.style.display = "block";

  const found = reportableEvents.some((ev) => ev.id === selectedEventId);

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

async function loadSummary() {
  let summary;

  try {
    summary = await API.GET("/organizer/reports/" + selectedEventId);
  } catch (e) {
    showToast("Không thể tải báo cáo", "error");
    return;
  }

  statSold.innerHTML = summary.sold + " / " + summary.capacity;
  progressFill.style.width = summary.fillRate + "%";
  statRevenue.innerHTML = money(summary.revenue);
  statFillRate.innerHTML = summary.fillRate + "%";

  renderTicketTypes(summary.ticketTypes);
  renderOrders(summary.recentOrders);
}

// Bảng theo loại vé

function renderTicketTypes(ticketTypes) {
  if (!ticketTypes || ticketTypes.length === 0) {
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
  if (!orders || orders.length === 0) {
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
        <td class="ticket-code">${escapeHtml(o.code || "")}</td>
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
