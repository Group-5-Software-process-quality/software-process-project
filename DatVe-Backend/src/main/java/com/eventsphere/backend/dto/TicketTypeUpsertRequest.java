package com.eventsphere.backend.dto;

import lombok.Data;

@Data
public class TicketTypeUpsertRequest {
    private String name;
    private Double price;
    private Integer total;
}
