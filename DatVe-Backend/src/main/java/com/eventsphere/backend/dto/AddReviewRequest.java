package com.eventsphere.backend.dto;

import lombok.Data;

@Data
public class AddReviewRequest {
    private Integer rating;
    private String comment;
}
