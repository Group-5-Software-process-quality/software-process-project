package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.OrderDTO;
import com.eventsphere.backend.entity.Order;

import java.util.List;

public interface OrderService {

    List<Order> getAll();

    Order create(OrderDTO dto);

    Order confirm(Long id);

    void delete(Long id);
}