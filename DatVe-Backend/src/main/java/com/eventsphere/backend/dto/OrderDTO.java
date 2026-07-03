package com.eventsphere.backend.dto;

import lombok.Data;

@Data
public class OrderDTO {

    private Long userId;
    private Long eventId;
    private Integer quantity;
    private String paymentMethod;

}