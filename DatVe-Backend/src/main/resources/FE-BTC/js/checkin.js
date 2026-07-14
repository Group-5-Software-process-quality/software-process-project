// ==========================================
// EventSphere Organizer - Check-in QR
// checkin.js (dùng API thật)
// ==========================================

protectBtcPage();

// Elements

const sidebarName = document.getElementById("sidebarName");
const sidebarOrg = document.getElementById("sidebarOrg");
const manualCode = document.getElementById("manualCode");
const resultBox = document.getElementById("resultBox");

// Sidebar

sidebarName.innerHTML = getBtcName();
sidebarOrg.innerHTML = getBtcEmail();

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await API.POST("/auth/logout");
  } catch (e) {}
  btcLogout();
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

async function submitCode(code) {
  let result;

  try {
    result = await API.POST("/organizer/checkin", { code });
  } catch (e) {
    resultBox.innerHTML = `
      <div class="card card-pad result-danger">
        <i class="fa-solid fa-circle-xmark"></i>
        ${escapeHtml(e.message || "Không thể kiểm tra mã vé")}
      </div>
    `;
    return;
  }

  if (result.result === "not_found") {
    resultBox.innerHTML = `
      <div class="card card-pad result-danger">
        <i class="fa-solid fa-circle-xmark"></i>
        Không tìm thấy mã vé "${escapeHtml(code)}"
      </div>
    `;
    return;
  }

  if (result.result === "already_used") {
    resultBox.innerHTML = `
      <div class="card card-pad result-warning">
        <div class="result-title-warning"><i class="fa-solid fa-triangle-exclamation"></i> Vé này đã được check-in trước đó</div>
        <div style="margin-top: 10px; font-size: 14px">
          <div><strong>${escapeHtml(result.eventTitle)}</strong></div>
          <div>${escapeHtml(result.ticketType)} · Khách: ${escapeHtml(result.attendee)}</div>
        </div>
      </div>
    `;
    return;
  }

  resultBox.innerHTML = `
    <div class="card card-pad result-success">
      <div class="result-title-success"><i class="fa-solid fa-circle-check"></i> Check-in thành công</div>
      <div style="margin-top: 10px; font-size: 14px">
        <div><strong>${escapeHtml(result.eventTitle)}</strong></div>
        <div>${escapeHtml(result.ticketType)}</div>
        <div>Khách: ${escapeHtml(result.attendee)}</div>
        <div class="ticket-code" style="margin-top: 6px">${escapeHtml(code)}</div>
      </div>
    </div>
  `;

  manualCode.value = "";
}
