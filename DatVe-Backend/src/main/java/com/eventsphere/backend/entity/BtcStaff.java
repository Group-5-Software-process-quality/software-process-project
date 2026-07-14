package com.eventsphere.backend.entity;

import jakarta.persistence.*;

/**
 * Tài khoản nhân viên bán tổ chức sự kiện (role = BTC).
 * Hiện tại chỉ dùng để đăng ký/đăng nhập; các nghiệp vụ riêng của BTC
 * (quản lý sự kiện của BTC, duyệt vé...) sẽ được bổ sung sau.
 * Kế thừa Account -> dùng chung bảng "accounts".
 */
@Entity
@DiscriminatorValue("BTC")
public class BtcStaff extends Account {
}
