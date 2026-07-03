package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.OrderDTO;
import com.eventsphere.backend.entity.Event;
import com.eventsphere.backend.entity.Order;
import com.eventsphere.backend.entity.OrderStatus;
import com.eventsphere.backend.entity.User;
import com.eventsphere.backend.repository.EventRepository;
import com.eventsphere.backend.repository.OrderRepository;
import com.eventsphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final UserRepository userRepository;

    private final EventRepository eventRepository;

    @Override
    public List<Order> getAll() {

        return orderRepository.findAll();

    }

    @Override
    public Order create(OrderDTO dto) {

        User user =
                userRepository.findById(dto.getUserId()).orElseThrow();

        Event event =
                eventRepository.findById(dto.getEventId()).orElseThrow();

        Order order = new Order();

        order.setUser(user);

        order.setEvent(event);

        order.setQuantity(dto.getQuantity());

        order.setPaymentMethod(dto.getPaymentMethod());

        order.setStatus(OrderStatus.PENDING);

        order.setPaymentStatus("UNPAID");

        order.setCreatedAt(LocalDateTime.now());

        order.setTotalAmount(

                dto.getQuantity() * event.getPrice()

        );

        return orderRepository.save(order);

    }

    @Override
    public Order confirm(Long id) {

        Order order = orderRepository
                .findById(id)
                .orElseThrow();

        order.setStatus(OrderStatus.PAID);

        order.setPaymentStatus("PAID");

        return orderRepository.save(order);

    }

    @Override
    public void delete(Long id) {

        orderRepository.deleteById(id);

    }
}
