// =========================================
// EventSphere Admin
// users.js
// =========================================

protectPage();

const table = document.getElementById("userTable");
const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");
const addUserBtn = document.getElementById("addUserBtn");
const saveUserBtn = document.getElementById("saveUserBtn");

const modal = new bootstrap.Modal(document.getElementById("userModal"));

let users = [];
let filteredUsers = [];

let currentPage = 1;
const pageSize = 10;

// =============================
// Logout
// =============================

logoutBtn.onclick = () => {
  if (confirm("Logout ?")) {
    logout();
  }
};

// =============================
// Load Users
// =============================

async function loadUsers() {
  try {
    users = await API.GET("/users");

    filteredUsers = [...users];

    renderTable();
  } catch (e) {
    console.log(e);

    alert("Cannot connect server.");
  }
}

// =============================
// Render
// =============================

function renderTable() {
  table.innerHTML = "";

  const start = (currentPage - 1) * pageSize;

  const end = start + pageSize;

  filteredUsers.slice(start, end).forEach((user) => {
    table.innerHTML += `

        <tr>

            <td>${user.id}</td>

            <td>${user.fullName}</td>

            <td>${user.email}</td>

            <td>

                  <button
                    class="btn btn-warning btn-sm"
                    onclick="editUser(${user.id})">

                    Edit

                  </button>

                  <button
                  class="btn btn-danger btn-sm"
                  onclick="deleteUser(${user.id})">

                  Delete

                  </button>

            </td>

        </tr>

        `;
  });

  document.getElementById("pageNumber").innerHTML = `Page ${currentPage}`;
}

// =============================
// Search
// =============================

searchInput.onkeyup = () => {
  const key = searchInput.value.toLowerCase();

  filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(key) ||
      user.email.toLowerCase().includes(key),
  );

  currentPage = 1;

  renderTable();
};

// =============================
// Refresh
// =============================

refreshBtn.onclick = loadUsers;

// =============================
// Previous
// =============================

document.getElementById("prevBtn").onclick = () => {
  if (currentPage > 1) {
    currentPage--;

    renderTable();
  }
};

// =============================
// Next
// =============================

document.getElementById("nextBtn").onclick = () => {
  const max = Math.ceil(filteredUsers.length / pageSize);

  if (currentPage < max) {
    currentPage++;

    renderTable();
  }
};

// =============================
// Delete
// =============================

async function deleteUser(id) {
  if (!confirm("Delete this user ?")) return;

  try {
    await API.DELETE("/users/" + id);

    alert("Delete Success");

    loadUsers();
  } catch (e) {
    console.log(e);

    alert("Delete Failed");
  }
}

// =============================
// Add User
// =============================
addUserBtn.onclick = () => {
  document.getElementById("userId").value = "";

  document.getElementById("fullName").value = "";

  document.getElementById("email").value = "";

  document.getElementById("password").value = "";

  modal.show();
};

// =============================
// Save User
// =============================

saveUserBtn.onclick = async () => {
  const id = document.getElementById("userId").value;

  const data = {
    fullName: document.getElementById("fullName").value,

    email: document.getElementById("email").value,

    password: document.getElementById("password").value,
  };

  try {
    if (id == "") {
      await API.POST("/users", data);

      alert("Add Success");
    } else {
      await API.PUT("/users/" + id, data);

      alert("Update Success");
    }

    modal.hide();

    loadUsers();
  } catch (e) {
    console.log(e);

    alert("Save Failed");
  }
};

// =============================
// Auto Refresh
// =============================

loadUsers();

setInterval(loadUsers, 5000);

// =============================
// edit User
// =============================

function editUser(id){

    const user = users.find(x=>x.id==id);

    if(!user) return;

    document.getElementById("userId").value=user.id;

    document.getElementById("fullName").value=user.fullName;

    document.getElementById("email").value=user.email;

    document.getElementById("password").value=user.password;

    modal.show();

}
