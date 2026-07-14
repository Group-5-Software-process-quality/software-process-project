// =========================================
// EventSphere Admin
// pending-events.js
// =========================================

protectPage();

const table = document.getElementById("eventTable");
const emptyBox = document.getElementById("emptyBox");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");

const rejectForm = document.getElementById("rejectForm");
const rejectModal = new bootstrap.Modal(document.getElementById("rejectModal"));

let events = [];

// =========================
// Logout
// =========================

logoutBtn.onclick = () => {
  if (confirm("Logout ?")) {
    logout();
  }
};

// =========================
// Load
// =========================

async function loadPendingEvents() {
  try {
    events = await API.GET("/admin/events/pending");

    renderTable();
  } catch (e) {
    console.log(e);

    alert("Cannot connect server.");
  }
}

// =========================
// Render
// =========================

function renderTable() {
  table.innerHTML = "";

  if (events.length === 0) {
    emptyBox.style.display = "block";
    return;
  }

  emptyBox.style.display = "none";

  events.forEach((event) => {
    const organizerName = event.organizer ? event.organizer.fullName : "Admin";

    table.innerHTML += `

        <tr>

            <td>${event.id}</td>

            <td>${event.title}</td>

            <td>${organizerName}</td>

            <td>${event.location}</td>

            <td>${formatDate(event.eventDate)}</td>

            <td>${money(event.price)}</td>

            <td>${event.capacity}</td>

            <td>

                <button
                    class="btn btn-success btn-sm"
                    onclick="approveEvent(${event.id})">

                    Approve

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="openReject(${event.id})">

                    Reject

                </button>

            </td>

        </tr>

        `;
  });
}

// =========================
// Refresh
// =========================

refreshBtn.onclick = loadPendingEvents;

// =========================
// Approve
// =========================

async function approveEvent(id) {
  if (!confirm("Duyệt sự kiện này?")) return;

  try {
    await API.PUT("/admin/events/" + id + "/approve");

    alert("Đã duyệt sự kiện");

    loadPendingEvents();
  } catch (e) {
    console.log(e);

    alert("Duyệt thất bại");
  }
}

// =========================
// Reject
// =========================

function openReject(id) {
  document.getElementById("rejectEventId").value = id;
  document.getElementById("rejectReason").value = "";

  rejectModal.show();
}

rejectForm.onsubmit = async (e) => {
  e.preventDefault();

  const id = document.getElementById("rejectEventId").value;
  const reason = document.getElementById("rejectReason").value;

  try {
    await API.PUT("/admin/events/" + id + "/reject", { reason: reason });

    alert("Đã từ chối sự kiện");

    rejectModal.hide();

    loadPendingEvents();
  } catch (err) {
    console.log(err);

    alert("Từ chối thất bại");
  }
};

// =========================
// First Load
// =========================

loadPendingEvents();

setInterval(loadPendingEvents, 5000);
