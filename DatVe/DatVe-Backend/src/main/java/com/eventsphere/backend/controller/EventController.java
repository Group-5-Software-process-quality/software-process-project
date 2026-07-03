package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.EventDTO;
import com.eventsphere.backend.entity.Event;
import com.eventsphere.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<Event> getAll() {
        return eventService.getAll();
    }

    @GetMapping("/{id}")
    public Event getById(@PathVariable Long id) {
        return eventService.getById(id);
    }

    @PostMapping
    public Event create(@RequestBody EventDTO dto) {
        return eventService.create(dto);
    }

    @PutMapping("/{id}")
    public Event update(@PathVariable Long id,
                        @RequestBody EventDTO dto) {
        return eventService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        eventService.delete(id);
    }

}