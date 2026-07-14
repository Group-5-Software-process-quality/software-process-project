package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.*;
import com.eventsphere.backend.entity.User;
import com.eventsphere.backend.security.CurrentUserService;
import com.eventsphere.backend.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CartController {

    private final CartService cartService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public List<CartItemDTO> list(HttpServletRequest request) {
        User user = currentUserService.requireUser(request);
        return cartService.list(user);
    }

    @PostMapping
    public CartItemDTO add(@RequestBody AddCartRequest req, HttpServletRequest request) {
        User user = currentUserService.requireUser(request);
        return cartService.add(user, req);
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id, HttpServletRequest request) {
        User user = currentUserService.requireUser(request);
        cartService.remove(user, id);
    }

    @GetMapping("/discounts/validate")
    public DiscountValidateResponse validateDiscount(@RequestParam String code) {
        return cartService.validateDiscount(code);
    }

    @PostMapping("/checkout")
    public CheckoutResponse checkout(@RequestBody CheckoutRequest req, HttpServletRequest request) {
        User user = currentUserService.requireUser(request);
        return cartService.checkout(user, req);
    }
}
