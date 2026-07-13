// ==========================================
// EventSphere Customer - Vé của tôi
// my-tickets.js
// ==========================================

// Elements

const cartBadge = document.getElementById("cartBadge");
const userAvatar = document.getElementById("userAvatar");
const userNameShort = document.getElementById("userNameShort");

const emptyOrdersBox = document.getElementById("emptyOrdersBox");
const ordersList = document.getElementById("ordersList");

// Nav

cartBadge.innerHTML = MOCK_CART.length;
cartBadge.style.display = MOCK_CART.length > 0 ? "inline-block" : "none";

const lastName = MOCK_USER.name.split(" ").slice(-1)[0];
userAvatar.innerHTML = lastName[0];
userNameShort.innerHTML = lastName;

// Nhãn trạng thái

function statusLabel(status) {
  switch (status) {
    case "paid":
      return ["Đã thanh toán", "badge-success"];
    case "used":
      return ["Đã check-in", "badge-neutral"];
    case "pending":
      return ["Đang xử lý", "badge-warning"];
    case "cancelled":
      return ["Đã hủy", "badge-danger"];
    case "valid":
      return ["Còn hiệu lực", "badge-success"];
    default:
      return [status, "badge-neutral"];
  }
}

// Vẽ danh sách đơn hàng

function renderOrders() {
  if (MOCK_ORDERS.length === 0) {
    emptyOrdersBox.style.display = "block";
    return;
  }

  ordersList.innerHTML = "";

  MOCK_ORDERS.forEach((order) => {
    const label = statusLabel(order.status);

    ordersList.innerHTML += `
      <div class="card order-card">
        <div class="card-pad order-head" data-toggle="${order.id}">
          <div>
            <div class="order-code">${order.id}</div>
            <div class="order-date">${formatDate(order.date)}</div>
          </div>
          <div class="order-head-right">
            <span class="badge ${label[1]}">${label[0]}</span>
            <span class="order-total">${money(order.total)}</span>
            <i class="fa-solid fa-chevron-down order-caret" id="caret-${order.id}"></i>
          </div>
        </div>
        <div class="order-detail" id="detail-${order.id}"></div>
      </div>
    `;
  });

  document.querySelectorAll("[data-toggle]").forEach((el) => {
    el.addEventListener("click", () => toggleOrder(el.dataset.toggle));
  });
}

// Mở / đóng chi tiết đơn hàng

function toggleOrder(orderId) {
  const detail = document.getElementById("detail-" + orderId);
  const caret = document.getElementById("caret-" + orderId);

  const opening = detail.style.display !== "block";

  detail.style.display = opening ? "block" : "none";
  caret.style.transform = opening ? "rotate(180deg)" : "rotate(0)";

  if (!opening || detail.dataset.loaded) return;

  let order = null;

  MOCK_ORDERS.forEach((o) => {
    if (o.id === orderId) order = o;
  });

  order.items.forEach((item) => {
    let ticketsHtml = "";

    item.tickets.forEach((t) => {
      const label = statusLabel(t.status);

      ticketsHtml += `
        <div class="ticket-box">
          <div class="qr-box"><i class="fa-solid fa-qrcode"></i></div>
          <div class="ticket-code">${t.code}</div>
          <span class="badge ${label[1]}">${label[0]}</span>
        </div>
      `;
    });

    detail.innerHTML += `
      <div class="card-pad order-item-block">
        <div class="order-item-title">${escapeHtml(item.eventTitle)} — ${escapeHtml(item.ticketType)}</div>
        <div class="order-item-qty">Số lượng: ${item.qty}</div>
        <div class="ticket-row">${ticketsHtml}</div>
      </div>
    `;
  });

  detail.dataset.loaded = "1";
}

// First load

renderOrders();
