package com.eventsphere.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventDTO {

    private String title;
    private String location;
    private LocalDateTime eventDate;
    private Double price;
    private Integer capacity;

}