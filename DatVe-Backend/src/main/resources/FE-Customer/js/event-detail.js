// ==========================================
// EventSphere Customer - Chi tiết sự kiện
// event-detail.js
// ==========================================

// Lấy id sự kiện từ URL

const params = new URLSearchParams(window.location.search);
const eventId = Number(params.get("id")) || 1;

let event = null;

MOCK_EVENTS.forEach((ev) => {
  if (ev.id === eventId) {
    event = ev;
  }
});

if (!event) {
  event = MOCK_EVENTS[0];
}

let quantities = {}; // ticketTypeId -> số lượng đang chọn

// Elements

const cartBadge = document.getElementById("cartBadge");
const userAvatar = document.getElementById("userAvatar");
const userNameShort = document.getElementById("userNameShort");

const eventImage = document.getElementById("eventImage");
const eventIcon = document.getElementById("eventIcon");
const eventCategory = document.getElementById("eventCategory");
const eventTitle = document.getElementById("eventTitle");
const eventDate = document.getElementById("eventDate");
const eventLocation = document.getElementById("eventLocation");
const eventRating = document.getElementById("eventRating");
const eventReviewCount = document.getElementById("eventReviewCount");
const eventDescription = document.getElementById("eventDescription");

const ticketTypesBox = document.getElementById("ticketTypesBox");
const runningTotal = document.getElementById("runningTotal");
const addCartBtn = document.getElementById("addCartBtn");

const reviewsList = document.getElementById("reviewsList");
const ratingInput = document.getElementById("ratingInput");
const reviewComment = document.getElementById("reviewComment");

// Nav

cartBadge.innerHTML = MOCK_CART.length;
cartBadge.style.display = MOCK_CART.length > 0 ? "inline-block" : "none";

const lastName = MOCK_USER.name.split(" ").slice(-1)[0];
userAvatar.innerHTML = lastName[0];
userNameShort.innerHTML = lastName;

// Thông tin sự kiện

eventImage.className = "event-hero-img " + event.grad;
eventIcon.className = "fa-solid " + event.icon;
eventCategory.innerHTML = event.category;
eventTitle.innerHTML = event.title;
eventDate.innerHTML = formatDate(event.date);
eventLocation.innerHTML = event.location;
eventRating.innerHTML = event.rating;
eventReviewCount.innerHTML = event.reviewCount;
eventDescription.innerHTML = event.description;

// Vẽ danh sách loại vé

function renderTicketTypes() {
  ticketTypesBox.innerHTML = "";

  event.ticketTypes.forEach((tt) => {
    const remaining = tt.total - tt.sold;
    const qty = quantities[tt.id] || 0;

    const remainingHtml =
      remaining <= 0
        ? '<span class="badge badge-danger">Hết vé</span>'
        : '<span class="badge badge-neutral">Còn ' + remaining + " vé</span>";

    ticketTypesBox.innerHTML += `
      <div class="tt-row">
        <div>
          <div class="tt-name">${escapeHtml(tt.name)}</div>
          <div class="tt-remaining">${remainingHtml}</div>
          <div class="tt-price">${money(tt.price)}</div>
        </div>
        <div class="tt-qty-box">
          <button class="btn btn-ghost btn-sm" data-action="minus" data-tt="${tt.id}">−</button>
          <span class="tt-qty-value" id="qty-${tt.id}">${qty}</span>
          <button class="btn btn-ghost btn-sm" data-action="plus" data-tt="${tt.id}" data-max="${remaining}">+</button>
        </div>
      </div>
    `;
  });

  document.querySelectorAll("[data-action='plus']").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(btn.dataset.tt, 1, Number(btn.dataset.max)));
  });

  document.querySelectorAll("[data-action='minus']").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(btn.dataset.tt, -1, 0));
  });
}

function changeQty(ttId, delta, max) {
  const current = quantities[ttId] || 0;
  const next = current + delta;

  if (next < 0) return;
  if (delta > 0 && current >= max) return;

  quantities[ttId] = next;
  document.getElementById("qty-" + ttId).innerHTML = next;

  updateTotal();
}

function updateTotal() {
  let total = 0;
  let totalQty = 0;

  event.ticketTypes.forEach((tt) => {
    const qty = quantities[tt.id] || 0;
    total += qty * tt.price;
    totalQty += qty;
  });

  runningTotal.innerHTML = money(total);
  addCartBtn.disabled = totalQty === 0;
}

// Thêm vào giỏ hàng

addCartBtn.addEventListener("click", () => {
  // TODO: nối API thật (POST /cart hoặc /orders)
  showToast("Đã thêm vào giỏ hàng!");

  setTimeout(() => {
    window.location.href = "cart.html";
  }, 500);
});

// Vẽ danh sách đánh giá

function renderReviews() {
  reviewsList.innerHTML = "";

  MOCK_REVIEWS.forEach((r) => {
    let starsHtml = "";

    for (let i = 1; i <= 5; i++) {
      starsHtml += i <= r.rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
    }

    reviewsList.innerHTML += `
      <div class="review-item">
        <div class="review-head">
          <strong>${escapeHtml(r.name)}</strong>
          <span class="stars">${starsHtml}</span>
        </div>
        <p class="review-comment">${escapeHtml(r.comment)}</p>
      </div>
    `;
  });
}

// Chọn số sao đánh giá

let selectedRating = 0;

ratingInput.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedRating = Number(btn.dataset.val);

    ratingInput.querySelectorAll("button").forEach((b) => {
      b.classList.toggle("active", Number(b.dataset.val) <= selectedRating);
    });
  });
});

document.getElementById("submitReviewBtn").addEventListener("click", () => {
  if (selectedRating === 0) {
    showToast("Vui lòng chọn số sao đánh giá", "error");
    return;
  }

  // TODO: nối API thật (POST /events/{id}/reviews)
  showToast("Cảm ơn bạn đã đánh giá!");

  reviewComment.value = "";
  selectedRating = 0;
  ratingInput.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
});

// First load

renderTicketTypes();
renderReviews();
