package com.eventsphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "discounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    private DiscountType type;

    private Double value;

    private Integer maxUses;

    @Builder.Default
    private Integer usedCount = 0;

    @Builder.Default
    private Boolean active = true;
}
