package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.AddReviewRequest;
import com.eventsphere.backend.dto.ReviewDTO;
import com.eventsphere.backend.entity.Event;
import com.eventsphere.backend.entity.Review;
import com.eventsphere.backend.entity.User;
import com.eventsphere.backend.repository.EventRepository;
import com.eventsphere.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EventRepository eventRepository;

    public List<ReviewDTO> list(Long eventId) {
        return reviewRepository.findByEventIdOrderByCreatedAtDesc(eventId).stream()
                .map(r -> ReviewDTO.builder()
                        .id(r.getId())
                        .name(r.getUser() != null ? r.getUser().getFullName() : "Ẩn danh")
                        .rating(r.getRating())
                        .comment(r.getComment())
                        .createdAt(r.getCreatedAt())
                        .build())
                .toList();
    }

    public ReviewDTO add(Long eventId, User user, AddReviewRequest req) {
        if (req.getRating() == null || req.getRating() < 1 || req.getRating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng chọn số sao từ 1 đến 5");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sự kiện"));

        Review review = Review.builder()
                .event(event)
                .user(user)
                .rating(req.getRating())
                .comment(req.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        review = reviewRepository.save(review);

        return ReviewDTO.builder()
                .id(review.getId())
                .name(user.getFullName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
