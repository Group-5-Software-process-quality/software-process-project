// ==========================================
// EventSphere Customer - Chi tiết sự kiện
// event-detail.js (dùng API thật)
// ==========================================

// Lấy id sự kiện từ URL

const params = new URLSearchParams(window.location.search);
const eventId = Number(params.get("id"));

let eventData = null;
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

// Tải thông tin sự kiện

async function loadEvent() {
  try {
    eventData = await API.GET("/public/events/" + eventId);
  } catch (e) {
    eventTitle.innerHTML = "Không tìm thấy sự kiện";
    eventDescription.innerHTML = "Sự kiện này không tồn tại hoặc chưa được duyệt.";
    ticketTypesBox.innerHTML = "";
    addCartBtn.disabled = true;
    return;
  }

  eventImage.className = "event-hero-img " + (eventData.gradClass || "grad-1");
  eventIcon.className = "fa-solid " + (eventData.icon || "fa-calendar-star");
  eventCategory.innerHTML = escapeHtml(eventData.category || "");
  eventTitle.innerHTML = escapeHtml(eventData.title);
  eventDate.innerHTML = formatDate(eventData.date);
  eventLocation.innerHTML = escapeHtml(eventData.location || "");
  eventRating.innerHTML = eventData.rating || 0;
  eventReviewCount.innerHTML = eventData.reviewCount || 0;
  eventDescription.innerHTML = escapeHtml(eventData.description || "");

  renderTicketTypes();
  loadReviews();
}

// Vẽ danh sách loại vé

function renderTicketTypes() {
  ticketTypesBox.innerHTML = "";

  (eventData.ticketTypes || []).forEach((tt) => {
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

  updateTotal();
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

  (eventData.ticketTypes || []).forEach((tt) => {
    const qty = quantities[tt.id] || 0;
    total += qty * tt.price;
    totalQty += qty;
  });

  runningTotal.innerHTML = money(total);
  addCartBtn.disabled = totalQty === 0;
}

// Thêm vào giỏ hàng

addCartBtn.addEventListener("click", async () => {
  if (!isCustomerLoggedIn()) {
    window.location.href = "/login.html";
    return;
  }

  const selections = Object.entries(quantities).filter(([, qty]) => qty > 0);

  if (selections.length === 0) return;

  addCartBtn.disabled = true;

  try {
    for (const [ticketTypeId, qty] of selections) {
      await API.POST("/cart", { ticketTypeId: Number(ticketTypeId), quantity: qty });
    }

    showToast("Đã thêm vào giỏ hàng!");

    setTimeout(() => {
      window.location.href = "cart.html";
    }, 500);
  } catch (e) {
    showToast(e.message || "Không thể thêm vào giỏ hàng", "error");
    addCartBtn.disabled = false;
  }
});

// Vẽ danh sách đánh giá

async function loadReviews() {
  try {
    const reviews = await API.GET("/public/events/" + eventId + "/reviews");
    renderReviews(reviews);
  } catch (e) {
    reviewsList.innerHTML = "";
  }
}

function renderReviews(reviews) {
  reviewsList.innerHTML = "";

  if (reviews.length === 0) {
    reviewsList.innerHTML = '<p class="review-comment">Chưa có đánh giá nào cho sự kiện này.</p>';
    return;
  }

  reviews.forEach((r) => {
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
        <p class="review-comment">${escapeHtml(r.comment || "")}</p>
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

document.getElementById("submitReviewBtn").addEventListener("click", async () => {
  if (!isCustomerLoggedIn()) {
    window.location.href = "/login.html";
    return;
  }

  if (selectedRating === 0) {
    showToast("Vui lòng chọn số sao đánh giá", "error");
    return;
  }

  try {
    await API.POST("/public/events/" + eventId + "/reviews", {
      rating: selectedRating,
      comment: reviewComment.value.trim(),
    });

    showToast("Cảm ơn bạn đã đánh giá!");

    reviewComment.value = "";
    selectedRating = 0;
    ratingInput.querySelectorAll("button").forEach((b) => b.classList.remove("active"));

    loadEvent();
    loadReviews();
  } catch (e) {
    showToast(e.message || "Không thể gửi đánh giá", "error");
  }
});

// First load

loadNav();
loadEvent();
