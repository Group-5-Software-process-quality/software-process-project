// ==========================================
// EventSphere Organizer - Check-in QR
// checkin.js
// ==========================================

// Elements

const sidebarName = document.getElementById("sidebarName");
const sidebarOrg = document.getElementById("sidebarOrg");
const manualCode = document.getElementById("manualCode");
const resultBox = document.getElementById("resultBox");

// Sidebar

sidebarName.innerHTML = ORG_USER.name;
sidebarOrg.innerHTML = ORG_USER.organization;

document.getElementById("logoutBtn").addEventListener("click", () => {
  showToast("Đã đăng xuất (demo giao diện)");
});

// Bật camera (demo)

document.getElementById("toggleCamBtn").addEventListener("click", () => {
  showToast("Camera cần được nối ở bước tích hợp thật (ví dụ thư viện html5-qrcode).");
});

// Check-in bằng mã thủ công


document.getElementById("manualForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const code = manualCode.value.trim().toUpperCase();

  if (code) submitCode(code);
});

function submitCode(code) {
  // TODO: nối API thật (POST /checkin/scan)
  const ticket = CHECKIN_TICKETS[code];

  if (!ticket) {
    resultBox.innerHTML = `
      <div class="card card-pad result-danger">
        <i class="fa-solid fa-circle-xmark"></i>
        Không tìm thấy mã vé "${escapeHtml(code)}"
      </div>
    `;
    return;
  }

  if (ticket.status === "used") {
    resultBox.innerHTML = `
      <div class="card card-pad result-warning">
        <div class="result-title-warning"><i class="fa-solid fa-triangle-exclamation"></i> Vé này đã được check-in trước đó</div>
        <div style="margin-top: 10px; font-size: 14px">
          <div><strong>${escapeHtml(ticket.eventTitle)}</strong></div>
          <div>${escapeHtml(ticket.ticketType)} · Khách: ${escapeHtml(ticket.attendee)}</div>
        </div>
      </div>
    `;
    return;
  }

  resultBox.innerHTML = `
    <div class="card card-pad result-success">
      <div class="result-title-success"><i class="fa-solid fa-circle-check"></i> Check-in thành công</div>
      <div style="margin-top: 10px; font-size: 14px">
        <div><strong>${escapeHtml(ticket.eventTitle)}</strong></div>
        <div>${escapeHtml(ticket.ticketType)}</div>
        <div>Khách: ${escapeHtml(ticket.attendee)}</div>
        <div class="ticket-code" style="margin-top: 6px">${escapeHtml(code)}</div>
      </div>
    </div>
  `;

  manualCode.value = "";
}
