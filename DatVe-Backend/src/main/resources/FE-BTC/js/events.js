// ==========================================
// EventSphere Organizer - Sự kiện của tôi
// events.js
// ==========================================

// =========================
// Elements
// =========================

const sidebarName = document.getElementById("sidebarName");
const sidebarOrg = document.getElementById("sidebarOrg");

const eventCountLabel = document.getElementById("eventCountLabel");
const emptyEventsBox = document.getElementById("emptyEventsBox");
const eventsTable = document.getElementById("eventsTable");
const eventsBody = document.getElementById("eventsBody");

// Sidebar

sidebarName.innerHTML = ORG_USER.name;
sidebarOrg.innerHTML = ORG_USER.organization;

document.getElementById("logoutBtn").addEventListener("click", () => {
  showToast("Đã đăng xuất (demo giao diện)");
});

// Vẽ bảng sự kiện

function renderEvents() {
  eventCountLabel.innerHTML = ORG_EVENTS.length + " sự kiện";

  if (ORG_EVENTS.length === 0) {
    emptyEventsBox.style.display = "block";
    eventsTable.style.display = "none";
    return;
  }

  eventsBody.innerHTML = "";

  ORG_EVENTS.forEach((ev) => {
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

function submitForApproval(id) {
  // TODO: nối API thật (POST /events/{id}/submit)
  ORG_EVENTS.forEach((ev) => {
    if (ev.id === id) ev.status = "pending";
  });

  showToast("Đã gửi sự kiện cho quản trị viên duyệt");
  renderEvents();
}

// Xóa sự kiện

function deleteEvent(id) {
  let title = "";
  let index = -1;

  ORG_EVENTS.forEach((ev, i) => {
    if (ev.id === id) {
      title = ev.title;
      index = i;
    }
  });

  if (!confirm('Xóa sự kiện "' + title + '"? Hành động này không thể hoàn tác.')) return;

  // TODO: nối API thật (DELETE /events/{id})
  if (index > -1) {
    ORG_EVENTS.splice(index, 1);
  }

  showToast("Đã xóa sự kiện");
  renderEvents();
}

// First load

renderEvents();
