package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.*;
import com.eventsphere.backend.entity.*;
import com.eventsphere.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final DiscountRepository discountRepository;

    public List<CartItemDTO> list(User user) {
        return cartItemRepository.findByUserIdOrderByIdDesc(user.getId()).stream()
                .map(this::toDTO)
                .toList();
    }

    public CartItemDTO add(User user, AddCartRequest req) {
        if (req.getTicketTypeId() == null || req.getQuantity() == null || req.getQuantity() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loại vé hoặc số lượng không hợp lệ");
        }

        TicketType ticketType = ticketTypeRepository.findById(req.getTicketTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy loại vé"));

        int remaining = (ticketType.getTotalQuantity() == null ? 0 : ticketType.getTotalQuantity())
                - (ticketType.getSoldQuantity() == null ? 0 : ticketType.getSoldQuantity());

        CartItem item = cartItemRepository.findByUserIdAndTicketTypeId(user.getId(), ticketType.getId())
                .orElse(null);

        int newQty = (item != null ? item.getQuantity() : 0) + req.getQuantity();

        if (newQty > remaining) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số lượng vé còn lại không đủ");
        }

        if (item == null) {
            item = CartItem.builder().user(user).ticketType(ticketType).quantity(req.getQuantity()).build();
        } else {
            item.setQuantity(newQty);
        }

        item = cartItemRepository.save(item);

        return toDTO(item);
    }

    public void remove(User user, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm trong giỏ"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền xóa sản phẩm này");
        }

        cartItemRepository.delete(item);
    }

    public DiscountValidateResponse validateDiscount(String code) {
        if (code == null || code.isBlank()) {
            return DiscountValidateResponse.builder().valid(false).message("Vui lòng nhập mã giảm giá").build();
        }

        Discount discount = discountRepository.findByCode(code.trim().toUpperCase()).orElse(null);

        if (discount == null || !Boolean.TRUE.equals(discount.getActive())
                || discount.getUsedCount() >= discount.getMaxUses()) {
            return DiscountValidateResponse.builder().valid(false).code(code)
                    .message("Mã giảm giá không hợp lệ hoặc đã hết hạn").build();
        }

        return DiscountValidateResponse.builder()
                .valid(true)
                .code(discount.getCode())
                .type(discount.getType().name().toLowerCase())
                .value(discount.getValue())
                .message("Áp dụng mã \"" + discount.getCode() + "\" thành công")
                .build();
    }

    public CheckoutResponse checkout(User user, CheckoutRequest req) {
        List<CartItem> items = cartItemRepository.findByUserIdOrderByIdDesc(user.getId());

        if (items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giỏ hàng đang trống");
        }

        // Kiểm tra & áp dụng mã giảm giá (nếu có) — áp dụng cho các dòng
        // thuộc đúng sự kiện gắn với mã giảm giá đó.
        Discount discount = null;

        if (req.getDiscountCode() != null && !req.getDiscountCode().isBlank()) {
            discount = discountRepository.findByCode(req.getDiscountCode().trim().toUpperCase())
                    .filter(d -> Boolean.TRUE.equals(d.getActive()) && d.getUsedCount() < d.getMaxUses())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá không hợp lệ hoặc đã hết hạn"));
        }

        String orderCode = "EVP-" + DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDateTime.now())
                + "-" + String.format("%04d", (int) (Math.random() * 10000));

        double total = 0;

        for (CartItem item : items) {
            TicketType ticketType = item.getTicketType();
            Event event = ticketType.getEvent();

            int remaining = (ticketType.getTotalQuantity() == null ? 0 : ticketType.getTotalQuantity())
                    - (ticketType.getSoldQuantity() == null ? 0 : ticketType.getSoldQuantity());

            if (item.getQuantity() > remaining) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Loại vé \"" + ticketType.getName() + "\" không còn đủ số lượng");
            }

            double lineSubtotal = (ticketType.getPrice() == null ? 0 : ticketType.getPrice()) * item.getQuantity();
            double lineDiscount = 0;

            if (discount != null && discount.getEvent() != null
                    && discount.getEvent().getId().equals(event.getId())) {
                lineDiscount = discount.getType() == DiscountType.PERCENT
                        ? lineSubtotal * (discount.getValue() / 100)
                        : Math.min(discount.getValue(), lineSubtotal);
            }

            double lineTotal = lineSubtotal - lineDiscount;
            total += lineTotal;

            Order order = Order.builder()
                    .user(user)
                    .event(event)
                    .ticketType(ticketType)
                    .quantity(item.getQuantity())
                    .totalAmount(lineTotal)
                    .paymentMethod("ONLINE")
                    .paymentStatus("PAID")
                    .status(OrderStatus.PAID)
                    .createdAt(LocalDateTime.now())
                    .orderCode(orderCode)
                    .discountCode(discount != null ? discount.getCode() : null)
                    .discountAmount(lineDiscount)
                    .build();

            order = orderRepository.save(order);

            for (int i = 0; i < item.getQuantity(); i++) {
                Ticket ticket = Ticket.builder()
                        .order(order)
                        .code("EVP-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase())
                        .status(TicketStatus.VALID)
                        .build();
                ticketRepository.save(ticket);
            }

            ticketType.setSoldQuantity((ticketType.getSoldQuantity() == null ? 0 : ticketType.getSoldQuantity()) + item.getQuantity());
            ticketTypeRepository.save(ticketType);
        }

        if (discount != null) {
            discount.setUsedCount(discount.getUsedCount() + 1);
            discountRepository.save(discount);
        }

        cartItemRepository.deleteAll(items);

        return CheckoutResponse.builder().orderCode(orderCode).total(total).build();
    }

    private CartItemDTO toDTO(CartItem item) {
        TicketType tt = item.getTicketType();
        Event event = tt.getEvent();

        return CartItemDTO.builder()
                .id(item.getId())
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .ticketTypeId(tt.getId())
                .ticketTypeName(tt.getName())
                .date(event.getEventDate())
                .price(tt.getPrice())
                .qty(item.getQuantity())
                .icon(event.getIcon())
                .gradClass(event.getGradClass())
                .build();
    }
}
