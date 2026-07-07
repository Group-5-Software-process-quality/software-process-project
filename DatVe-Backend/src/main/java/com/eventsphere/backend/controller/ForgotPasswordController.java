package com.eventsphere.backend.controller;

import com.eventsphere.backend.entity.Admin;
import com.eventsphere.backend.repository.AdminRepository;
import com.eventsphere.backend.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ForgotPasswordController {

    private final AdminRepository adminRepository;
    private final MailService mailService;

    // Lưu OTP tạm thời
    private final Map<String, String> otpStore = new HashMap<>();

    // =============================
    // GỬI OTP
    // =============================
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {

        Admin admin = adminRepository.findByEmail(email).orElse(null);

        if (admin == null) {
            return "Email not found";
        }

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        otpStore.put(email, otp);

        // LOG DEBUG
        System.out.println("==================================");
        System.out.println("OTP CREATED");
        System.out.println("Email : " + email);
        System.out.println("OTP   : " + otp);
        System.out.println("==================================");

        mailService.sendOtp(email, otp);

        return "OTP sent successfully";
    }

    // =============================
    // KIỂM TRA OTP
    // =============================
    @PostMapping("/verify-otp")
    public String verifyOtp(
            @RequestParam String email,
            @RequestParam String otp
    ) {

        String savedOtp = otpStore.get(email);

        // LOG DEBUG
        System.out.println("==================================");
        System.out.println("VERIFY OTP");
        System.out.println("Email      : " + email);
        System.out.println("Input OTP  : " + otp);
        System.out.println("Saved OTP  : " + savedOtp);
        System.out.println("==================================");

        if (savedOtp == null) {
            return "OTP expired";
        }

        if (!savedOtp.equals(otp)) {
            return "Invalid OTP";
        }

        return "OTP verified";
    }

    // =============================
    // ĐỔI MẬT KHẨU
    // =============================
    @PostMapping("/reset-password")
    public String resetPassword(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword
    ) {

        String savedOtp = otpStore.get(email);

        // LOG DEBUG
        System.out.println("==================================");
        System.out.println("RESET PASSWORD");
        System.out.println("Email      : " + email);
        System.out.println("Input OTP  : " + otp);
        System.out.println("Saved OTP  : " + savedOtp);
        System.out.println("==================================");

        if (savedOtp == null) {
            return "OTP expired";
        }

        if (!savedOtp.equals(otp)) {
            return "Invalid OTP";
        }

        Admin admin = adminRepository.findByEmail(email).orElse(null);

        if (admin == null) {
            return "Email not found";
        }

        admin.setPassword(newPassword);

        adminRepository.save(admin);

        // Xóa OTP sau khi đổi mật khẩu thành công
        otpStore.remove(email);

        return "Password changed successfully";
    }
}