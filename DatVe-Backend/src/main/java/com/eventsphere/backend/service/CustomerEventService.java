package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.EventCustomerDTO;
import com.eventsphere.backend.dto.TicketTypeDTO;
import com.eventsphere.backend.entity.Event;
import com.eventsphere.backend.entity.EventStatus;
import com.eventsphere.backend.entity.TicketType;
import com.eventsphere.backend.repository.EventRepository;
import com.eventsphere.backend.repository.ReviewRepository;
import com.eventsphere.backend.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerEventService {

    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final ReviewRepository reviewRepository;

    public List<EventCustomerDTO> browse(String q, String category, String location, String dateFrom) {
        List<Event> events = eventRepository.findByStatusOrderByEventDateAsc(EventStatus.APPROVED);

        return events.stream()
                .filter(e -> q == null || q.isBlank()
                        || (e.getTitle() != null && e.getTitle().toLowerCase().contains(q.toLowerCase()))
                        || (e.getLocation() != null && e.getLocation().toLowerCase().contains(q.toLowerCase())))
                .filter(e -> category == null || category.isBlank() || category.equalsIgnoreCase(e.getCategory()))
                .filter(e -> location == null || location.isBlank()
                        || (e.getLocation() != null && e.getLocation().toLowerCase().contains(location.toLowerCase())))
                .filter(e -> dateFrom == null || dateFrom.isBlank()
                        || e.getEventDate() == null || !e.getEventDate().toLocalDate().isBefore(java.time.LocalDate.parse(dateFrom)))
                .map(this::toSummaryDTO)
                .toList();
    }

    public EventCustomerDTO getDetail(Long id) {
        Event event = eventRepository.findById(id)
                .filter(e -> e.getStatus() == EventStatus.APPROVED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sự kiện"));

        return toDetailDTO(event);
    }

    private EventCustomerDTO toSummaryDTO(Event event) {
        List<TicketType> types = ticketTypeRepository.findByEventIdOrderByIdAsc(event.getId());
        return build(event, types, false);
    }

    private EventCustomerDTO toDetailDTO(Event event) {
        List<TicketType> types = ticketTypeRepository.findByEventIdOrderByIdAsc(event.getId());
        return build(event, types, true);
    }

    private EventCustomerDTO build(Event event, List<TicketType> types, boolean includeTicketTypes) {
        double minPrice = types.stream()
                .map(TicketType::getPrice)
                .filter(p -> p != null)
                .min(Comparator.naturalOrder())
                .orElse(event.getPrice() != null ? event.getPrice() : 0.0);

        int sold = types.stream().mapToInt(t -> t.getSoldQuantity() == null ? 0 : t.getSoldQuantity()).sum();

        Double avgRating = reviewRepository.averageRatingForEvent(event.getId());
        long reviewCount = reviewRepository.countByEventId(event.getId());

        return EventCustomerDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .category(event.getCategory())
                .icon(event.getIcon())
                .gradClass(event.getGradClass())
                .location(event.getLocation())
                .date(event.getEventDate())
                .capacity(event.getCapacity())
                .sold(sold)
                .minPrice(minPrice)
                .rating(avgRating == null ? 0.0 : Math.round(avgRating * 10) / 10.0)
                .reviewCount(reviewCount)
                .ticketTypes(includeTicketTypes ? types.stream().map(this::toTicketTypeDTO).toList() : null)
                .build();
    }

    private TicketTypeDTO toTicketTypeDTO(TicketType t) {
        return TicketTypeDTO.builder()
                .id(t.getId())
                .name(t.getName())
                .price(t.getPrice())
                .total(t.getTotalQuantity())
                .sold(t.getSoldQuantity())
                .build();
    }
}
