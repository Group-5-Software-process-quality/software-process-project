package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.EventDTO;
import com.eventsphere.backend.entity.Event;
import com.eventsphere.backend.entity.EventStatus;
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

    // Mặc định chỉ trả về sự kiện đã duyệt (APPROVED) -> dùng cho trang
    // Events Management của Admin và trang khách hàng, để sự kiện đang
    // PENDING/REJECTED/DRAFT không bị lộ ra trước khi Admin duyệt.
    // Có thể truyền ?status=PENDING / APPROVED / REJECTED / DRAFT để lọc
    // theo trạng thái cụ thể (dùng nội bộ nếu cần).
    @GetMapping
    public List<Event> getAll(@RequestParam(required = false) String status) {

        List<Event> all = eventService.getAll();

        EventStatus filterStatus = EventStatus.APPROVED;

        if (status != null && !status.isBlank()) {
            try {
                filterStatus = EventStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {
                // status không hợp lệ -> vẫn dùng mặc định APPROVED
            }
        }

        EventStatus finalFilterStatus = filterStatus;

        return all.stream()
                .filter(e -> e.getStatus() == finalFilterStatus)
                .toList();
    }

    // Toàn bộ sự kiện, không lọc trạng thái (dành cho Admin khi cần xem
    // đầy đủ cả PENDING/REJECTED/DRAFT/APPROVED trong cùng 1 danh sách).
    @GetMapping("/all")
    public List<Event> getAllRaw() {
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