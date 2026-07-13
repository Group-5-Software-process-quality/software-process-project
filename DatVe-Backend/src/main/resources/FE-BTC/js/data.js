/**
 * data.js — Dữ liệu MẪU (mock) cho toàn bộ frontend-organizer.
 * File này đứng thay cho việc gọi API thật — sau này nối backend chỉ cần
 * sửa trong file này, các file index.js/events.js/... khác không cần đổi.
 */

const ORG_USER = { name: 'Đặng Văn Hùng', organization: 'Hùng Media Productions' };

const ORG_EVENTS = [
  { id: 1, title: 'Đêm nhạc Acoustic Sài Gòn', status: 'approved', startTime: '2026-08-14T19:30:00', ticketsSold: 214, revenue: 61400000, capacity: 300,
    ticketTypes: [ { id: 't1', name: 'Vé Thường', price: 250000, total: 200, sold: 168 }, { id: 't2', name: 'Vé VIP (ghế đầu)', price: 450000, total: 100, sold: 46 } ] },
  { id: 2, title: 'Hội thảo Chuyển đổi số 2026', status: 'approved', startTime: '2026-08-20T08:30:00', ticketsSold: 388, revenue: 0, capacity: 500,
    ticketTypes: [ { id: 't1', name: 'Vé tham dự', price: 0, total: 500, sold: 388 } ] },
  { id: 3, title: 'Triển lãm Nghệ thuật Đương đại', status: 'pending', startTime: '2026-08-28T09:00:00', ticketsSold: 0, revenue: 0, capacity: 400,
    ticketTypes: [ { id: 't1', name: 'Vé vào cửa', price: 100000, total: 400, sold: 0 } ] },
  { id: 4, title: 'Đêm hài kịch Sài Gòn', status: 'draft', startTime: '2026-09-02T20:00:00', ticketsSold: 0, revenue: 0, capacity: 250,
    ticketTypes: [] },
  { id: 5, title: 'Workshop Thiết kế UI/UX', status: 'rejected', startTime: '2026-08-05T13:00:00', ticketsSold: 0, revenue: 0, capacity: 60, rejectionReason: 'Thiếu thông tin địa điểm tổ chức cụ thể.',
    ticketTypes: [ { id: 't1', name: 'Vé tham dự', price: 220000, total: 60, sold: 0 } ] },
];

const ORG_DISCOUNTS = {
  1: [
    { id: 'd1', code: 'SUMMER10', type: 'percent', value: 10, used: 34, max: 100, active: true },
    { id: 'd2', code: 'EARLYBIRD', type: 'fixed', value: 50000, used: 100, max: 100, active: false },
  ],
  2: [],
  3: [],
};

const ORG_RECENT_ORDERS = {
  1: [
    { code: 'EVP-20260710-0142', customer: 'Phạm Thu Trang', amount: 500000, status: 'paid', date: '2026-07-10T14:22:00' },
    { code: 'EVP-20260709-0138', customer: 'Nguyễn Minh Anh', amount: 250000, status: 'paid', date: '2026-07-09T20:11:00' },
    { code: 'EVP-20260708-0130', customer: 'Trần Quốc Bảo', amount: 450000, status: 'pending', date: '2026-07-08T09:47:00' },
  ],
  2: [
    { code: 'EVP-20260705-0080', customer: 'Lê Thị Hồng', amount: 0, status: 'paid', date: '2026-07-05T11:02:00' },
  ],
  3: [],
};

const CHECKIN_TICKETS = {
  'EVP-8F2K9QX1': { eventTitle: 'Đêm nhạc Acoustic Sài Gòn', ticketType: 'Vé VIP (ghế đầu)', attendee: 'Phạm Thu Trang', status: 'valid' },
  'EVP-7A1M3PZ0': { eventTitle: 'Giải chạy Marathon Đà Nẵng', ticketType: 'Cự ly 10km', attendee: 'Nguyễn Minh Anh', status: 'used' },
};
