package com.eventsphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ticket_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    private String name;

    private Double price;

    private Integer totalQuantity;

    @Builder.Default
    private Integer soldQuantity = 0;
}
