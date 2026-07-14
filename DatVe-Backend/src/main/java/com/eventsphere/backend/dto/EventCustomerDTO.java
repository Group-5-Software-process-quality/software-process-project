package com.eventsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventCustomerDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String icon;
    private String gradClass;
    private String location;
    private LocalDateTime date;
    private Integer capacity;
    private Integer sold;
    private Double minPrice;
    private Double rating;
    private Long reviewCount;
    private List<TicketTypeDTO> ticketTypes;
}
