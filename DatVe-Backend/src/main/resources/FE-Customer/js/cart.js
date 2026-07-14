// ==========================================
// EventSphere Customer - Giỏ hàng
// cart.js (dùng API thật)
// ==========================================

let cartItems = [];
let appliedDiscount = null; // { code, type: 'percent' | 'fixed', value }

// Elements

const cartBadge = document.getElementById("cartBadge");
const userAvatar = document.getElementById("userAvatar");
const userNameShort = document.getElementById("userNameShort");

const emptyCartBox = document.getElementById("emptyCartBox");
const cartBox = document.getElementById("cartBox");
const cartItemsList = document.getElementById("cartItemsList");

const discountCode = document.getElementById("discountCode");
const discountMsg = document.getElementById("discountMsg");
const discountRow = document.getElementById("discountRow");
const discountAmount = document.getElementById("discountAmount");

const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");

// Yêu cầu đăng nhập

if (!isCustomerLoggedIn()) {
  window.location.href = "/login.html";
}

// Nav

const lastName = getCustomerName().split(" ").slice(-1)[0];
userAvatar.innerHTML = lastName[0];
userNameShort.innerHTML = lastName;

// Tải giỏ hàng từ server

async function loadCart() {
  try {
    cartItems = await API.GET("/cart");
    renderCart();
  } catch (e) {
    showToast("Không thể tải giỏ hàng", "error");
  }
}

// Vẽ danh sách sản phẩm trong giỏ

function renderCart() {
  cartBadge.innerHTML = cartItems.length;
  cartBadge.style.display = cartItems.length > 0 ? "inline-block" : "none";

  if (cartItems.length === 0) {
    emptyCartBox.style.display = "block";
    cartBox.style.display = "none";
    return;
  }

  emptyCartBox.style.display = "none";
  cartBox.style.display = "block";

  cartItemsList.innerHTML = "";

  cartItems.forEach((item) => {
    cartItemsList.innerHTML += `
      <div class="cart-row">
        <div class="cart-thumb ${item.gradClass || "grad-1"}"><i class="fa-solid ${item.icon || "fa-calendar-star"}"></i></div>
        <div class="cart-info">
          <div class="cart-info-title">${escapeHtml(item.eventTitle)}</div>
          <div class="cart-info-date">${formatDate(item.date)}</div>
          <div class="cart-info-badges">
            <span class="badge badge-primary">${escapeHtml(item.ticketTypeName)}</span>
            <span class="badge badge-neutral">x${item.qty}</span>
          </div>
        </div>
        <div class="cart-price">${money(item.price * item.qty)}</div>
        <button class="btn btn-icon btn-ghost" data-remove="${item.id}" title="Xóa">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
  });

  document.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeItem(btn.dataset.remove));
  });

  updateSummary();
}

async function removeItem(id) {
  try {
    await API.DELETE("/cart/" + id);
    cartItems = cartItems.filter((i) => String(i.id) !== String(id));
    showToast("Đã xóa khỏi giỏ hàng");
    renderCart();
  } catch (e) {
    showToast("Không thể xóa sản phẩm", "error");
  }
}

// Tính tổng tiền

function updateSummary() {
  let subtotal = 0;

  cartItems.forEach((i) => {
    subtotal += i.price * i.qty;
  });

  subtotalEl.innerHTML = money(subtotal);

  let discountValue = 0;

  if (appliedDiscount) {
    if (appliedDiscount.type === "percent") {
      discountValue = subtotal * (appliedDiscount.value / 100);
    } else {
      discountValue = Math.min(appliedDiscount.value, subtotal);
    }

    discountRow.style.display = "flex";
    discountAmount.innerHTML = "−" + money(discountValue);
  } else {
    discountRow.style.display = "none";
  }

  totalEl.innerHTML = money(subtotal - discountValue);
}

// Áp dụng mã giảm giá

document.getElementById("applyDiscountBtn").addEventListener("click", async () => {
  const code = discountCode.value.trim().toUpperCase();

  if (!code) return;

  try {
    const result = await API.GET("/cart/discounts/validate?code=" + encodeURIComponent(code));

    if (result.valid) {
      appliedDiscount = { code: result.code, type: result.type, value: result.value };
      discountMsg.innerHTML = '<div class="input-hint" style="color:#16803d"><i class="fa-solid fa-check"></i> ' + escapeHtml(result.message) + "</div>";
    } else {
      appliedDiscount = null;
      discountMsg.innerHTML = '<div class="error-text">' + escapeHtml(result.message) + "</div>";
    }
  } catch (e) {
    appliedDiscount = null;
    discountMsg.innerHTML = '<div class="error-text">Không thể kiểm tra mã giảm giá</div>';
  }

  updateSummary();
});

// Thanh toán

checkoutBtn.addEventListener("click", async () => {
  checkoutBtn.disabled = true;
  checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý thanh toán...';

  try {
    await API.POST("/cart/checkout", {
      discountCode: appliedDiscount ? appliedDiscount.code : null,
    });

    window.location.href = "my-tickets.html";
  } catch (e) {
    showToast(e.message || "Thanh toán thất bại", "error");
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML = "Thanh toán";
  }
});

// First load

loadCart();
