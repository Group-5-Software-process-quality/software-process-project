package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.AdminDTO;
import com.eventsphere.backend.dto.LoginRequest;
import com.eventsphere.backend.dto.LoginResponse;
import com.eventsphere.backend.entity.Admin;
import com.eventsphere.backend.repository.AdminRepository;
import com.eventsphere.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin("*")

public class AdminController {

    private final AdminRepository adminRepository;

    private final AdminService adminService;

    // ===========================
    // LOGIN
    // ===========================

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (admin == null) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Email not found")
                    .build();
        }

        if (!admin.getPassword().equals(request.getPassword())) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Wrong password")
                    .build();
        }

        return LoginResponse.builder()
                .success(true)
                .token("eventsphere-admin-token")
                .admin(LoginResponse.Admin.builder()
                        .name(admin.getFullName())
                        .email(admin.getEmail())
                        .build())
                .build();
    }

    // ===========================
    // CRUD ADMIN
    // ===========================

    @GetMapping
    public List<Admin> getAll() {
        return adminService.getAll();
    }

    @GetMapping("/{id}")
    public Admin getById(@PathVariable Long id) {
        return adminService.getById(id);
    }

    @PostMapping
    public Admin create(@RequestBody AdminDTO dto) {
        return adminService.create(dto);
    }

    @PutMapping("/{id}")
    public Admin update(@PathVariable Long id,
                        @RequestBody AdminDTO dto) {
        return adminService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        adminService.delete(id);
    }

}