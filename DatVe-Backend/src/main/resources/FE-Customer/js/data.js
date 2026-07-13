/**
 * data.js — Dữ liệu MẪU (mock) cho toàn bộ frontend-customer.
 * ------------------------------------------------------------------
 * File này đứng thay cho việc gọi API thật. Sau này khi nối backend,
 * bạn chỉ cần sửa TRONG FILE NÀY (hoặc thay các hằng số bên dưới bằng
 * kết quả fetch() từ Spring Boot) — các file index.js/cart.js/... khác
 * không cần đổi vì chúng chỉ đọc MOCK_EVENTS, MOCK_CART, ... theo tên.
 * ------------------------------------------------------------------
 */

const MOCK_EVENTS = [
  { id: 1, title: 'Đêm nhạc Acoustic Sài Gòn', category: 'Âm nhạc', icon: 'fa-music', grad: 'grad-1', location: 'Nhà hát Hòa Bình, TP.HCM', date: '2026-08-14T19:30:00', price: 250000, capacity: 300, sold: 214, rating: 4.8, reviewCount: 36,
    description: 'Một đêm nhạc acoustic ấm áp với các ca khúc Việt Nam được phối lại mộc mạc, gần gũi. Không gian nhà hát giao lưu trực tiếp cùng nghệ sĩ sau chương trình.',
    ticketTypes: [ { id: 't1', name: 'Vé Thường', price: 250000, total: 200, sold: 168 }, { id: 't2', name: 'Vé VIP (ghế đầu)', price: 450000, total: 100, sold: 46 } ] },
  { id: 2, title: 'Hội thảo Chuyển đổi số 2026', category: 'Hội thảo', icon: 'fa-briefcase', grad: 'grad-3', location: 'Trung tâm Hội nghị Quốc gia, Hà Nội', date: '2026-08-20T08:30:00', price: 0, capacity: 500, sold: 388, rating: 4.5, reviewCount: 21,
    description: 'Hội thảo quy tụ các chuyên gia công nghệ chia sẻ về chuyển đổi số cho doanh nghiệp vừa và nhỏ, kèm khu vực triển lãm giải pháp phần mềm.',
    ticketTypes: [ { id: 't1', name: 'Vé tham dự', price: 0, total: 500, sold: 388 } ] },
  { id: 3, title: 'Giải chạy Marathon Đà Nẵng', category: 'Thể thao', icon: 'fa-person-running', grad: 'grad-5', location: 'Cầu Rồng, Đà Nẵng', date: '2026-09-06T05:00:00', price: 350000, capacity: 2000, sold: 1540, rating: 4.9, reviewCount: 112,
    description: 'Giải chạy phong trào ven sông Hàn với 3 cự ly 5km/10km/21km, race-kit đầy đủ áo, bib, huy chương hoàn thành và tiếp nước dọc đường chạy.',
    ticketTypes: [ { id: 't1', name: 'Cự ly 5km', price: 250000, total: 800, sold: 690 }, { id: 't2', name: 'Cự ly 10km', price: 350000, total: 800, sold: 620 }, { id: 't3', name: 'Cự ly 21km (Half Marathon)', price: 550000, total: 400, sold: 230 } ] },
  { id: 4, title: 'Triển lãm Nghệ thuật Đương đại', category: 'Nghệ thuật', icon: 'fa-palette', grad: 'grad-6', location: 'Bảo tàng Mỹ thuật, TP.HCM', date: '2026-08-28T09:00:00', price: 100000, capacity: 400, sold: 96, rating: 4.6, reviewCount: 14,
    description: 'Không gian trưng bày hơn 40 tác phẩm của các nghệ sĩ trẻ Việt Nam, kèm buổi trò chuyện cùng giám tuyển vào cuối tuần.',
    ticketTypes: [ { id: 't1', name: 'Vé vào cửa', price: 100000, total: 400, sold: 96 } ] },
  { id: 5, title: 'Workshop Nhiếp ảnh Cơ bản', category: 'Workshop', icon: 'fa-camera', grad: 'grad-4', location: 'Toong Coworking, Hà Nội', date: '2026-08-18T13:30:00', price: 180000, capacity: 40, sold: 40, rating: 4.7, reviewCount: 9,
    description: 'Buổi workshop 3 giờ dành cho người mới bắt đầu: bố cục, ánh sáng và thực hành chụp ngay tại lớp cùng máy ảnh mượn miễn phí.',
    ticketTypes: [ { id: 't1', name: 'Vé tham dự (kèm máy ảnh mượn)', price: 180000, total: 40, sold: 40 } ] },
  { id: 6, title: 'Đêm hài kịch Sài Gòn', category: 'Giải trí', icon: 'fa-masks-theater', grad: 'grad-2', location: 'Nhà hát Bến Thành, TP.HCM', date: '2026-09-02T20:00:00', price: 200000, capacity: 250, sold: 150, rating: 4.4, reviewCount: 27,
    description: 'Chuỗi tiểu phẩm hài kịch tình huống với sự góp mặt của các nghệ sĩ khách mời, phù hợp cho một buổi tối thư giãn cùng bạn bè.',
    ticketTypes: [ { id: 't1', name: 'Vé Thường', price: 200000, total: 200, sold: 130 }, { id: 't2', name: 'Vé VIP', price: 350000, total: 50, sold: 20 } ] },
];

