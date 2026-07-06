package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.AdminDTO;
import com.eventsphere.backend.entity.Admin;
import com.eventsphere.backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    @Override
    public List<Admin> getAll() {
        return adminRepository.findAll();
    }

    @Override
    public Admin getById(Long id) {
        return adminRepository.findById(id).orElseThrow();
    }

    @Override
    public Admin create(AdminDTO dto) {

        Admin admin = new Admin();

        admin.setFullName(dto.getFullName());
        admin.setEmail(dto.getEmail());
        admin.setPassword(dto.getPassword());

        return adminRepository.save(admin);
    }

    @Override
    public Admin update(Long id, AdminDTO dto) {

        Admin admin = adminRepository.findById(id).orElseThrow();

        admin.setFullName(dto.getFullName());
        admin.setEmail(dto.getEmail());
        admin.setPassword(dto.getPassword());

        return adminRepository.save(admin);
    }

    @Override
    public void delete(Long id) {
        adminRepository.deleteById(id);
    }
}