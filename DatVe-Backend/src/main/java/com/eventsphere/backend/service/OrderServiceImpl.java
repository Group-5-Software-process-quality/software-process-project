package com.eventsphere.backend.service;
 
import com.eventsphere.backend.dto.OrderDTO;
import com.eventsphere.backend.entity.Event;
import com.eventsphere.backend.entity.Order;
import com.eventsphere.backend.entity.OrderStatus;
import com.eventsphere.backend.entity.User;
import com.eventsphere.backend.repository.EventRepository;
import com.eventsphere.backend.repository.OrderRepository;
import com.eventsphere.backend.repository.TicketRepository;
import com.eventsphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.time.LocalDateTime;
import java.util.List;
 
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
 
    private final OrderRepository orderRepository;
 
    private final UserRepository userRepository;
 
    private final EventRepository eventRepository;
 
    // Cần thêm để xóa vé (tickets) tham chiếu tới order trước khi xóa order
    private final TicketRepository ticketRepository;
 
    @Override
    public List<Order> getAll() {
 
        return orderRepository.findAll();
 
    }
 
    @Override
    public Order create(OrderDTO dto) {
 
        User user =
                userRepository.findById(dto.getUserId()).orElseThrow();
 
        Event event =
                eventRepository.findById(dto.getEventId()).orElseThrow();
 
        Order order = new Order();
 
        order.setUser(user);
 
        order.setEvent(event);
 
        order.setQuantity(dto.getQuantity());
 
        order.setPaymentMethod(dto.getPaymentMethod());
 
        order.setStatus(OrderStatus.PENDING);
 
        order.setPaymentStatus("UNPAID");
 
        order.setCreatedAt(LocalDateTime.now());
 
        order.setTotalAmount(
 
                dto.getQuantity() * event.getPrice()
 
        );
 
        return orderRepository.save(order);
 
    }
 
    @Override
    public Order confirm(Long id) {
 
        Order order = orderRepository
                .findById(id)
                .orElseThrow();
 
        order.setStatus(OrderStatus.PAID);
 
        order.setPaymentStatus("PAID");
 
        return orderRepository.save(order);
 
    }
 
    @Override
    @Transactional
    public void delete(Long id) {
 
        // Xóa vé (tickets) đang tham chiếu tới order này trước
        ticketRepository.deleteAll(ticketRepository.findByOrderId(id));
 
        orderRepository.deleteById(id);
 
    }
}
 