const MOCK_REVIEWS = [
  { name: 'Nguyễn Minh Anh', rating: 5, comment: 'Chương trình rất hay, âm thanh và ánh sáng chuyên nghiệp. Chắc chắn sẽ quay lại lần sau!' },
  { name: 'Trần Quốc Bảo', rating: 4, comment: 'Sự kiện tổ chức tốt, chỉ hơi đông vào giờ cao điểm nên check-in hơi chậm.' },
  { name: 'Lê Thị Hồng', rating: 5, comment: 'Trải nghiệm tuyệt vời, nhân viên hỗ trợ nhiệt tình.' },
];

const MOCK_USER = { name: 'Phạm Thu Trang', email: 'thu.trang@example.com', phone: '0905 123 456' };

const MOCK_CART = [
  { id: 'c1', eventId: 1, eventTitle: 'Đêm nhạc Acoustic Sài Gòn', ticketType: 'Vé VIP (ghế đầu)', date: '2026-08-14T19:30:00', price: 450000, qty: 1, grad: 'grad-1', icon: 'fa-music' },
  { id: 'c2', eventId: 3, eventTitle: 'Giải chạy Marathon Đà Nẵng', ticketType: 'Cự ly 10km', date: '2026-09-06T05:00:00', price: 350000, qty: 1, grad: 'grad-5', icon: 'fa-person-running' },
];

const MOCK_ORDERS = [
  {
    id: 'EVP-20260710-0142', date: '2026-07-10T14:22:00', status: 'paid', total: 500000,
    items: [{ eventTitle: 'Đêm nhạc Acoustic Sài Gòn', ticketType: 'Vé thường', qty: 2, tickets: [
      { code: 'EVP-8F2K9QX1', status: 'valid' }, { code: 'EVP-8F2K9QX2', status: 'valid' },
    ] }],
  },
  {
    id: 'EVP-20260628-0091', date: '2026-06-28T09:05:00', status: 'used', total: 350000,
    items: [{ eventTitle: 'Giải chạy Marathon Đà Nẵng', ticketType: 'Vé race-kit', qty: 1, tickets: [
      { code: 'EVP-7A1M3PZ0', status: 'used' },
    ] }],
  },
  {
    id: 'EVP-20260601-0057', date: '2026-06-01T18:40:00', status: 'cancelled', total: 180000,
    items: [{ eventTitle: 'Workshop Nhiếp ảnh Cơ bản', ticketType: 'Vé tham dự', qty: 1, tickets: [
      { code: 'EVP-5T9C2LR7', status: 'cancelled' },
    ] }],
  },
];
