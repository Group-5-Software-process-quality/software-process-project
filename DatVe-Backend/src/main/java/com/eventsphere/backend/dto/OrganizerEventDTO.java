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
public class OrganizerEventDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime startTime;
    private Integer capacity;
    private String status;
    private String rejectionReason;
    private Integer ticketsSold;
    private Double revenue;
    private List<TicketTypeDTO> ticketTypes;
}
