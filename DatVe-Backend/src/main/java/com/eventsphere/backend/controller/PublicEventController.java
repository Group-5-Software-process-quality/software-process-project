package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.AddReviewRequest;
import com.eventsphere.backend.dto.EventCustomerDTO;
import com.eventsphere.backend.dto.ReviewDTO;
import com.eventsphere.backend.entity.User;
import com.eventsphere.backend.security.CurrentUserService;
import com.eventsphere.backend.service.CustomerEventService;
import com.eventsphere.backend.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * API công khai dành cho khách hàng duyệt & xem sự kiện, dùng bởi FE-Customer
 * (thay thế hoàn toàn dữ liệu mock MOCK_EVENTS / MOCK_REVIEWS trước đây).
 */
@RestController
@RequestMapping("/api/public/events")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PublicEventController {

    private final CustomerEventService customerEventService;
    private final ReviewService reviewService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public List<EventCustomerDTO> browse(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String dateFrom) {
        return customerEventService.browse(q, category, location, dateFrom);
    }

    @GetMapping("/{id}")
    public EventCustomerDTO detail(@PathVariable Long id) {
        return customerEventService.getDetail(id);
    }

    @GetMapping("/{id}/reviews")
    public List<ReviewDTO> reviews(@PathVariable Long id) {
        return reviewService.list(id);
    }

    @PostMapping("/{id}/reviews")
    public ReviewDTO addReview(@PathVariable Long id, @RequestBody AddReviewRequest req, HttpServletRequest request) {
        User user = currentUserService.requireUser(request);
        return reviewService.add(id, user, req);
    }
}
