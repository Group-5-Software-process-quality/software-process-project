// ==========================================
// EventSphere Organizer - Chỉnh sửa sự kiện
// event-edit.js
// ==========================================

// Lấy id sự kiện từ URL (nếu có)

const params = new URLSearchParams(window.location.search);
const eventId = Number(params.get("id")) || null;

let currentEvent = null;

if (eventId) {
  ORG_EVENTS.forEach((ev) => {
    if (ev.id === eventId) currentEvent = ev;
  });
}

// Elements

const sidebarName = document.getElementById("sidebarName");
const sidebarOrg = document.getElementById("sidebarOrg");
const pageTitle = document.getElementById("pageTitle");

const tabInfoBtn = document.getElementById("tabInfoBtn");
const tabTicketsBtn = document.getElementById("tabTicketsBtn");
const tabInfo = document.getElementById("tabInfo");
const tabTickets = document.getElementById("tabTickets");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const locationInput = document.getElementById("locationName");
const startTimeInput = document.getElementById("startTime");
const capacityInput = document.getElementById("capacity");
const infoError = document.getElementById("infoError");
const saveInfoBtn = document.getElementById("saveInfoBtn");

const emptyTicketTypesBox = document.getElementById("emptyTicketTypesBox");
const ticketTypesTable = document.getElementById("ticketTypesTable");
const ticketTypesBody = document.getElementById("ticketTypesBody");

// Sidebar

sidebarName.innerHTML = ORG_USER.name;
sidebarOrg.innerHTML = ORG_USER.organization;

document.getElementById("logoutBtn").addEventListener("click", () => {
  showToast("Đã đăng xuất (demo giao diện)");
});

// Thiết lập trang theo chế độ tạo mới / chỉnh sửa

if (currentEvent) {
  pageTitle.innerHTML = "Chỉnh sửa sự kiện";
  saveInfoBtn.innerHTML = "Lưu thay đổi";
  tabTicketsBtn.classList.remove("disabled");

  titleInput.value = currentEvent.title;
  descriptionInput.value = currentEvent.description || "";
  locationInput.value = currentEvent.location || "";
  startTimeInput.value = toLocalInput(currentEvent.startTime);
  capacityInput.value = currentEvent.capacity;
} else {
  pageTitle.innerHTML = "Tạo sự kiện mới";
}

function toLocalInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
}

// Chuyển tab

tabInfoBtn.addEventListener("click", () => {
  tabInfoBtn.classList.add("active");
  tabTicketsBtn.classList.remove("active");
  tabInfo.style.display = "block";
  tabTickets.style.display = "none";
});

tabTicketsBtn.addEventListener("click", () => {
  if (!currentEvent) {
    showToast("Vui lòng lưu thông tin sự kiện trước", "error");
    return;
  }

  tabTicketsBtn.classList.add("active");
  tabInfoBtn.classList.remove("active");
  tabTickets.style.display = "block";
  tabInfo.style.display = "none";

  renderTicketTypes();
});

// Lưu thông tin sự kiện

document.getElementById("infoForm").addEventListener("submit", (e) => {
  e.preventDefault();

  if (!titleInput.value.trim() || !startTimeInput.value) {
    infoError.innerHTML = '<div class="form-error-box">Vui lòng nhập đầy đủ tên sự kiện và thời gian bắt đầu.</div>';
    return;
  }

  infoError.innerHTML = "";

  // TODO: nối API thật (POST /events hoặc PUT /events/{id})
  if (currentEvent) {
    currentEvent.title = titleInput.value.trim();
    currentEvent.description = descriptionInput.value.trim();
    currentEvent.location = locationInput.value.trim();
    currentEvent.startTime = startTimeInput.value;
    currentEvent.capacity = Number(capacityInput.value);

    showToast("Đã lưu thông tin sự kiện");
  } else {
    let maxId = 0;

    ORG_EVENTS.forEach((ev) => {
      if (ev.id > maxId) maxId = ev.id;
    });

    const newEvent = {
      id: maxId + 1,
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      location: locationInput.value.trim(),
      startTime: startTimeInput.value,
      capacity: Number(capacityInput.value),
      status: "draft",
      ticketsSold: 0,
      revenue: 0,
      ticketTypes: [],
    };

    ORG_EVENTS.push(newEvent);

    showToast("Đã tạo sự kiện. Tiếp tục thiết lập loại vé!");
    window.location.href = "event-edit.html?id=" + newEvent.id;
  }
});

// Vẽ bảng loại vé

function renderTicketTypes() {
  const ticketTypes = currentEvent.ticketTypes;

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
        <td>${tt.total}</td>
        <td>${tt.sold}</td>
        <td>${tt.sold === 0 ? '<button class="btn btn-danger btn-sm" data-del-tt="' + tt.id + '">Xóa</button>' : ""}</td>
      </tr>
    `;
  });

  document.querySelectorAll("[data-del-tt]").forEach((btn) => {
    btn.addEventListener("click", () => deleteTicketType(btn.dataset.delTt));
  });
}

// Thêm loại vé

document.getElementById("ticketTypeForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // TODO: nối API thật (POST /events/{id}/ticket-types)
  currentEvent.ticketTypes.push({
    id: "t" + Date.now(),
    name: document.getElementById("ttName").value.trim(),
    price: Number(document.getElementById("ttPrice").value),
    total: Number(document.getElementById("ttQty").value),
    sold: 0,
  });

  e.target.reset();

  showToast("Đã thêm loại vé");
  renderTicketTypes();
});

// Xóa loại vé

function deleteTicketType(id) {
  if (!confirm("Xóa loại vé này?")) return;

  let index = -1;

  currentEvent.ticketTypes.forEach((tt, i) => {
    if (tt.id === id) index = i;
  });

  if (index > -1) {
    currentEvent.ticketTypes.splice(index, 1);
  }

  renderTicketTypes();
}
