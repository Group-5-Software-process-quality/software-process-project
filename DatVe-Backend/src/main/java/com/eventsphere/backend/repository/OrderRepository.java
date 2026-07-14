package com.eventsphere.backend.repository;

import com.eventsphere.backend.entity.Order;
import com.eventsphere.backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findByEventIdOrderByCreatedAtDesc(Long eventId);

    List<Order> findByEvent_OrganizerIdOrderByCreatedAtDesc(Long organizerId);
}
