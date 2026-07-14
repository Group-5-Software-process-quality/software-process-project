package com.eventsphere.backend.security;

import com.eventsphere.backend.entity.Account;
import com.eventsphere.backend.entity.BtcStaff;
import com.eventsphere.backend.entity.User;
import com.eventsphere.backend.repository.AccountRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/**
 * Xác thực người gọi API thật (không phải mock) dựa trên token đã được sinh
 * và lưu trong DB khi đăng nhập (xem AuthController). Client gửi header
 * "Authorization: Bearer <token>".
 */
@Component
@RequiredArgsConstructor
public class CurrentUserService {

    private final AccountRepository accountRepository;

    public Account requireAccount(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa đăng nhập");
        }

        String token = header.substring(7).trim();

        return accountRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại"));
    }

    public User requireUser(HttpServletRequest request) {
        Account account = requireAccount(request);

        if (!(account instanceof User user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chỉ tài khoản khách hàng mới được phép");
        }

        return user;
    }

    public BtcStaff requireBtc(HttpServletRequest request) {
        Account account = requireAccount(request);

        if (!(account instanceof BtcStaff btc)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chỉ tài khoản BTC mới được phép");
        }

        return btc;
    }
}
