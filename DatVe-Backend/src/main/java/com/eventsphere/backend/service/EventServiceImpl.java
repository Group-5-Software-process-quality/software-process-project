package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.EventDTO;
import com.eventsphere.backend.entity.Event;
import com.eventsphere.backend.entity.EventStatus;
import com.eventsphere.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    public List<Event> getAll() {
        return eventRepository.findAll();
    }

    @Override
    public Event getById(Long id) {
        return eventRepository.findById(id).orElseThrow();
    }

    @Override
    public Event create(EventDTO dto) {

        Event event = new Event();

        event.setTitle(dto.getTitle());
        event.setLocation(dto.getLocation());
        event.setEventDate(dto.getEventDate());
        event.setPrice(dto.getPrice());
        event.setCapacity(dto.getCapacity());
        event.setStatus(EventStatus.APPROVED);
        event.setCreatedAt(LocalDateTime.now());

        return eventRepository.save(event);
    }

    @Override
    public Event update(Long id, EventDTO dto) {

        Event event = eventRepository.findById(id).orElseThrow();

        event.setTitle(dto.getTitle());
        event.setLocation(dto.getLocation());
        event.setEventDate(dto.getEventDate());
        event.setPrice(dto.getPrice());
        event.setCapacity(dto.getCapacity());

        return eventRepository.save(event);
    }

    @Override
    public void delete(Long id) {
        eventRepository.deleteById(id);
    }
}