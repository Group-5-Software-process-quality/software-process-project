package com.eventsphere.backend.repository;

import com.eventsphere.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByEventIdOrderByCreatedAtDesc(Long eventId);

    long countByEventId(Long eventId);

    @Query("select avg(r.rating) from Review r where r.event.id = :eventId")
    Double averageRatingForEvent(Long eventId);
}
