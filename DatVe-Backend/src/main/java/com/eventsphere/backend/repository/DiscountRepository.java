package com.eventsphere.backend.repository;
 
import com.eventsphere.backend.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
 
import java.util.List;
import java.util.Optional;
 
public interface DiscountRepository extends JpaRepository<Discount, Long> {
 
    List<Discount> findByEventId(Long eventId);
 
    List<Discount> findByEventIdOrderByIdDesc(Long eventId);
 
    Optional<Discount> findByCode(String code);
}
 