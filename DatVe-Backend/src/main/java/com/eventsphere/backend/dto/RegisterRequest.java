package com.eventsphere.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;

    /**
     * Vai trò được chọn lúc đăng ký: "ADMIN", "USER" hoặc "BTC".
     */
    private String role;

}
