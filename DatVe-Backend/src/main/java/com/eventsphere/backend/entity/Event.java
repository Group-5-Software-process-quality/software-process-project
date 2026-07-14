package com.eventsphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 4000)
    private String description;

    private String category;

    /** Font Awesome icon class, vd "fa-music" */
    private String icon;

    /** Class CSS gradient cho ảnh đại diện, vd "grad-1" */
    private String gradClass;

    private String location;

    private LocalDateTime eventDate;

    /** Giá cơ bản/hiển thị nhanh (Admin dùng); giá bán vé thật nằm ở TicketType */
    private Double price;

    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EventStatus status = EventStatus.APPROVED;

    private String rejectionReason;

    /** BTC tạo sự kiện này; null nếu Admin tạo trực tiếp */
    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private BtcStaff organizer;

    private LocalDateTime createdAt;
}
