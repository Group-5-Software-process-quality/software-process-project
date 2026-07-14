package com.eventsphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Bảng tài khoản dùng chung cho toàn hệ thống (Admin / User / BTC).
 * Dùng chiến lược SINGLE_TABLE: tất cả role nằm chung 1 bảng "accounts",
 * phân biệt nhau bằng cột "role" (discriminator).
 *
 * Admin, User, BtcStaff kế thừa từ đây nên toàn bộ code cũ
 * (AdminRepository, UserRepository, AdminController, UserController, Order...)
 * vẫn hoạt động bình thường, không cần sửa gì thêm.
 */
@Entity
@Table(name = "accounts")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "role", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String phone;

    /**
     * Token đăng nhập thật, được sinh (UUID) và lưu trong DB mỗi khi
     * đăng nhập thành công. Các API cần xác thực sẽ đọc header
     * "Authorization: Bearer <token>" và tra cứu tài khoản qua token này.
     */
    @JsonIgnore
    @Column(unique = true, length = 100)
    private String token;
}
