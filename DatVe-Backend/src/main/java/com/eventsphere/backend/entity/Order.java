package com.eventsphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name="event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;

    private Integer quantity;

    private Double totalAmount;

    /** Mã nhóm đơn hàng hiển thị cho khách, dùng chung cho các dòng Order
     *  được tạo trong cùng 1 lần thanh toán giỏ hàng, vd "EVP-20260710-0142" */
    private String orderCode;

    private String discountCode;

    @Builder.Default
    private Double discountAmount = 0.0;

    private String paymentMethod;

    private String paymentStatus;

    private String qrCode;

    private String bankTransactionId;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private LocalDateTime createdAt;

}