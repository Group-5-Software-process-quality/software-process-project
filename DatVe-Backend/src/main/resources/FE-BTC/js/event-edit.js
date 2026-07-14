// ==========================================
// EventSphere Organizer - Chỉnh sửa sự kiện
// event-edit.js (dùng API thật)
// ==========================================

protectBtcPage();

// Lấy id sự kiện từ URL (nếu có)

const params = new URLSearchParams(window.location.search);
const eventId = Number(params.get("id")) || null;

let currentEvent = null;

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

sidebarName.innerHTML = getBtcName();
sidebarOrg.innerHTML = getBtcEmail();

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await API.POST("/auth/logout");
  } catch (e) {}
  btcLogout();
});

// Thiết lập trang theo chế độ tạo mới / chỉnh sửa

function toLocalInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
}

async function init() {
  if (eventId) {
    try {
      currentEvent = await API.GET("/organizer/events/" + eventId);
    } catch (e) {
      showToast("Không thể tải thông tin sự kiện", "error");
      return;
    }

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

document.getElementById("infoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!titleInput.value.trim() || !startTimeInput.value) {
    infoError.innerHTML = '<div class="form-error-box">Vui lòng nhập đầy đủ tên sự kiện và thời gian bắt đầu.</div>';
    return;
  }

  infoError.innerHTML = "";

  const payload = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    locationName: locationInput.value.trim(),
    startTime: startTimeInput.value,
    capacity: Number(capacityInput.value) || null,
  };

  try {
    if (currentEvent) {
      currentEvent = await API.PUT("/organizer/events/" + currentEvent.id, payload);
      showToast("Đã lưu thông tin sự kiện");
    } else {
      const newEvent = await API.POST("/organizer/events", payload);
      showToast("Đã tạo sự kiện. Tiếp tục thiết lập loại vé!");
      window.location.href = "event-edit.html?id=" + newEvent.id;
    }
  } catch (e) {
    infoError.innerHTML = '<div class="form-error-box">' + escapeHtml(e.message || "Không thể lưu sự kiện") + "</div>";
  }
});

// Vẽ bảng loại vé

function renderTicketTypes() {
  const ticketTypes = currentEvent.ticketTypes || [];

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

document.getElementById("ticketTypeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    await API.POST("/organizer/events/" + currentEvent.id + "/ticket-types", {
      name: document.getElementById("ttName").value.trim(),
      price: Number(document.getElementById("ttPrice").value),
      total: Number(document.getElementById("ttQty").value),
    });

    currentEvent = await API.GET("/organizer/events/" + currentEvent.id);

    e.target.reset();

    showToast("Đã thêm loại vé");
    renderTicketTypes();
  } catch (e) {
    showToast(e.message || "Không thể thêm loại vé", "error");
  }
});

// Xóa loại vé

async function deleteTicketType(id) {
  if (!confirm("Xóa loại vé này?")) return;

  try {
    await API.DELETE("/organizer/events/ticket-types/" + id);
    currentEvent = await API.GET("/organizer/events/" + currentEvent.id);
    renderTicketTypes();
  } catch (e) {
    showToast(e.message || "Không thể xóa loại vé", "error");
  }
}

// First load

init();
