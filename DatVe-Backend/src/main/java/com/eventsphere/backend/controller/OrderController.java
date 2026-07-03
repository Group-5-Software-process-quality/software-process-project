package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.OrderDTO;
import com.eventsphere.backend.entity.Order;
import com.eventsphere.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public List<Order> getAll() {
        return orderService.getAll();
    }

    @PostMapping
    public Order create(@RequestBody OrderDTO dto) {
        return orderService.create(dto);
    }

    @PutMapping("/{id}/confirm")
    public Order confirm(@PathVariable Long id) {
        return orderService.confirm(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        orderService.delete(id);
    }
}