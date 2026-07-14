package com.eventsphere.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrganizerEventUpsertRequest {
    private String title;
    private String description;
    private String locationName;
    private LocalDateTime startTime;
    private Integer capacity;
}
