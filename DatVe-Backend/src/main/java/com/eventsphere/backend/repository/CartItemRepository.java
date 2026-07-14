package com.eventsphere.backend.repository;

import com.eventsphere.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserIdOrderByIdDesc(Long userId);

    Optional<CartItem> findByUserIdAndTicketTypeId(Long userId, Long ticketTypeId);

    void deleteByUserId(Long userId);
}
