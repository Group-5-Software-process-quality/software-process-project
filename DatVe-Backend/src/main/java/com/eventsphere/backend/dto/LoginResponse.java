package com.eventsphere.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {

    private boolean success;
    private String token;
    private Admin admin;
    private String message;

    @Data
    @Builder
    public static class Admin{
        private String name;
        private String email;
    }

}