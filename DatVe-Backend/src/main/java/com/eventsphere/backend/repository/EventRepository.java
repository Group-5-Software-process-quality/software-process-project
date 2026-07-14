package com.eventsphere.backend.repository;

import com.eventsphere.backend.entity.Event;
import com.eventsphere.backend.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatusOrderByEventDateAsc(EventStatus status);

    List<Event> findByOrganizerIdOrderByCreatedAtDesc(Long organizerId);
}
