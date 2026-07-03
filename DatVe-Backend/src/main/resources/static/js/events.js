// =========================================
// EventSphere Admin
// events.js
// =========================================

protectPage();

const table = document.getElementById("eventTable");
const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");
const addEventBtn = document.getElementById("addEventBtn");

const saveForm = document.getElementById("eventForm");

const modal = new bootstrap.Modal(document.getElementById("eventModal"));

let events = [];
let filteredEvents = [];

let currentPage = 1;
const pageSize = 10;

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

async function loadEvents() {
  try {
    events = await API.GET("/events");

    filteredEvents = [...events];

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

  const start = (currentPage - 1) * pageSize;

  const end = start + pageSize;

  filteredEvents.slice(start, end).forEach((event) => {
    table.innerHTML += `

        <tr>

            <td>${event.id}</td>

            <td>${event.title}</td>

            <td>${event.location}</td>

            <td>${formatDate(event.eventDate)}</td>

            <td>${money(event.price)}</td>

            <td>${event.capacity}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm"
                    onclick="editEvent(${event.id})">

                    Edit

                </button>

                <button
                    class="btn btn-info btn-sm"
                    onclick="viewEvent(${event.id})">

                    View

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteEvent(${event.id})">

                    Delete

                </button>

            </td>

        </tr>

        `;
  });

  document.getElementById("pageNumber").innerHTML = `Page ${currentPage}`;
}

// =========================
// Search
// =========================

searchInput.onkeyup = () => {
  const key = searchInput.value.toLowerCase();

  filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(key) ||
      e.location.toLowerCase().includes(key),
  );

  currentPage = 1;

  renderTable();
};

// =========================
// Refresh
// =========================

refreshBtn.onclick = loadEvents;

// =========================
// Previous
// =========================

document.getElementById("prevBtn").onclick = () => {
  if (currentPage > 1) {
    currentPage--;

    renderTable();
  }
};

// =========================
// Next
// =========================

document.getElementById("nextBtn").onclick = () => {
  const max = Math.ceil(filteredEvents.length / pageSize);

  if (currentPage < max) {
    currentPage++;

    renderTable();
  }
};

// =========================
// View
// =========================

function viewEvent(id) {
  const e = events.find((x) => x.id === id);

  if (!e) return;

  alert(
    `Title : ${e.title}

Location : ${e.location}

Date : ${formatDate(e.eventDate)}

Price : ${money(e.price)}

Capacity : ${e.capacity}`,
  );
}

// =========================
// Delete
// =========================

async function deleteEvent(id) {
  if (!confirm("Delete event ?")) return;

  try {
    await API.DELETE("/events/" + id);

    alert("Delete Success");

    loadEvents();
  } catch (e) {
    console.log(e);

    alert("Delete Failed");
  }
}

// =========================
//add Event
// =========================

addEventBtn.onclick = () => {
  document.getElementById("eventId").value = "";

  document.getElementById("title").value = "";

  document.getElementById("location").value = "";

  document.getElementById("date").value = "";

  document.getElementById("price").value = "";

  document.getElementById("seats").value = "";

  modal.show();
};

// =========================
// First Load
// =========================

loadEvents();

setInterval(loadEvents, 5000);

// =========================
//save Event
// =========================

saveForm.onsubmit = async (e) => {
  e.preventDefault();

  const id = document.getElementById("eventId").value;

  const data = {
    title: document.getElementById("title").value,

    location: document.getElementById("location").value,

    eventDate: document.getElementById("date").value,

    price: Number(document.getElementById("price").value),

    capacity: Number(document.getElementById("seats").value),
  };

  try {
    if (id == "") {
      await API.POST("/events", data);

      alert("Add Success");
    } else {
      await API.PUT("/events/" + id, data);

      alert("Update Success");
    }

    modal.hide();

    loadEvents();
  } catch (err) {
    console.log(err);

    alert("Save Failed");
  }
};

// =========================
//edit Event
// =========================

function editEvent(id) {
  const e = events.find((x) => x.id == id);

  if (!e) return;

  document.getElementById("eventId").value = e.id;

  document.getElementById("title").value = e.title;

  document.getElementById("location").value = e.location;

  document.getElementById("date").value = e.eventDate.substring(0, 16);

  document.getElementById("price").value = e.price;

  document.getElementById("seats").value = e.capacity;

  modal.show();
}

// =========================
//review picture
// =========================

document.getElementById("banner").onchange = function () {
  previewImage(this, document.getElementById("preview"));
};
