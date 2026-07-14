# Chuyển toàn bộ sang Spring Boot + MySQL, bỏ API giả

## Tóm tắt
- Backend (`DatVe-Backend`) đã sẵn là Spring Boot + MySQL từ trước (Admin).
- Đã **xóa hoàn toàn** `FE-Customer/js/data.js` và `FE-BTC/js/data.js` (dữ liệu mock).
- Toàn bộ trang Customer và BTC giờ gọi API thật qua `js/api.js` (Bearer token).
- Đăng nhập giờ sinh **token thật** (UUID, lưu trong DB ở cột `accounts.token`),
  thay vì chuỗi cố định trước đây. `password` và `token` được `@JsonIgnore` để
  không bị lộ qua các API trả entity trực tiếp (vd Admin xem đơn hàng/user).

## Entity mới
- `TicketType` — loại vé theo từng sự kiện (giá, tổng số, đã bán)
- `Discount` — mã giảm giá theo sự kiện
- `Review` — đánh giá sự kiện
- `CartItem` — giỏ hàng của khách
- `Ticket` — mã vé điện tử (dùng cho check-in)
- `Event` mở rộng thêm: description, category, icon, gradClass, status
  (DRAFT/PENDING/APPROVED/REJECTED), rejectionReason, organizer, createdAt.
  Sự kiện Admin tạo trực tiếp mặc định `APPROVED`.
- `Order` mở rộng thêm: ticketType, orderCode (mã nhóm cho 1 lần thanh toán
  giỏ hàng), discountCode, discountAmount.
- `Account` mở rộng thêm: phone, token.

## API mới
**Customer (public/khách hàng):**
- `GET /api/public/events` (q, category, location, dateFrom)
- `GET /api/public/events/{id}`
- `GET/POST /api/public/events/{id}/reviews`
- `GET/POST/DELETE /api/cart`, `GET /api/cart/discounts/validate`, `POST /api/cart/checkout`
- `GET /api/my/orders`
- `GET/PUT /api/profile`, `PUT /api/profile/password`

**BTC (tổ chức sự kiện):**
- `GET/POST/PUT/DELETE /api/organizer/events`, `POST /{id}/submit`,
  `POST /{id}/ticket-types`, `DELETE /ticket-types/{id}`, `GET /dashboard`
- `GET/POST /api/organizer/discounts`, `PUT /{id}/toggle`
- `POST /api/organizer/checkin`
- `GET /api/organizer/reports/{eventId}`

## Việc BTC cần làm để có sự kiện lên trang Customer
1. BTC tạo sự kiện (`DRAFT`) → thêm loại vé → bấm "Gửi duyệt" (`PENDING`).
2. **Admin cần duyệt** sự kiện đó (đổi status sang `APPROVED`) thì mới hiện
   ở trang Customer. **Admin FE (`static/`) hiện chưa có UI duyệt/từ chối
   sự kiện BTC** — cần bổ sung 1 nút "Duyệt / Từ chối" trong trang quản lý
   sự kiện Admin, gọi PUT tới `/api/events/{id}` (đã có sẵn, chỉ cần set
   `status`/`rejectionReason` trong `EventDTO`/`EventServiceImpl.update`).

## Giả định / đơn giản hoá
- Thanh toán giỏ hàng được coi là thành công ngay (chưa nối cổng thanh toán
  thật), trạng thái đơn hàng set thẳng `PAID`.
- Mã giảm giá là duy nhất toàn hệ thống, gắn với 1 sự kiện; khi checkout chỉ
  áp dụng cho các dòng thuộc đúng sự kiện đó.
- Chưa build lại module Admin (đã dùng API thật từ trước, không đổi).

## Cần làm trước khi chạy
```bash
cd DatVe-Backend
mvn spring-boot:run
```
Đảm bảo MySQL đang chạy với DB `ticketdb` theo `application.properties`.
Do `ddl-auto=update`, các bảng/cột mới sẽ tự tạo khi chạy lần đầu.
