package com.eventsphere.backend.entity;

import jakarta.persistence.*;

/**
 * Tài khoản quản trị (role = ADMIN).
 * Kế thừa Account -> dùng chung bảng "accounts".
 */
@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends Account {
}
