package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.EventDTO;
import com.eventsphere.backend.entity.Event;

import java.util.List;

public interface EventService {

    List<Event> getAll();

    Event getById(Long id);

    Event create(EventDTO dto);

    Event update(Long id, EventDTO dto);

    void delete(Long id);

}