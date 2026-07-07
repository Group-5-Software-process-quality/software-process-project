# 🎟️ EventSphere - Event Ticket Management System

EventSphere là hệ thống quản lý và đặt vé sự kiện được xây dựng bằng **Spring Boot**, **MySQL**, **HTML/CSS/JavaScript**.

Hệ thống gồm:

- Website quản trị (Admin)
- Quản lý người dùng
- Quản lý sự kiện
- Quản lý đơn đặt vé
- Thống kê doanh thu
- Đăng nhập Admin
- Quên mật khẩu bằng OTP gửi qua Gmail

---

# Công nghệ sử dụng

## Backend

- Java 21
- Spring Boot 3.5
- Spring Data JPA
- Spring Security
- Spring Mail
- Maven

## Database

- MySQL 8

## Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Chart.js
- Font Awesome

---

# Yêu cầu

- Java JDK 21
- Maven
- MySQL 8+
- IntelliJ IDEA hoặc Eclipse
- VS Code (Frontend)

---

# Cấu trúc dự án

```
DatVe
│
├── DatVe-Backend
│   ├── controller
│   ├── entity
│   ├── repository
│   ├── service
│   ├── dto
│   └── resources
│
└── DatVe-Frontend
    ├── admin
    ├── css
    ├── js
    ├── images
    └── pages
```

---

# Tạo Database

Tạo database

```sql
CREATE DATABASE ticketdb;
```

Sau đó import dữ liệu hoặc chạy các câu lệnh INSERT.

---

# Cấu hình Database

Mở file

```
src/main/resources/application.properties
```

Sửa:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ticketdb
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

---

# Cấu hình Gmail OTP

Trong

```
application.properties
```

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587

spring.mail.username=YOUR_GMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD

spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

Lưu ý:

Không dùng mật khẩu Gmail.

Phải tạo **App Password** của Google.

---

# Chạy Backend

Mở project bằng IntelliJ.

Chạy

```
DatVeBackendApplication.java
```

Hoặc

```
mvn spring-boot:run
```

Sau khi chạy thành công:

```
http://localhost:8080
```

---

# Chạy Frontend

Mở thư mục Frontend bằng VS Code.

Khởi động Live Server.

Hoặc mở

```
login.html
```

Website:

```
http://127.0.0.1:5500
```

---

# Tài khoản Admin

Ví dụ

```
Email:
admin@gmail.com

Password:
123456
```

Hoặc dùng tài khoản đã thêm trong database.

---

# Chức năng

## Admin

- Đăng nhập
- Đăng xuất
- Quên mật khẩu
- Nhận OTP qua Gmail
- Đổi mật khẩu

---

## Users

- Xem danh sách
- Thêm
- Sửa
- Xóa
- Khóa tài khoản

---

## Events

- Xem danh sách
- Thêm sự kiện
- Cập nhật
- Xóa
- Upload banner

---

## Orders

- Danh sách đơn hàng
- Trạng thái thanh toán
- Phương thức thanh toán
- Tổng tiền

---

## Statistics

- Tổng doanh thu
- Tổng đơn hàng
- Paid Orders
- Pending Orders
- Biểu đồ doanh thu
- Biểu đồ trạng thái đơn hàng

---

# API

## Admin

```
POST /api/admin/login
GET /api/admin
POST /api/admin
PUT /api/admin/{id}
DELETE /api/admin/{id}
```

---

## Users

```
GET /api/users
POST /api/users
PUT /api/users/{id}
DELETE /api/users/{id}
```

---

## Events

```
GET /api/events
POST /api/events
PUT /api/events/{id}
DELETE /api/events/{id}
```

---

## Orders

```
GET /api/orders
POST /api/orders
PUT /api/orders/{id}
DELETE /api/orders/{id}
```

---

## Forgot Password

```
POST /api/auth/forgot-password
```

Gửi OTP đến Gmail.

```
POST /api/auth/verify-otp
```

Xác thực OTP.

```
POST /api/auth/reset-password
```

Đổi mật khẩu.

---

# Thống kê

Dashboard hiển thị:

- Tổng doanh thu
- Tổng đơn hàng
- Paid Orders
- Pending Orders
- Revenue Chart
- Order Status Chart

---

# Một số hình ảnh

- Login
- Dashboard
- User Management
- Event Management
- Order Management
- Statistics
- Forgot Password

(Có thể thêm ảnh chụp màn hình tại đây)

---

Nhóm 5:Dũng,Cường,Khoa,Thịnh,Thanh

EventSphere - Event Ticket Management System
