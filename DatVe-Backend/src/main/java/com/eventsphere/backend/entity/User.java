package com.eventsphere.backend.entity;

import jakarta.persistence.*;

/**
 * Tài khoản khách hàng (role = USER).
 * Kế thừa Account -> dùng chung bảng "accounts".
 */
@Entity
@DiscriminatorValue("USER")
public class User extends Account {
}
