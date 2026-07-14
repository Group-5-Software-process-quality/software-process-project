package com.eventsphere.backend.service;

import com.eventsphere.backend.dto.CheckinResultDTO;
import com.eventsphere.backend.entity.BtcStaff;
import com.eventsphere.backend.entity.Ticket;
import com.eventsphere.backend.entity.TicketStatus;
import com.eventsphere.backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CheckinService {

    private final TicketRepository ticketRepository;

    public CheckinResultDTO checkin(BtcStaff btc, String rawCode) {
        String code = rawCode == null ? "" : rawCode.trim().toUpperCase();

        Ticket ticket = ticketRepository.findByCode(code).orElse(null);

        if (ticket == null || ticket.getOrder().getEvent().getOrganizer() == null
                || !ticket.getOrder().getEvent().getOrganizer().getId().equals(btc.getId())) {
            return CheckinResultDTO.builder().result("not_found").code(code).build();
        }

        String eventTitle = ticket.getOrder().getEvent().getTitle();
        String ticketTypeName = ticket.getOrder().getTicketType() != null ? ticket.getOrder().getTicketType().getName() : "";
        String attendee = ticket.getOrder().getUser() != null ? ticket.getOrder().getUser().getFullName() : "";

        if (ticket.getStatus() == TicketStatus.USED) {
            return CheckinResultDTO.builder()
                    .result("already_used")
                    .eventTitle(eventTitle)
                    .ticketType(ticketTypeName)
                    .attendee(attendee)
                    .code(code)
                    .build();
        }

        ticket.setStatus(TicketStatus.USED);
        ticket.setCheckedInAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        return CheckinResultDTO.builder()
                .result("success")
                .eventTitle(eventTitle)
                .ticketType(ticketTypeName)
                .attendee(attendee)
                .code(code)
                .build();
    }
}
