package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.ReportSummaryDTO;
import com.eventsphere.backend.entity.BtcStaff;
import com.eventsphere.backend.security.CurrentUserService;
import com.eventsphere.backend.service.ReportService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizer/reports")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReportController {

    private final ReportService reportService;
    private final CurrentUserService currentUserService;

    @GetMapping("/{eventId}")
    public ReportSummaryDTO summary(@PathVariable Long eventId, HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        return reportService.summary(btc, eventId);
    }
}
