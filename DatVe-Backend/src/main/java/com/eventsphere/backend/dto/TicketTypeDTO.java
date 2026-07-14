package com.eventsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketTypeDTO {
    private Long id;
    private String name;
    private Double price;
    private Integer total;
    private Integer sold;
}
