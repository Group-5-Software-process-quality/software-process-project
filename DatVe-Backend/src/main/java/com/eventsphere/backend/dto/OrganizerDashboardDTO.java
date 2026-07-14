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
public class OrganizerDashboardDTO {
    private int eventCount;
    private int approvedCount;
    private int pendingCount;
    private int totalSold;
    private double totalRevenue;
    private List<OrganizerEventDTO> recentEvents;
}
