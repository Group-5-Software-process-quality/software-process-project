// ==========================================
// EventSphere Customer - Trang chủ
// index.js
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

// Nav (giỏ hàng + tên user)

cartBadge.innerHTML = MOCK_CART.length;
cartBadge.style.display = MOCK_CART.length > 0 ? "inline-block" : "none";

const lastName = MOCK_USER.name.split(" ").slice(-1)[0];
userAvatar.innerHTML = lastName[0];
userNameShort.innerHTML = lastName;

// Load danh mục vào bộ lọc

function loadCategories() {
  const categories = [];

  MOCK_EVENTS.forEach((ev) => {
    if (!categories.includes(ev.category)) {
      categories.push(ev.category);
    }
  });

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.innerHTML = cat;
    filterCategory.appendChild(option);
  });
}

// Lọc sự kiện theo bộ lọc hiện tại

function matchesFilters(ev) {
  const q = searchInput.value.trim().toLowerCase();
  const cat = filterCategory.value;
  const loc = filterLocation.value.trim().toLowerCase();
  const from = filterDateFrom.value;

  if (q && !ev.title.toLowerCase().includes(q) && !ev.location.toLowerCase().includes(q)) {
    return false;
  }

  if (cat && ev.category !== cat) {
    return false;
  }

  if (loc && !ev.location.toLowerCase().includes(loc)) {
    return false;
  }

  if (from && ev.date < from) {
    return false;
  }

  return true;
}

// Vẽ lưới sự kiện

function renderEvents() {
  const results = MOCK_EVENTS.filter(matchesFilters);

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
    const price = ev.price > 0 ? "Từ " + money(ev.price) : "Miễn phí";

    eventsGrid.innerHTML += `
      <a href="event-detail.html?id=${ev.id}" class="card event-card">
        <div class="event-card-img ${ev.grad}">
          <i class="fa-solid ${ev.icon}"></i>
          <span class="event-card-cat">${escapeHtml(ev.category)}</span>
        </div>
        <div class="event-card-body">
          <div class="event-card-date">${formatDate(ev.date)}</div>
          <div class="event-card-title">${escapeHtml(ev.title)}</div>
          <div class="event-card-meta">
            <i class="fa-solid fa-location-dot"></i>
            ${escapeHtml(ev.location)}
          </div>
          <div class="event-card-footer">
            <span class="event-card-price">${price}</span>
            <span class="stars"><i class="fa-solid fa-star"></i> ${ev.rating}</span>
          </div>
        </div>
      </a>
    `;
  });
}

// Sự kiện (event listener)

document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  renderEvents();
});

filterCategory.addEventListener("change", renderEvents);
filterLocation.addEventListener("input", renderEvents);
filterDateFrom.addEventListener("change", renderEvents);

document.getElementById("clearFiltersBtn").addEventListener("click", () => {
  searchInput.value = "";
  filterCategory.value = "";
  filterLocation.value = "";
  filterDateFrom.value = "";
  renderEvents();
});

// First load

loadCategories();
renderEvents();
