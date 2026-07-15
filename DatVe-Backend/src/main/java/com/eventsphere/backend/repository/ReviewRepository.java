package com.eventsphere.backend.repository;
 
import com.eventsphere.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
 
import java.util.List;
 
public interface ReviewRepository extends JpaRepository<Review, Long> {
 
    List<Review> findByEventId(Long eventId);
 
    List<Review> findByEventIdOrderByCreatedAtDesc(Long eventId);
 
    long countByEventId(Long eventId);
 
    @Query("select avg(r.rating) from Review r where r.event.id = :eventId")
    Double averageRatingForEvent(@Param("eventId") Long eventId);
}