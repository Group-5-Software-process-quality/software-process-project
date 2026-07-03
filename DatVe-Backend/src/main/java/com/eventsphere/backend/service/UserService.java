package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.UserDTO;
import com.eventsphere.backend.entity.User;

import java.util.List;

public interface UserService {

    List<User> getAll();

    User getById(Long id);

    User create(UserDTO dto);

    User update(Long id, UserDTO dto);

    void delete(Long id);

}