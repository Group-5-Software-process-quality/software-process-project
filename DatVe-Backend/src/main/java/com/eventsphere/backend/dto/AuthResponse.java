package com.eventsphere.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {

    private boolean success;
    private String message;

    private String token;
    private String role;   // ADMIN | USER | BTC
    private String name;
    private String email;

}
