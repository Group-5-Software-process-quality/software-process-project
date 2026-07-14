package com.eventsphere.backend.dto;

import lombok.Data;

@Data
public class AddCartRequest {
    private Long ticketTypeId;
    private Integer quantity;
}
