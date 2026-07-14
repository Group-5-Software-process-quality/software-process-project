// ==========================================
// EventSphere Customer - Trang chủ
// index.js (dùng API thật)
// ==========================================

// Elements

const cartBadge = document.getElementById("cartBadge");
const userAvatar = document.getElementById("userAvatar");
const userNameShort = document.getElementById("userNameShort");

const filterCategory = document.getElementById("filterCategory");
const filterLocation = document.getElementById("filterLocation");
const filterDateFrom = document.getElementById("filterDateFrom");
const searchInput = document.getElementById("q");
const eventsGrid = document.getElementById("eventsGrid");

let allEvents = [];

// Nav (giỏ hàng + tên user)

async function loadNav() {
  if (isCustomerLoggedIn()) {
    const lastName = getCustomerName().split(" ").slice(-1)[0];
    userAvatar.innerHTML = lastName[0];
    userNameShort.innerHTML = lastName;

    try {
      const cart = await API.GET("/cart");
      cartBadge.innerHTML = cart.length;
      cartBadge.style.display = cart.length > 0 ? "inline-block" : "none";
    } catch (e) {
      cartBadge.style.display = "none";
    }
  } else {
    cartBadge.style.display = "none";
  }
}

// Load danh mục vào bộ lọc

function loadCategories() {
  const categories = [];

  allEvents.forEach((ev) => {
    if (ev.category && !categories.includes(ev.category)) {
      categories.push(ev.category);
    }
  });

  filterCategory.innerHTML = '<option value="">Tất cả danh mục</option>';

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.innerHTML = cat;
    filterCategory.appendChild(option);
  });
}

// Tải sự kiện từ server theo bộ lọc hiện tại

async function loadEvents() {
  eventsGrid.innerHTML = `
    <div class="empty-state" style="grid-column:1/-1">
      <i class="fa-solid fa-spinner fa-spin"></i> Đang tải sự kiện...
    </div>
  `;

  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set("q", searchInput.value.trim());
  if (filterCategory.value) params.set("category", filterCategory.value);
  if (filterLocation.value.trim()) params.set("location", filterLocation.value.trim());
  if (filterDateFrom.value) params.set("dateFrom", filterDateFrom.value);

  try {
    allEvents = await API.GET("/public/events" + (params.toString() ? "?" + params.toString() : ""));

    if (filterCategory.children.length <= 1) {
      loadCategories();
    }

    renderEvents(allEvents);
  } catch (e) {
    console.log(e);
    eventsGrid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
        Không thể kết nối máy chủ. Vui lòng thử lại sau.
      </div>
    `;
  }
}

// Vẽ lưới sự kiện

function renderEvents(results) {
  eventsGrid.innerHTML = "";

  if (results.length === 0) {
    eventsGrid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="icon"><i class="fa-solid fa-magnifying-glass"></i></div>
        Không tìm thấy sự kiện phù hợp. Hãy thử điều chỉnh bộ lọc.
      </div>
    `;
    return;
  }

  results.forEach((ev) => {
    const price = ev.minPrice > 0 ? "Từ " + money(ev.minPrice) : "Miễn phí";
    const icon = ev.icon || "fa-calendar-star";
    const grad = ev.gradClass || "grad-1";

    eventsGrid.innerHTML += `
      <a href="event-detail.html?id=${ev.id}" class="card event-card">
        <div class="event-card-img ${grad}">
          <i class="fa-solid ${icon}"></i>
          <span class="event-card-cat">${escapeHtml(ev.category || "")}</span>
        </div>
        <div class="event-card-body">
          <div class="event-card-date">${formatDate(ev.date)}</div>
          <div class="event-card-title">${escapeHtml(ev.title)}</div>
          <div class="event-card-meta">
            <i class="fa-solid fa-location-dot"></i>
            ${escapeHtml(ev.location || "")}
          </div>
          <div class="event-card-footer">
            <span class="event-card-price">${price}</span>
            <span class="stars"><i class="fa-solid fa-star"></i> ${ev.rating || 0}</span>
          </div>
        </div>
      </a>
    `;
  });
}

// Sự kiện (event listener)

document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  loadEvents();
});

filterCategory.addEventListener("change", loadEvents);
filterLocation.addEventListener("input", loadEvents);
filterDateFrom.addEventListener("change", loadEvents);

document.getElementById("clearFiltersBtn").addEventListener("click", () => {
  searchInput.value = "";
  filterCategory.value = "";
  filterLocation.value = "";
  filterDateFrom.value = "";
  loadEvents();
});

// First load

loadNav();
loadEvents();
