package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.*;
import com.eventsphere.backend.entity.BtcStaff;
import com.eventsphere.backend.security.CurrentUserService;
import com.eventsphere.backend.service.OrganizerEventService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * API dành cho BTC quản lý sự kiện của chính họ, dùng bởi FE-BTC
 * (thay thế hoàn toàn dữ liệu mock ORG_EVENTS trước đây).
 */
@RestController
@RequestMapping("/api/organizer/events")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrganizerEventController {

    private final OrganizerEventService organizerEventService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public List<OrganizerEventDTO> listMine(HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        return organizerEventService.listMine(btc);
    }

    @GetMapping("/{id}")
    public OrganizerEventDTO getOne(@PathVariable Long id, HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        return organizerEventService.getMine(btc, id);
    }

    @PostMapping
    public OrganizerEventDTO create(@RequestBody OrganizerEventUpsertRequest req, HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        return organizerEventService.create(btc, req);
    }

    @PutMapping("/{id}")
    public OrganizerEventDTO update(@PathVariable Long id, @RequestBody OrganizerEventUpsertRequest req, HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        return organizerEventService.update(btc, id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        organizerEventService.delete(btc, id);
    }

    @PostMapping("/{id}/submit")
    public void submit(@PathVariable Long id, HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        organizerEventService.submitForApproval(btc, id);
    }

    @PostMapping("/{id}/ticket-types")
    public TicketTypeDTO addTicketType(@PathVariable Long id, @RequestBody TicketTypeUpsertRequest req, HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        return organizerEventService.addTicketType(btc, id, req);
    }

    @DeleteMapping("/ticket-types/{ticketTypeId}")
    public void deleteTicketType(@PathVariable Long ticketTypeId, HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        organizerEventService.deleteTicketType(btc, ticketTypeId);
    }

    @GetMapping("/dashboard")
    public OrganizerDashboardDTO dashboard(HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        return organizerEventService.dashboard(btc);
    }
}
