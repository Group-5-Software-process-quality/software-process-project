// ==========================================
// EventSphere Organizer - Sự kiện của tôi
// events.js (dùng API thật)
// ==========================================

protectBtcPage();

// =========================
// Elements
// =========================

const sidebarName = document.getElementById("sidebarName");
const sidebarOrg = document.getElementById("sidebarOrg");

const eventCountLabel = document.getElementById("eventCountLabel");
const emptyEventsBox = document.getElementById("emptyEventsBox");
const eventsTable = document.getElementById("eventsTable");
const eventsBody = document.getElementById("eventsBody");

let myEvents = [];

// Sidebar

sidebarName.innerHTML = getBtcName();
sidebarOrg.innerHTML = getBtcEmail();

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await API.POST("/auth/logout");
  } catch (e) {}
  btcLogout();
});

// Tải danh sách sự kiện từ server

async function loadEvents() {
  try {
    myEvents = await API.GET("/organizer/events");
    renderEvents();
  } catch (e) {
    showToast("Không thể tải danh sách sự kiện", "error");
  }
}

// Vẽ bảng sự kiện

function renderEvents() {
  eventCountLabel.innerHTML = myEvents.length + " sự kiện";

  if (myEvents.length === 0) {
    emptyEventsBox.style.display = "block";
    eventsTable.style.display = "none";
    return;
  }

  emptyEventsBox.style.display = "none";
  eventsTable.style.display = "table";

  eventsBody.innerHTML = "";

  myEvents.forEach((ev) => {
    const label = statusLabel(ev.status);
    const canSubmit = ev.status === "draft" || ev.status === "rejected";
    const canDelete = ev.status !== "approved" || ev.ticketsSold === 0;

    let reasonHtml = "";

    if (ev.status === "rejected" && ev.rejectionReason) {
      reasonHtml = '<div class="error-text">Lý do: ' + escapeHtml(ev.rejectionReason) + "</div>";
    }

    eventsBody.innerHTML += `
      <tr>
        <td>
          <strong>${escapeHtml(ev.title)}</strong>
          ${reasonHtml}
        </td>
        <td>${formatDate(ev.startTime)}</td>
        <td><span class="badge ${label[1]}">${label[0]}</span></td>
        <td>${ev.ticketsSold} vé · ${money(ev.revenue)}</td>
        <td class="event-actions">
          <a href="event-edit.html?id=${ev.id}" class="btn btn-ghost btn-sm">Sửa</a>
          <a href="reports.html?event=${ev.id}" class="btn btn-ghost btn-sm">Báo cáo</a>
          ${canSubmit ? '<button class="btn btn-primary btn-sm" data-submit="' + ev.id + '">Gửi duyệt</button>' : ""}
          ${canDelete ? '<button class="btn btn-danger btn-sm" data-delete="' + ev.id + '">Xóa</button>' : ""}
        </td>
      </tr>
    `;
  });

  document.querySelectorAll("[data-submit]").forEach((btn) => {
    btn.addEventListener("click", () => submitForApproval(Number(btn.dataset.submit)));
  });

  document.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => deleteEvent(Number(btn.dataset.delete)));
  });
}

// Gửi duyệt

async function submitForApproval(id) {
  try {
    await API.POST("/organizer/events/" + id + "/submit");
    showToast("Đã gửi sự kiện cho quản trị viên duyệt");
    loadEvents();
  } catch (e) {
    showToast(e.message || "Không thể gửi duyệt", "error");
  }
}

// Xóa sự kiện

async function deleteEvent(id) {
  const ev = myEvents.find((e) => e.id === id);
  const title = ev ? ev.title : "";

  if (!confirm('Xóa sự kiện "' + title + '"? Hành động này không thể hoàn tác.')) return;

  try {
    await API.DELETE("/organizer/events/" + id);
    showToast("Đã xóa sự kiện");
    loadEvents();
  } catch (e) {
    showToast(e.message || "Không thể xóa sự kiện", "error");
  }
}

// First load

loadEvents();
