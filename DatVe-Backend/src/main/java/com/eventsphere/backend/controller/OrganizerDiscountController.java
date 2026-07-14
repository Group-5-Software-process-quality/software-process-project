package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.OrganizerDiscountCreateRequest;
import com.eventsphere.backend.dto.OrganizerDiscountDTO;
import com.eventsphere.backend.entity.BtcStaff;
import com.eventsphere.backend.security.CurrentUserService;
import com.eventsphere.backend.service.OrganizerDiscountService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer/discounts")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrganizerDiscountController {

    private final OrganizerDiscountService organizerDiscountService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public List<OrganizerDiscountDTO> list(@RequestParam Long eventId, HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        return organizerDiscountService.list(btc, eventId);
    }

    @PostMapping
    public OrganizerDiscountDTO create(@RequestBody OrganizerDiscountCreateRequest req, HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        return organizerDiscountService.create(btc, req);
    }

    @PutMapping("/{id}/toggle")
    public OrganizerDiscountDTO toggle(@PathVariable Long id, HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        return organizerDiscountService.toggleActive(btc, id);
    }
}
