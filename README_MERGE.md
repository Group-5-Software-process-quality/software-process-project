# EventSphere - Project đã gộp (Admin + Customer + BTC)

## 1. Những gì đã thay đổi

- **Gộp 3 project** (Admin, Customer, BTC) vào **1 backend Spring Boot duy nhất**
  (`DatVe-Backend`), dùng chung 1 database `ticketdb`.
- Front-end của từng phần được phục vụ tại các đường dẫn riêng bởi cùng 1 server:
  | Phần      | Thư mục nguồn                     | Truy cập tại                     |
  |-----------|------------------------------------|-----------------------------------|
  | Admin     | `DatVe-Backend/.../static/`        | `http://localhost:8080/login.html`, `/dashboard.html`... |
  | Customer  | `DatVe-Backend/.../FE-Customer/`   | `http://localhost:8080/customer/index.html` |
  | BTC       | `DatVe-Backend/.../FE-BTC/`        | `http://localhost:8080/btc/index.html` |

  (Cấu hình phục vụ file tĩnh nằm trong `config/WebConfig.java`)

- **Hệ thống đăng nhập / đăng ký dùng chung** cho cả 3 role:
  - Bảng database cũ `admins` + `users` được gộp thành **1 bảng `accounts`**
    có cột `role` (`ADMIN` / `USER` / `BTC`) — xem entity `Account.java`,
    `Admin.java`, `User.java`, `BtcStaff.java` (dùng JPA
    `SINGLE_TABLE` inheritance nên toàn bộ code cũ như `AdminRepository`,
    `UserRepository`, `AdminController`, `UserController`, `Order`... **không cần sửa gì thêm**, vẫn chạy đúng).
  - API mới, dùng chung cho cả 3 role, tại `AuthController.java`:
    - `POST /api/auth/register` — body: `{ fullName, email, password, role }`
      với `role` là `"ADMIN"`, `"USER"` hoặc `"BTC"`.
    - `POST /api/auth/login` — body: `{ email, password }`. Trả về
      `{ success, token, role, name, email, message }`. Hệ thống tự nhận
      diện role, front-end tự điều hướng đúng trang.
  - Trang `static/login.html` giờ là **trang đăng nhập chung**, và có thêm
    trang mới `static/register.html` cho phép **chọn 1 trong 3 loại tài
    khoản (Admin / User / BTC)** khi đăng ký.
  - Sau khi đăng nhập, `login.js` tự chuyển hướng:
    - `ADMIN` → `dashboard.html`
    - `USER` → `/customer/index.html`
    - `BTC` → `/btc/index.html`
  - Mật khẩu tài khoản **mới** được mã hoá bằng BCrypt. Tài khoản **cũ**
    (mật khẩu chưa mã hoá) vẫn đăng nhập được bình thường và sẽ tự động
    được nâng cấp sang mật khẩu mã hoá ngay sau lần đăng nhập thành công đầu tiên.

## 2. Việc cần làm 1 lần khi đưa dữ liệu cũ vào

Vì đổi từ 2 bảng `admins`/`users` sang 1 bảng `accounts`, dữ liệu cũ cần
được migrate 1 lần:

1. Chạy backend 1 lần (với `spring.jpa.hibernate.ddl-auto=update`) để
   Hibernate tự tạo bảng `accounts` mới.
2. Dừng backend, chạy file `Database/migrate_to_accounts.sql` (1 lần duy nhất)
   để copy dữ liệu từ `admins` + `users` cũ sang `accounts`.
3. Chạy lại backend bình thường.

File SQL có ghi chú chi tiết từng bước bên trong.

## 3. BTC (bổ sung sau)

- Front-end `FE-BTC` đã được đưa vào project và phục vụ tại `/btc/`.
- Bảng/role `BTC` trong hệ thống tài khoản đã sẵn sàng (đăng ký/đăng nhập
  hoạt động được ngay).
- Các nghiệp vụ riêng của BTC (API quản lý sự kiện riêng cho BTC, duyệt
  vé, thống kê riêng...) **chưa được nối vào backend** — sẽ làm ở bước sau
  như đã trao đổi.

## 4. Lưu ý

- `application.properties` của 3 project cũ đều trỏ chung 1 database
  `ticketdb` sẵn rồi nên không cần đổi gì thêm.
- Do gộp 3 project vào 1 Git repo, nếu bạn dùng Git, nhớ commit project
  này thay cho 3 project cũ.
