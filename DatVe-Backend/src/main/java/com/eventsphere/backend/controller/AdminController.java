package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.LoginRequest;
import com.eventsphere.backend.dto.LoginResponse;
import com.eventsphere.backend.entity.User;
import com.eventsphere.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminController {

    private final UserRepository userRepository;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if(user == null){
            return LoginResponse.builder()
                    .success(false)
                    .message("Email not found")
                    .build();
        }

        if(!user.getPassword().equals(request.getPassword())){
            return LoginResponse.builder()
                    .success(false)
                    .message("Wrong password")
                    .build();
        }

        return LoginResponse.builder()
                .success(true)
                .token("eventsphere-admin-token")
                .admin(LoginResponse.Admin.builder()
                        .name(user.getFullName())
                        .email(user.getEmail())
                        .build())
                .build();

    }

}