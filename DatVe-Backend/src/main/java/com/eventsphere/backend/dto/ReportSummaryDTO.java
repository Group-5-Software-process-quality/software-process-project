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
public class ReportSummaryDTO {
    private int sold;
    private int capacity;
    private double revenue;
    private int fillRate;
    private List<TicketTypeDTO> ticketTypes;
    private List<RecentOrderDTO> recentOrders;
}
