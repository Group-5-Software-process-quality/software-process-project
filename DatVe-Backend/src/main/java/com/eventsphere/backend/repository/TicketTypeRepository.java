package com.eventsphere.backend.repository;

import com.eventsphere.backend.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {

    List<TicketType> findByEventIdOrderByIdAsc(Long eventId);

    List<TicketType> findByEventIdIn(List<Long> eventIds);
}
