package com.eventsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerDiscountDTO {
    private Long id;
    private String code;
    private String type;
    private Double value;
    private Integer used;
    private Integer max;
    private Boolean active;
}
