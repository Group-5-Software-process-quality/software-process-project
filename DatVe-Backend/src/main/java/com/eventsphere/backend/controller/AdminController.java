package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.AdminDTO;
import com.eventsphere.backend.dto.LoginRequest;
import com.eventsphere.backend.dto.LoginResponse;
import com.eventsphere.backend.entity.Admin;
import com.eventsphere.backend.entity.Event;
import com.eventsphere.backend.entity.EventStatus;
import com.eventsphere.backend.entity.OrderStatus;
import com.eventsphere.backend.entity.TicketType;
import com.eventsphere.backend.repository.AdminRepository;
import com.eventsphere.backend.repository.EventRepository;
import com.eventsphere.backend.repository.OrderRepository;
import com.eventsphere.backend.repository.TicketTypeRepository;
import com.eventsphere.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminController {

    private final AdminRepository adminRepository;
    private final AdminService adminService;
    private final EventRepository eventRepository;
    private final OrderRepository orderRepository;
    private final TicketTypeRepository ticketTypeRepository;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail()).orElse(null);

        if (admin == null) {
            return LoginResponse.builder().success(false).message("Email not found").build();
        }
        if (!admin.getPassword().equals(request.getPassword())) {
            return LoginResponse.builder().success(false).message("Wrong password").build();
        }

        return LoginResponse.builder()
                .success(true)
                .token("eventsphere-admin-token")
                .admin(LoginResponse.Admin.builder()
                        .name(admin.getFullName())
                        .email(admin.getEmail())
                        .build())
                .build();
    }

    @GetMapping
    public List<Admin> getAll() {
        return adminService.getAll();
    }

    @GetMapping("/{id}")
    public Admin getById(@PathVariable Long id) {
        return adminService.getById(id);
    }

    @PostMapping
    public Admin create(@RequestBody AdminDTO dto) {
        return adminService.create(dto);
    }

    @PutMapping("/{id}")
    public Admin update(@PathVariable Long id, @RequestBody AdminDTO dto) {
        return adminService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        adminService.delete(id);
    }

    private String buildPriceLabel(Event event, List<TicketType> types) {
        if (types.isEmpty()) {
            return event.getPrice() == null ? "0 đ" : String.format("%,.0f đ", event.getPrice());
        }

        double min = types.stream().mapToDouble(tt -> tt.getPrice() == null ? 0 : tt.getPrice()).min().orElse(0);
        double max = types.stream().mapToDouble(tt -> tt.getPrice() == null ? 0 : tt.getPrice()).max().orElse(0);

        return (min == max)
                ? String.format("%,.0f đ", min)
                : String.format("%,.0f đ - %,.0f đ", min, max);
    }

    @GetMapping("/events/pending")
    public List<Map<String, Object>> getPendingEvents() {
        return eventRepository.findByStatusOrderByEventDateAsc(EventStatus.PENDING)
                .stream()
                .map(event -> {
                    List<TicketType> types = ticketTypeRepository.findByEventIdOrderByIdAsc(event.getId());

                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", event.getId());
                    row.put("title", event.getTitle());
                    row.put("organizerName", event.getOrganizer() != null ? event.getOrganizer().getFullName() : "Admin");
                    row.put("location", event.getLocation());
                    row.put("eventDate", event.getEventDate());
                    row.put("priceLabel", buildPriceLabel(event, types));
                    row.put("capacity", event.getCapacity());
                    row.put("ticketTypeCount", types.size());

                    return row;
                })
                .toList();
    }

    @PutMapping("/events/{id}/approve")
    public Event approveEvent(@PathVariable Long id) {
        Event event = eventRepository.findById(id).orElseThrow();
        event.setStatus(EventStatus.APPROVED);
        event.setRejectionReason(null);
        return eventRepository.save(event);
    }

    @PutMapping("/events/{id}/reject")
    public Event rejectEvent(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Event event = eventRepository.findById(id).orElseThrow();
        event.setStatus(EventStatus.REJECTED);
        event.setRejectionReason(body.get("reason"));
        return eventRepository.save(event);
    }

    @GetMapping("/events/price-labels")
    public Map<Long, String> getEventPriceLabels() {
        return eventRepository.findAll().stream()
                .collect(Collectors.toMap(
                        Event::getId,
                        event -> buildPriceLabel(event, ticketTypeRepository.findByEventIdOrderByIdAsc(event.getId()))
                ));
    }

    @GetMapping("/orders/paid")
    public List<Map<String, Object>> getPaidOrders() {
        return orderRepository.findByStatus(OrderStatus.PAID)
                .stream()
                .map(order -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("orderId", order.getId());
                    row.put("orderCode", order.getOrderCode());
                    row.put("customerName", order.getUser() != null ? order.getUser().getFullName() : null);
                    row.put("customerEmail", order.getUser() != null ? order.getUser().getEmail() : null);
                    row.put("eventTitle", order.getEvent() != null ? order.getEvent().getTitle() : null);
                    row.put("quantity", order.getQuantity());
                    row.put("totalAmount", order.getTotalAmount());
                    row.put("paymentMethod", order.getPaymentMethod());
                    row.put("qrCode", order.getQrCode());
                    row.put("createdAt", order.getCreatedAt());
                    return row;
                })
                .toList();
    }

}