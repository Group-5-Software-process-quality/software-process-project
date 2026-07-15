package com.eventsphere.backend.service;
 
import com.eventsphere.backend.dto.EventDTO;
import com.eventsphere.backend.entity.Event;
import com.eventsphere.backend.entity.EventStatus;
import com.eventsphere.backend.entity.Order;
import com.eventsphere.backend.entity.TicketType;
import com.eventsphere.backend.repository.CartItemRepository;
import com.eventsphere.backend.repository.DiscountRepository;
import com.eventsphere.backend.repository.EventRepository;
import com.eventsphere.backend.repository.OrderRepository;
import com.eventsphere.backend.repository.ReviewRepository;
import com.eventsphere.backend.repository.TicketRepository;
import com.eventsphere.backend.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.time.LocalDateTime;
import java.util.List;
 
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
 
    private final EventRepository eventRepository;
 
    // Cần thêm để xóa sạch dữ liệu con trước khi xóa Event (tránh lỗi
    // ràng buộc khóa ngoại "Cannot delete or update a parent row").
    private final TicketTypeRepository ticketTypeRepository;
    private final CartItemRepository cartItemRepository;
    private final DiscountRepository discountRepository;
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
 
    @Override
    public List<Event> getAll() {
        return eventRepository.findAll();
    }
 
    @Override
    public Event getById(Long id) {
        return eventRepository.findById(id).orElseThrow();
    }
 
    @Override
    public Event create(EventDTO dto) {
 
        Event event = new Event();
 
        event.setTitle(dto.getTitle());
        event.setLocation(dto.getLocation());
        event.setEventDate(dto.getEventDate());
        event.setPrice(dto.getPrice());
        event.setCapacity(dto.getCapacity());
        event.setStatus(EventStatus.APPROVED);
        event.setCreatedAt(LocalDateTime.now());
 
        return eventRepository.save(event);
    }
 
    @Override
    public Event update(Long id, EventDTO dto) {
 
        Event event = eventRepository.findById(id).orElseThrow();
 
        event.setTitle(dto.getTitle());
        event.setLocation(dto.getLocation());
        event.setEventDate(dto.getEventDate());
        event.setPrice(dto.getPrice());
        event.setCapacity(dto.getCapacity());
 
        return eventRepository.save(event);
    }
 
    @Override
    @Transactional
    public void delete(Long id) {
 
        // 1. Xóa cart_items đang giữ chỗ các loại vé (ticket_types) của event này
        List<TicketType> ticketTypes = ticketTypeRepository.findByEventIdOrderByIdAsc(id);
 
        for (TicketType tt : ticketTypes) {
            cartItemRepository.deleteAll(cartItemRepository.findByTicketType_Id(tt.getId()));
        }
 
        // 2. Xóa các loại vé (ticket_types) của event
        ticketTypeRepository.deleteAll(ticketTypes);
 
        // 3. Xóa mã giảm giá (discounts) của event
        discountRepository.deleteAll(discountRepository.findByEventId(id));
 
        // 4. Xóa đánh giá (reviews) của event
        reviewRepository.deleteAll(reviewRepository.findByEventId(id));
 
        // 5. Xóa vé (tickets) thuộc các đơn hàng (orders) của event, rồi xóa orders
        List<Order> orders = orderRepository.findByEventIdOrderByCreatedAtDesc(id);
 
        for (Order order : orders) {
            ticketRepository.deleteAll(ticketRepository.findByOrderId(order.getId()));
        }
 
        orderRepository.deleteAll(orders);
 
        // 6. Cuối cùng mới xóa event
        eventRepository.deleteById(id);
    }
}