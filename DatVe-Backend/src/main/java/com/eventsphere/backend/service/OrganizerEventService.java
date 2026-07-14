package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.*;
import com.eventsphere.backend.entity.*;
import com.eventsphere.backend.repository.EventRepository;
import com.eventsphere.backend.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizerEventService {

    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;

    public List<OrganizerEventDTO> listMine(BtcStaff btc) {
        return eventRepository.findByOrganizerIdOrderByCreatedAtDesc(btc.getId()).stream()
                .map(this::toDTO)
                .toList();
    }

    public OrganizerEventDTO getMine(BtcStaff btc, Long id) {
        Event event = findOwned(btc, id);
        return toDTO(event);
    }

    public OrganizerEventDTO create(BtcStaff btc, OrganizerEventUpsertRequest req) {
        validate(req);

        Event event = Event.builder()
                .title(req.getTitle().trim())
                .description(req.getDescription())
                .location(req.getLocationName())
                .eventDate(req.getStartTime())
                .capacity(req.getCapacity())
                .status(EventStatus.DRAFT)
                .organizer(btc)
                .createdAt(LocalDateTime.now())
                .build();

        event = eventRepository.save(event);

        return toDTO(event);
    }

    public OrganizerEventDTO update(BtcStaff btc, Long id, OrganizerEventUpsertRequest req) {
        validate(req);

        Event event = findOwned(btc, id);

        event.setTitle(req.getTitle().trim());
        event.setDescription(req.getDescription());
        event.setLocation(req.getLocationName());
        event.setEventDate(req.getStartTime());
        event.setCapacity(req.getCapacity());

        event = eventRepository.save(event);

        return toDTO(event);
    }

    public void submitForApproval(BtcStaff btc, Long id) {
        Event event = findOwned(btc, id);

        if (event.getStatus() != EventStatus.DRAFT && event.getStatus() != EventStatus.REJECTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ có thể gửi duyệt sự kiện ở trạng thái bản nháp hoặc bị từ chối");
        }

        event.setStatus(EventStatus.PENDING);
        event.setRejectionReason(null);
        eventRepository.save(event);
    }

    public void delete(BtcStaff btc, Long id) {
        Event event = findOwned(btc, id);

        List<TicketType> types = ticketTypeRepository.findByEventIdOrderByIdAsc(id);
        int sold = types.stream().mapToInt(t -> t.getSoldQuantity() == null ? 0 : t.getSoldQuantity()).sum();

        if (event.getStatus() == EventStatus.APPROVED && sold > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể xóa sự kiện đã duyệt và đã bán vé");
        }

        ticketTypeRepository.deleteAll(types);
        eventRepository.delete(event);
    }

    public TicketTypeDTO addTicketType(BtcStaff btc, Long eventId, TicketTypeUpsertRequest req) {
        Event event = findOwned(btc, eventId);

        if (req.getName() == null || req.getName().isBlank() || req.getPrice() == null
                || req.getTotal() == null || req.getTotal() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thông tin loại vé không hợp lệ");
        }

        TicketType tt = TicketType.builder()
                .event(event)
                .name(req.getName().trim())
                .price(req.getPrice())
                .totalQuantity(req.getTotal())
                .soldQuantity(0)
                .build();

        tt = ticketTypeRepository.save(tt);

        return toTicketTypeDTO(tt);
    }

    public void deleteTicketType(BtcStaff btc, Long ticketTypeId) {
        TicketType tt = ticketTypeRepository.findById(ticketTypeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy loại vé"));

        if (!tt.getEvent().getOrganizer().getId().equals(btc.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền xóa loại vé này");
        }

        if (tt.getSoldQuantity() != null && tt.getSoldQuantity() > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể xóa loại vé đã có người mua");
        }

        ticketTypeRepository.delete(tt);
    }

    public OrganizerDashboardDTO dashboard(BtcStaff btc) {
        List<Event> events = eventRepository.findByOrganizerIdOrderByCreatedAtDesc(btc.getId());

        int approved = (int) events.stream().filter(e -> e.getStatus() == EventStatus.APPROVED).count();
        int pending = (int) events.stream().filter(e -> e.getStatus() == EventStatus.PENDING).count();

        List<OrganizerEventDTO> dtos = events.stream().map(this::toDTO).toList();

        int totalSold = dtos.stream().mapToInt(OrganizerEventDTO::getTicketsSold).sum();
        double totalRevenue = dtos.stream().mapToDouble(OrganizerEventDTO::getRevenue).sum();

        return OrganizerDashboardDTO.builder()
                .eventCount(events.size())
                .approvedCount(approved)
                .pendingCount(pending)
                .totalSold(totalSold)
                .totalRevenue(totalRevenue)
                .recentEvents(dtos.stream().limit(8).toList())
                .build();
    }

    private Event findOwned(BtcStaff btc, Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sự kiện"));

        if (event.getOrganizer() == null || !event.getOrganizer().getId().equals(btc.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền truy cập sự kiện này");
        }

        return event;
    }

    private void validate(OrganizerEventUpsertRequest req) {
        if (req.getTitle() == null || req.getTitle().isBlank() || req.getStartTime() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng nhập đầy đủ tên sự kiện và thời gian bắt đầu");
        }
    }

    private OrganizerEventDTO toDTO(Event event) {
        List<TicketType> types = ticketTypeRepository.findByEventIdOrderByIdAsc(event.getId());

        int sold = types.stream().mapToInt(t -> t.getSoldQuantity() == null ? 0 : t.getSoldQuantity()).sum();
        double revenue = types.stream()
                .mapToDouble(t -> (t.getSoldQuantity() == null ? 0 : t.getSoldQuantity()) * (t.getPrice() == null ? 0 : t.getPrice()))
                .sum();

        return OrganizerEventDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .location(event.getLocation())
                .startTime(event.getEventDate())
                .capacity(event.getCapacity())
                .status(event.getStatus() != null ? event.getStatus().name().toLowerCase() : "draft")
                .rejectionReason(event.getRejectionReason())
                .ticketsSold(sold)
                .revenue(revenue)
                .ticketTypes(types.stream().map(this::toTicketTypeDTO).toList())
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
