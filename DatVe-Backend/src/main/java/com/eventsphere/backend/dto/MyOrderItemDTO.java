package com.eventsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyOrderItemDTO {
    private String eventTitle;
    private String ticketType;
    private Integer qty;
    private List<TicketCodeDTO> tickets;
}
