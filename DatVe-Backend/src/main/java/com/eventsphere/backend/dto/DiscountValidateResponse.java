package com.eventsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountValidateResponse {
    private boolean valid;
    private String code;
    private String type;
    private Double value;
    private String message;
}
