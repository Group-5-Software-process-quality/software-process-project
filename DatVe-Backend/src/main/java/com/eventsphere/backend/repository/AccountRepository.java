package com.eventsphere.backend.repository;

import com.eventsphere.backend.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository dùng chung để tìm tài khoản theo email, bất kể role
 * (ADMIN / USER / BTC), phục vụ cho việc login chung và kiểm tra
 * trùng email khi đăng ký.
 */
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByEmail(String email);

    Optional<Account> findByToken(String token);

}
