package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.OrganizerDiscountCreateRequest;
import com.eventsphere.backend.dto.OrganizerDiscountDTO;
import com.eventsphere.backend.entity.BtcStaff;
import com.eventsphere.backend.entity.Discount;
import com.eventsphere.backend.entity.DiscountType;
import com.eventsphere.backend.entity.Event;
import com.eventsphere.backend.repository.DiscountRepository;
import com.eventsphere.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizerDiscountService {

    private final DiscountRepository discountRepository;
    private final EventRepository eventRepository;

    public List<OrganizerDiscountDTO> list(BtcStaff btc, Long eventId) {
        Event event = findOwned(btc, eventId);
        return discountRepository.findByEventIdOrderByIdDesc(event.getId()).stream().map(this::toDTO).toList();
    }

    public OrganizerDiscountDTO create(BtcStaff btc, OrganizerDiscountCreateRequest req) {
        if (req.getEventId() == null || req.getCode() == null || req.getCode().isBlank()
                || req.getType() == null || req.getValue() == null || req.getMaxUses() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng nhập đầy đủ thông tin mã giảm giá");
        }

        Event event = findOwned(btc, req.getEventId());

        String code = req.getCode().trim().toUpperCase();

        if (discountRepository.findByCode(code).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã tồn tại");
        }

        Discount discount = Discount.builder()
                .event(event)
                .code(code)
                .type(DiscountType.valueOf(req.getType().trim().toUpperCase()))
                .value(req.getValue())
                .maxUses(req.getMaxUses())
                .usedCount(0)
                .active(true)
                .build();

        discount = discountRepository.save(discount);

        return toDTO(discount);
    }

    public OrganizerDiscountDTO toggleActive(BtcStaff btc, Long discountId) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy mã giảm giá"));

        if (!discount.getEvent().getOrganizer().getId().equals(btc.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền chỉnh sửa mã giảm giá này");
        }

        discount.setActive(!Boolean.TRUE.equals(discount.getActive()));
        discount = discountRepository.save(discount);

        return toDTO(discount);
    }

    private Event findOwned(BtcStaff btc, Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sự kiện"));

        if (event.getOrganizer() == null || !event.getOrganizer().getId().equals(btc.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền truy cập sự kiện này");
        }

        return event;
    }

    private OrganizerDiscountDTO toDTO(Discount d) {
        return OrganizerDiscountDTO.builder()
                .id(d.getId())
                .code(d.getCode())
                .type(d.getType().name().toLowerCase())
                .value(d.getValue())
                .used(d.getUsedCount())
                .max(d.getMaxUses())
                .active(d.getActive())
                .build();
    }
}
