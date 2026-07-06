package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.AdminDTO;
import com.eventsphere.backend.entity.Admin;

import java.util.List;

public interface AdminService {

    List<Admin> getAll();

    Admin getById(Long id);

    Admin create(AdminDTO dto);

    Admin update(Long id, AdminDTO dto);

    void delete(Long id);

}