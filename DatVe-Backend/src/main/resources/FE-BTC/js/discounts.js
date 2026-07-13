// ==========================================
// EventSphere Organizer - Mã giảm giá
// discounts.js
// ==========================================

let selectedEventId = null;

// Elements

const sidebarName = document.getElementById("sidebarName");
const sidebarOrg = document.getElementById("sidebarOrg");

const noEventsBox = document.getElementById("noEventsBox");
const discountsPage = document.getElementById("discountsPage");
const eventSelect = document.getElementById("eventSelect");

const emptyDiscountsBox = document.getElementById("emptyDiscountsBox");
const discountsTable = document.getElementById("discountsTable");
const discountsBody = document.getElementById("discountsBody");

// Sidebar

sidebarName.innerHTML = ORG_USER.name;
sidebarOrg.innerHTML = ORG_USER.organization;

document.getElementById("logoutBtn").addEventListener("click", () => {
  showToast("Đã đăng xuất (demo giao diện)");
});

// Khởi tạo trang

function init() {
  if (ORG_EVENTS.length === 0) {
    noEventsBox.style.display = "block";
    discountsPage.style.display = "none";
    return;
  }

  noEventsBox.style.display = "none";
  discountsPage.style.display = "block";

  eventSelect.innerHTML = "";

  ORG_EVENTS.forEach((ev) => {
    const option = document.createElement("option");
    option.value = ev.id;
    option.innerHTML = ev.title;
    eventSelect.appendChild(option);
  });

  selectedEventId = ORG_EVENTS[0].id;

  loadDiscounts();
}

eventSelect.addEventListener("change", () => {
  selectedEventId = Number(eventSelect.value);
  loadDiscounts();
});

// Vẽ bảng mã giảm giá

function loadDiscounts() {
  if (!ORG_DISCOUNTS[selectedEventId]) {
    ORG_DISCOUNTS[selectedEventId] = [];
  }

  const codes = ORG_DISCOUNTS[selectedEventId];

  if (codes.length === 0) {
    emptyDiscountsBox.style.display = "block";
    discountsTable.style.display = "none";
    return;
  }

  emptyDiscountsBox.style.display = "none";
  discountsTable.style.display = "table";

  discountsBody.innerHTML = "";

  codes.forEach((d) => {
    const valueText = d.type === "percent" ? d.value + "%" : money(d.value);
    const statusHtml = d.active
      ? '<span class="badge badge-success">Đang hoạt động</span>'
      : '<span class="badge badge-neutral">Đã tắt</span>';

    discountsBody.innerHTML += `
      <tr>
        <td class="ticket-code">${escapeHtml(d.code)}</td>
        <td>${d.type === "percent" ? "Phần trăm" : "Cố định"}</td>
        <td>${valueText}</td>
        <td>${d.used} / ${d.max}</td>
        <td>${statusHtml}</td>
        <td><button class="btn btn-ghost btn-sm" data-toggle="${d.id}">${d.active ? "Tắt" : "Bật"}</button></td>
      </tr>
    `;
  });

  document.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => toggleActive(btn.dataset.toggle));
  });
}

// Tạo mã giảm giá mới

document.getElementById("discountForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // TODO: nối API thật (POST /discounts)
  ORG_DISCOUNTS[selectedEventId].push({
    id: "d" + Date.now(),
    code: document.getElementById("dCode").value.trim().toUpperCase(),
    type: document.getElementById("dType").value,
    value: Number(document.getElementById("dValue").value),
    used: 0,
    max: Number(document.getElementById("dMax").value),
    active: true,
  });

  e.target.reset();
  document.getElementById("dMax").value = 100;

  showToast("Đã tạo mã giảm giá");
  loadDiscounts();
});

// Bật / tắt mã giảm giá

function toggleActive(id) {
  ORG_DISCOUNTS[selectedEventId].forEach((d) => {
    if (d.id === id) d.active = !d.active;
  });

  loadDiscounts();
}

// First load

init();
