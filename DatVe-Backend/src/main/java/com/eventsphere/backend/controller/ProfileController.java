package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.ChangePasswordRequest;
import com.eventsphere.backend.dto.ProfileDTO;
import com.eventsphere.backend.dto.UpdateProfileRequest;
import com.eventsphere.backend.entity.User;
import com.eventsphere.backend.security.CurrentUserService;
import com.eventsphere.backend.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProfileController {

    private final ProfileService profileService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public ProfileDTO get(HttpServletRequest request) {
        User user = currentUserService.requireUser(request);
        return profileService.get(user);
    }

    @PutMapping
    public ProfileDTO update(@RequestBody UpdateProfileRequest req, HttpServletRequest request) {
        User user = currentUserService.requireUser(request);
        return profileService.update(user, req);
    }

    @PutMapping("/password")
    public void changePassword(@RequestBody ChangePasswordRequest req, HttpServletRequest request) {
        User user = currentUserService.requireUser(request);
        profileService.changePassword(user, req);
    }
}
