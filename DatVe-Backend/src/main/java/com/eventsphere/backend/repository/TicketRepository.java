package com.eventsphere.backend.repository;
 
import com.eventsphere.backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
 
import java.util.List;
import java.util.Optional;
 
public interface TicketRepository extends JpaRepository<Ticket, Long> {
 
    List<Ticket> findByOrderId(Long orderId);
 
    Optional<Ticket> findByCode(String code);
}
 