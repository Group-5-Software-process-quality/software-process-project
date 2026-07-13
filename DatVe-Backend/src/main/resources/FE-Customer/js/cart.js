// ==========================================
// EventSphere Customer - Giỏ hàng
// cart.js
// ==========================================

let cartItems = MOCK_CART.slice(); // bản sao để có thể xóa khỏi giỏ
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

// Nav

const lastName = MOCK_USER.name.split(" ").slice(-1)[0];
userAvatar.innerHTML = lastName[0];
userNameShort.innerHTML = lastName;

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
        <div class="cart-thumb ${item.grad}"><i class="fa-solid ${item.icon}"></i></div>
        <div class="cart-info">
          <div class="cart-info-title">${escapeHtml(item.eventTitle)}</div>
          <div class="cart-info-date">${formatDate(item.date)}</div>
          <div class="cart-info-badges">
            <span class="badge badge-primary">${escapeHtml(item.ticketType)}</span>
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

function removeItem(id) {
  cartItems = cartItems.filter((i) => i.id !== id);
  showToast("Đã xóa khỏi giỏ hàng");
  renderCart();
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
  }

  totalEl.innerHTML = money(subtotal - discountValue);
}


// Áp dụng mã giảm giá

document.getElementById("applyDiscountBtn").addEventListener("click", () => {
  const code = discountCode.value.trim().toUpperCase();

  if (!code) return;

  // TODO: nối API thật (POST /discounts/validate). Demo: mã "SUMMER10" = giảm 10%.
  if (code === "SUMMER10") {
    appliedDiscount = { code: code, type: "percent", value: 10 };
    discountMsg.innerHTML = '<div class="input-hint" style="color:#16803d"><i class="fa-solid fa-check"></i> Áp dụng mã "' + escapeHtml(code) + '" thành công</div>';
  } else {
    appliedDiscount = null;
    discountMsg.innerHTML = '<div class="error-text">Mã giảm giá không hợp lệ hoặc đã hết hạn</div>';
  }

  updateSummary();
});

// Thanh toán

checkoutBtn.addEventListener("click", () => {
  checkoutBtn.disabled = true;
  checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý thanh toán...';

  // TODO: nối API thật (POST /orders/checkout)
  setTimeout(() => {
    window.location.href = "my-tickets.html";
  }, 700);
});

// First load

renderCart();
