package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.MyOrderDTO;
import com.eventsphere.backend.dto.MyOrderItemDTO;
import com.eventsphere.backend.dto.TicketCodeDTO;
import com.eventsphere.backend.entity.Order;
import com.eventsphere.backend.entity.User;
import com.eventsphere.backend.repository.OrderRepository;
import com.eventsphere.backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MyOrdersService {

    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;

    public List<MyOrderDTO> list(User user) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        // Gộp các dòng Order cùng orderCode (được tạo trong 1 lần thanh toán giỏ hàng)
        LinkedHashMap<String, List<Order>> grouped = new LinkedHashMap<>();

        for (Order o : orders) {
            String key = o.getOrderCode() != null ? o.getOrderCode() : "ORD-" + o.getId();
            grouped.computeIfAbsent(key, k -> new ArrayList<>()).add(o);
        }

        List<MyOrderDTO> result = new ArrayList<>();

        for (Map.Entry<String, List<Order>> entry : grouped.entrySet()) {
            List<Order> group = entry.getValue();
            Order first = group.get(0);

            double total = group.stream().mapToDouble(o -> o.getTotalAmount() == null ? 0 : o.getTotalAmount()).sum();

            List<MyOrderItemDTO> items = group.stream().map(o -> MyOrderItemDTO.builder()
                    .eventTitle(o.getEvent() != null ? o.getEvent().getTitle() : "")
                    .ticketType(o.getTicketType() != null ? o.getTicketType().getName() : "")
                    .qty(o.getQuantity())
                    .tickets(ticketRepository.findByOrderId(o.getId()).stream()
                            .map(t -> TicketCodeDTO.builder().code(t.getCode()).status(t.getStatus().name().toLowerCase()).build())
                            .toList())
                    .build()).toList();

            result.add(MyOrderDTO.builder()
                    .id(entry.getKey())
                    .date(first.getCreatedAt())
                    .status(first.getStatus() != null ? first.getStatus().name().toLowerCase() : "pending")
                    .total(total)
                    .items(items)
                    .build());
        }

        return result;
    }
}
