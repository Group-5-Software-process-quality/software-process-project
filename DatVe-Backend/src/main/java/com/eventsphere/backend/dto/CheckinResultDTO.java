package com.eventsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckinResultDTO {
    private String result; // "success" | "already_used" | "not_found"
    private String eventTitle;
    private String ticketType;
    private String attendee;
    private String code;
}
