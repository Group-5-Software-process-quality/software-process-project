package com.eventsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private Long ticketTypeId;
    private String ticketTypeName;
    private LocalDateTime date;
    private Double price;
    private Integer qty;
    private String icon;
    private String gradClass;
}
