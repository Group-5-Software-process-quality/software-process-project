package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.MyOrderDTO;
import com.eventsphere.backend.entity.User;
import com.eventsphere.backend.security.CurrentUserService;
import com.eventsphere.backend.service.MyOrdersService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/my/orders")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MyOrdersController {

    private final MyOrdersService myOrdersService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public List<MyOrderDTO> list(HttpServletRequest request) {
        User user = currentUserService.requireUser(request);
        return myOrdersService.list(user);
    }
}
