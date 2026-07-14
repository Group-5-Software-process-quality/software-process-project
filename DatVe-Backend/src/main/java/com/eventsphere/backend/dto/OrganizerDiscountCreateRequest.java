package com.eventsphere.backend.dto;

import lombok.Data;

@Data
public class OrganizerDiscountCreateRequest {
    private Long eventId;
    private String code;
    private String type;
    private Double value;
    private Integer maxUses;
}
