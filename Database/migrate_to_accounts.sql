-- =====================================================================
-- MIGRATION: gộp bảng `admins` + `users` cũ vào bảng `accounts` chung
-- =====================================================================
-- Cách chạy:
--   1. Chạy backend (DatVe-Backend) MỘT LẦN với spring.jpa.hibernate.ddl-auto=update
--      để Hibernate tự tạo bảng `accounts` (từ entity Account/Admin/User/BtcStaff mới).
--   2. Dừng backend lại.
--   3. Chạy file SQL này 1 LẦN DUY NHẤT trên database `ticketdb` để copy dữ liệu
--      cũ từ `admins`, `users` sang `accounts`.
--   4. Chạy lại backend bình thường.
--
-- Ghi chú: users và admins đang có id trùng nhau (đều bắt đầu từ 1),
-- nên khi gộp, id của user sẽ được dời thêm 100000 để không đụng id admin.
-- Đồng thời orders.user_id cũng được cập nhật lại cho khớp.
-- =====================================================================

START TRANSACTION;

-- 1. Copy admins -> accounts (giữ nguyên id)
INSERT INTO accounts (id, full_name, email, password, role)
SELECT id, full_name, email, password, 'ADMIN' FROM admins;

-- 2. Copy users -> accounts (dời id lên thêm 100000 để tránh trùng id admin)
INSERT INTO accounts (id, full_name, email, password, role)
SELECT id + 100000, full_name, email, password, 'USER' FROM users;

-- 3. Cập nhật lại orders.user_id cho khớp với id mới của user trong bảng accounts
UPDATE orders SET user_id = user_id + 100000;

-- 4. Trỏ lại khoá ngoại orders.user_id sang bảng accounts thay vì bảng users cũ
--    (tên constraint có thể khác trên máy bạn, kiểm tra bằng lệnh:
--     SHOW CREATE TABLE orders;  -- rồi sửa tên FK bên dưới cho đúng)
ALTER TABLE orders DROP FOREIGN KEY FK32ql8ubntj5uh44ph9659tiih;
ALTER TABLE orders ADD CONSTRAINT fk_orders_account
    FOREIGN KEY (user_id) REFERENCES accounts(id);

-- 5. Đảm bảo id tự tăng tiếp theo của accounts không bị trùng với dữ liệu vừa copy
ALTER TABLE accounts AUTO_INCREMENT = 200000;

COMMIT;

-- 6. (TUỲ CHỌN) Sau khi đã kiểm tra kỹ mọi thứ chạy ổn, có thể xoá 2 bảng cũ:
-- DROP TABLE admins;
-- DROP TABLE users;
