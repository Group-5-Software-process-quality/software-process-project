package com.eventsphere.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Sau khi gộp 3 project (Admin, Customer, BTC) lại làm một, mỗi phần
 * front-end được phục vụ tại 1 đường dẫn riêng bởi cùng 1 Spring Boot app:
 *
 *   - Admin      : http://localhost:8080/            (thư mục static/)
 *   - Customer   : http://localhost:8080/customer/    (thư mục FE-Customer/)
 *   - BTC        : http://localhost:8080/btc/         (thư mục FE-BTC/)
 *
 * Trang login.html / register.html dùng chung nằm ở static/ (root)
 * và điều hướng người dùng tới đúng khu vực theo role sau khi đăng nhập.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/customer/**")
                .addResourceLocations("classpath:/FE-Customer/");

        registry.addResourceHandler("/btc/**")
                .addResourceLocations("classpath:/FE-BTC/");
    }
}
