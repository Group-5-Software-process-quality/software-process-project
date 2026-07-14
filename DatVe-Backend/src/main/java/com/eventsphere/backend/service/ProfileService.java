package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.ChangePasswordRequest;
import com.eventsphere.backend.dto.ProfileDTO;
import com.eventsphere.backend.dto.UpdateProfileRequest;
import com.eventsphere.backend.entity.User;
import com.eventsphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileDTO get(User user) {
        return ProfileDTO.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();
    }

    public ProfileDTO update(User user, UpdateProfileRequest req) {
        if (req.getFullName() != null && !req.getFullName().isBlank()) {
            user.setFullName(req.getFullName().trim());
        }
        user.setPhone(req.getPhone());

        user = userRepository.save(user);

        return get(user);
    }

    public void changePassword(User user, ChangePasswordRequest req) {
        if (req.getNewPassword() == null || req.getNewPassword().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu mới phải có ít nhất 6 ký tự");
        }

        boolean ok = user.getPassword() != null && user.getPassword().startsWith("$2")
                ? passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())
                : java.util.Objects.equals(req.getCurrentPassword(), user.getPassword());

        if (!ok) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không đúng");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}
