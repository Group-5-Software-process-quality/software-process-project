package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.AdminDTO;
import com.eventsphere.backend.dto.LoginRequest;
import com.eventsphere.backend.dto.LoginResponse;
import com.eventsphere.backend.entity.Admin;
import com.eventsphere.backend.repository.AdminRepository;
import com.eventsphere.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin("*")

public class AdminController {

    private final AdminRepository adminRepository;

    private final AdminService adminService;

    private final com.eventsphere.backend.repository.EventRepository eventRepository;

    private final com.eventsphere.backend.repository.OrderRepository orderRepository;

    private final com.eventsphere.backend.repository.TicketTypeRepository ticketTypeRepository;

    // ===========================
    // LOGIN
    // ===========================

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (admin == null) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Email not found")
                    .build();
        }

        if (!admin.getPassword().equals(request.getPassword())) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Wrong password")
                    .build();
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

    // ===========================
    // SỰ KIỆN CHỜ DUYỆT (do BTC tạo)
    // ===========================

    @GetMapping("/events/pending")
    public java.util.List<java.util.Map<String, Object>> getPendingEvents() {

        return eventRepository.findByStatusOrderByEventDateAsc(
                        com.eventsphere.backend.entity.EventStatus.PENDING)
                .stream()
                .map(event -> {

                    java.util.List<com.eventsphere.backend.entity.TicketType> types =
                            ticketTypeRepository.findByEventIdOrderByIdAsc(event.getId());

                    String priceLabel;

                    if (types.isEmpty()) {
                        // Không có loại vé riêng -> dùng giá cơ bản của Event
                        priceLabel = event.getPrice() == null ? "0 đ"
                                : String.format("%,.0f đ", event.getPrice());
                    } else {
                        double min = types.stream().mapToDouble(TicketType_getPrice()).min().orElse(0);
                        double max = types.stream().mapToDouble(TicketType_getPrice()).max().orElse(0);

                        priceLabel = (min == max)
                                ? String.format("%,.0f đ", min)
                                : String.format("%,.0f đ - %,.0f đ", min, max);
                    }

                    java.util.Map<String, Object> row = new java.util.LinkedHashMap<>();
                    row.put("id", event.getId());
                    row.put("title", event.getTitle());
                    row.put("organizerName", event.getOrganizer() != null ? event.getOrganizer().getFullName() : "Admin");
                    row.put("location", event.getLocation());
                    row.put("eventDate", event.getEventDate());
                    row.put("priceLabel", priceLabel);
                    row.put("capacity", event.getCapacity());
                    row.put("ticketTypeCount", types.size());

                    return row;
                })
                .toList();
    }

    private static java.util.function.ToDoubleFunction<com.eventsphere.backend.entity.TicketType> TicketType_getPrice() {
        return tt -> tt.getPrice() == null ? 0 : tt.getPrice();
    }

    @PutMapping("/events/{id}/approve")
    public com.eventsphere.backend.entity.Event approveEvent(@PathVariable Long id) {
        com.eventsphere.backend.entity.Event event = eventRepository.findById(id).orElseThrow();
        event.setStatus(com.eventsphere.backend.entity.EventStatus.APPROVED);
        event.setRejectionReason(null);
        return eventRepository.save(event);
    }

    @PutMapping("/events/{id}/reject")
    public com.eventsphere.backend.entity.Event rejectEvent(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {

        com.eventsphere.backend.entity.Event event = eventRepository.findById(id).orElseThrow();
        event.setStatus(com.eventsphere.backend.entity.EventStatus.REJECTED);
        event.setRejectionReason(body.get("reason"));
        return eventRepository.save(event);
    }

    // ===========================
    // NGƯỜI ĐÃ THANH TOÁN (đơn hàng status = PAID)
    // ===========================

    @GetMapping("/orders/paid")
    public java.util.List<java.util.Map<String, Object>> getPaidOrders() {

        return orderRepository.findByStatus(com.eventsphere.backend.entity.OrderStatus.PAID)
                .stream()
                .map(order -> {
                    java.util.Map<String, Object> row = new java.util.LinkedHashMap<>();
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

    // ===========================
    // GIÁ THẬT CỦA TẤT CẢ SỰ KIỆN (tính từ ticket_types nếu có)
    // ===========================

    @GetMapping("/events/price-labels")
    public java.util.Map<Long, String> getEventPriceLabels() {

        return eventRepository.findAll().stream()
                .collect(java.util.stream.Collectors.toMap(
                        com.eventsphere.backend.entity.Event::getId,
                        event -> {
                            java.util.List<com.eventsphere.backend.entity.TicketType> types =
                                    ticketTypeRepository.findByEventIdOrderByIdAsc(event.getId());

                            if (types.isEmpty()) {
                                return event.getPrice() == null ? "0 đ"
                                        : String.format("%,.0f đ", event.getPrice());
                            }

                            double min = types.stream()
                                    .mapToDouble(tt -> tt.getPrice() == null ? 0 : tt.getPrice())
                                    .min().orElse(0);

                            double max = types.stream()
                                    .mapToDouble(tt -> tt.getPrice() == null ? 0 : tt.getPrice())
                                    .max().orElse(0);

                            return (min == max)
                                    ? String.format("%,.0f đ", min)
                                    : String.format("%,.0f đ - %,.0f đ", min, max);
                        }
                ));
    }

    // ===========================
    // CRUD ADMIN
    // ===========================

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
    public Admin update(@PathVariable Long id,
                        @RequestBody AdminDTO dto) {
        return adminService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        adminService.delete(id);
    }

}