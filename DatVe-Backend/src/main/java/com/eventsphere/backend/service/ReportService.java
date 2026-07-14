package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.RecentOrderDTO;
import com.eventsphere.backend.dto.ReportSummaryDTO;
import com.eventsphere.backend.dto.TicketTypeDTO;
import com.eventsphere.backend.entity.BtcStaff;
import com.eventsphere.backend.entity.Event;
import com.eventsphere.backend.entity.Order;
import com.eventsphere.backend.entity.TicketType;
import com.eventsphere.backend.repository.EventRepository;
import com.eventsphere.backend.repository.OrderRepository;
import com.eventsphere.backend.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final OrderRepository orderRepository;

    public ReportSummaryDTO summary(BtcStaff btc, Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sự kiện"));

        if (event.getOrganizer() == null || !event.getOrganizer().getId().equals(btc.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền truy cập sự kiện này");
        }

        List<TicketType> types = ticketTypeRepository.findByEventIdOrderByIdAsc(eventId);

        int sold = types.stream().mapToInt(t -> t.getSoldQuantity() == null ? 0 : t.getSoldQuantity()).sum();
        int capacity = types.stream().mapToInt(t -> t.getTotalQuantity() == null ? 0 : t.getTotalQuantity()).sum();
        if (capacity == 0) capacity = event.getCapacity() == null ? 0 : event.getCapacity();

        double revenue = types.stream()
                .mapToDouble(t -> (t.getSoldQuantity() == null ? 0 : t.getSoldQuantity()) * (t.getPrice() == null ? 0 : t.getPrice()))
                .sum();

        int fillRate = capacity > 0 ? (int) Math.round((sold * 100.0) / capacity) : 0;

        List<TicketTypeDTO> ticketTypeDTOs = types.stream().map(t -> TicketTypeDTO.builder()
                .id(t.getId()).name(t.getName()).price(t.getPrice())
                .total(t.getTotalQuantity()).sold(t.getSoldQuantity()).build()).toList();

        List<Order> orders = orderRepository.findByEventIdOrderByCreatedAtDesc(eventId);

        List<RecentOrderDTO> recentOrders = orders.stream().limit(20).map(o -> RecentOrderDTO.builder()
                .code(o.getOrderCode())
                .customer(o.getUser() != null ? o.getUser().getFullName() : "")
                .amount(o.getTotalAmount())
                .status(o.getStatus() != null ? o.getStatus().name().toLowerCase() : "pending")
                .date(o.getCreatedAt())
                .build()).toList();

        return ReportSummaryDTO.builder()
                .sold(sold)
                .capacity(capacity)
                .revenue(revenue)
                .fillRate(fillRate)
                .ticketTypes(ticketTypeDTOs)
                .recentOrders(recentOrders)
                .build();
    }
}
