# EventSphere - Event Ticket Management System

## Giới thiệu

EventSphere là hệ thống quản lý bán vé sự kiện được phát triển bằng Spring Boot, MySQL và HTML/CSS/JavaScript.

Hệ thống giúp quản trị viên:

- Đăng nhập hệ thống
- Quản lý User
- Quản lý Event
- Quản lý Order
- Thống kê doanh thu
- Quên mật khẩu bằng OTP gửi Gmail

---

# Công nghệ sử dụng

## Backend

- Java 21
- Spring Boot 3.5
- Spring Data JPA
- Spring Security
- Spring Mail
- Maven

## Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Chart.js

## Database

- MySQL 8

---

# Cấu trúc dự án

DatVe

├── DatVe-Backend

│ ├── controller

│ ├── entity

│ ├── repository

│ ├── service

│ └── dto

│

└── DatVe-Frontend

├── css

├── js

├── images

└── pages

---

# Hướng dẫn chạy

## Bước 1

Clone project

```bash
git clone https://github.com/your-account/EventSphere.git
```

## Bước 2

Tạo database

```sql
CREATE DATABASE ticketdb;
```

## Bước 3

Cấu hình application.properties

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ticketdb
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

## Bước 4

Cấu hình Gmail

```properties
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

## Bước 5

Chạy Backend

```
DatVeBackendApplication.java
```

hoặc

```
mvn spring-boot:run
```

## Bước 6

Mở Frontend

```
login.html
```

bằng Live Server.

Backend

```
http://localhost:8080
```

Frontend

```
http://127.0.0.1:5500
```

---

# Chức năng

- Login Admin
- Forgot Password OTP
- CRUD User
- CRUD Event
- CRUD Order
- Dashboard
- Statistics
