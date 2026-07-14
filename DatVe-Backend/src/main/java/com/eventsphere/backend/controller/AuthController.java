package com.eventsphere.backend.controller;

import com.eventsphere.backend.dto.AuthResponse;
import com.eventsphere.backend.dto.LoginRequest;
import com.eventsphere.backend.dto.RegisterRequest;
import com.eventsphere.backend.entity.Account;
import com.eventsphere.backend.entity.Admin;
import com.eventsphere.backend.entity.BtcStaff;
import com.eventsphere.backend.entity.User;
import com.eventsphere.backend.repository.AccountRepository;
import com.eventsphere.backend.repository.AdminRepository;
import com.eventsphere.backend.repository.BtcStaffRepository;
import com.eventsphere.backend.repository.UserRepository;
import com.eventsphere.backend.security.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Cổng đăng nhập / đăng ký DÙNG CHUNG cho cả 3 project con
 * (Admin, Customer, BTC) sau khi gộp lại.
 *
 * - Đăng ký: người dùng chọn 1 trong 3 role (ADMIN / USER / BTC).
 * - Đăng nhập: chỉ cần email + password, hệ thống tự nhận diện role
 *   và trả về để front-end điều hướng đúng trang (dashboard admin,
 *   trang chủ customer, hoặc trang BTC sau này).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AccountRepository accountRepository;
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final BtcStaffRepository btcStaffRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;

    // ===========================
    // REGISTER
    // ===========================
    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {

        if (request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()
                || request.getFullName() == null || request.getFullName().isBlank()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Vui lòng nhập đầy đủ họ tên, email và mật khẩu")
                    .build();
        }

        if (request.getRole() == null || request.getRole().isBlank()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Vui lòng chọn loại tài khoản (Admin / User / BTC)")
                    .build();
        }

        String role = request.getRole().trim().toUpperCase();

        if (accountRepository.findByEmail(request.getEmail()).isPresent()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email đã được sử dụng")
                    .build();
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        switch (role) {

            case "ADMIN" -> {
                Admin admin = new Admin();
                admin.setFullName(request.getFullName());
                admin.setEmail(request.getEmail());
                admin.setPassword(hashedPassword);
                adminRepository.save(admin);
            }

            case "USER" -> {
                User user = new User();
                user.setFullName(request.getFullName());
                user.setEmail(request.getEmail());
                user.setPassword(hashedPassword);
                userRepository.save(user);
            }

            case "BTC" -> {
                BtcStaff btc = new BtcStaff();
                btc.setFullName(request.getFullName());
                btc.setEmail(request.getEmail());
                btc.setPassword(hashedPassword);
                btcStaffRepository.save(btc);
            }

            default -> {
                return AuthResponse.builder()
                        .success(false)
                        .message("Loại tài khoản không hợp lệ")
                        .build();
            }
        }

        return AuthResponse.builder()
                .success(true)
                .message("Đăng ký thành công")
                .role(role)
                .name(request.getFullName())
                .email(request.getEmail())
                .build();
    }

    // ===========================
    // LOGIN (chung cho cả 3 role)
    // ===========================
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        Account account = accountRepository.findByEmail(request.getEmail()).orElse(null);

        if (account == null) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email không tồn tại")
                    .build();
        }

        boolean passwordOk;
        String stored = account.getPassword();

        if (stored != null && stored.startsWith("$2")) {
            // Mật khẩu đã được mã hoá bằng BCrypt
            passwordOk = passwordEncoder.matches(request.getPassword(), stored);
        } else {
            // Tài khoản cũ (tạo trước khi có mã hoá) - so sánh trực tiếp,
            // sau đó tự động nâng cấp sang mật khẩu đã mã hoá.
            passwordOk = stored != null && stored.equals(request.getPassword());
            if (passwordOk) {
                account.setPassword(passwordEncoder.encode(request.getPassword()));
                accountRepository.save(account);
            }
        }

        if (!passwordOk) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Sai mật khẩu")
                    .build();
        }

        String role = resolveRole(account);

        // Sinh token đăng nhập THẬT, duy nhất theo mỗi lần đăng nhập, và lưu
        // vào DB để các API khác xác thực được chính xác tài khoản đang gọi.
        String token = UUID.randomUUID().toString();
        account.setToken(token);
        accountRepository.save(account);

        return AuthResponse.builder()
                .success(true)
                .message("Đăng nhập thành công")
                .token(token)
                .role(role)
                .name(account.getFullName())
                .email(account.getEmail())
                .build();
    }

    // ===========================
    // LOGOUT
    // ===========================
    @PostMapping("/logout")
    public AuthResponse logout(HttpServletRequest request) {
        Account account = currentUserService.requireAccount(request);
        account.setToken(null);
        accountRepository.save(account);

        return AuthResponse.builder()
                .success(true)
                .message("Đã đăng xuất")
                .build();
    }

    private String resolveRole(Account account) {
        if (account instanceof Admin) return "ADMIN";
        if (account instanceof BtcStaff) return "BTC";
        return "USER";
    }
}
