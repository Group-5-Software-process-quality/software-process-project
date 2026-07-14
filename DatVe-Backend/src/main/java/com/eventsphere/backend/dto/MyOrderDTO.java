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
public class MyOrderDTO {
    private String id;
    private LocalDateTime date;
    private String status;
    private Double total;
    private List<MyOrderItemDTO> items;
}
