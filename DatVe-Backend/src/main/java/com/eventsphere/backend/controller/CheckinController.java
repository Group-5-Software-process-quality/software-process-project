package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.CheckinRequest;
import com.eventsphere.backend.dto.CheckinResultDTO;
import com.eventsphere.backend.entity.BtcStaff;
import com.eventsphere.backend.security.CurrentUserService;
import com.eventsphere.backend.service.CheckinService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizer/checkin")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CheckinController {

    private final CheckinService checkinService;
    private final CurrentUserService currentUserService;

    @PostMapping
    public CheckinResultDTO checkin(@RequestBody CheckinRequest req, HttpServletRequest request) {
        BtcStaff btc = currentUserService.requireBtc(request);
        return checkinService.checkin(btc, req.getCode());
    }
}
