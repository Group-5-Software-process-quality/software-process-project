// ==========================================
// EventSphere Organizer - Mã giảm giá
// discounts.js (dùng API thật)
// ==========================================

protectBtcPage();

let myEvents = [];
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

sidebarName.innerHTML = getBtcName();
sidebarOrg.innerHTML = getBtcEmail();

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await API.POST("/auth/logout");
  } catch (e) {}
  btcLogout();
});

// Khởi tạo trang

async function init() {
  try {
    myEvents = await API.GET("/organizer/events");
  } catch (e) {
    showToast("Không thể tải danh sách sự kiện", "error");
    return;
  }

  if (myEvents.length === 0) {
    noEventsBox.style.display = "block";
    discountsPage.style.display = "none";
    return;
  }

  noEventsBox.style.display = "none";
  discountsPage.style.display = "block";

  eventSelect.innerHTML = "";

  myEvents.forEach((ev) => {
    const option = document.createElement("option");
    option.value = ev.id;
    option.innerHTML = ev.title;
    eventSelect.appendChild(option);
  });

  selectedEventId = myEvents[0].id;

  loadDiscounts();
}

eventSelect.addEventListener("change", () => {
  selectedEventId = Number(eventSelect.value);
  loadDiscounts();
});

// Vẽ bảng mã giảm giá

async function loadDiscounts() {
  let codes = [];

  try {
    codes = await API.GET("/organizer/discounts?eventId=" + selectedEventId);
  } catch (e) {
    showToast("Không thể tải mã giảm giá", "error");
  }

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

document.getElementById("discountForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    await API.POST("/organizer/discounts", {
      eventId: selectedEventId,
      code: document.getElementById("dCode").value.trim().toUpperCase(),
      type: document.getElementById("dType").value,
      value: Number(document.getElementById("dValue").value),
      maxUses: Number(document.getElementById("dMax").value),
    });

    e.target.reset();
    document.getElementById("dMax").value = 100;

    showToast("Đã tạo mã giảm giá");
    loadDiscounts();
  } catch (e) {
    showToast(e.message || "Không thể tạo mã giảm giá", "error");
  }
});

// Bật / tắt mã giảm giá

async function toggleActive(id) {
  try {
    await API.PUT("/organizer/discounts/" + id + "/toggle");
    loadDiscounts();
  } catch (e) {
    showToast(e.message || "Không thể cập nhật mã giảm giá", "error");
  }
}

// First load

init();
