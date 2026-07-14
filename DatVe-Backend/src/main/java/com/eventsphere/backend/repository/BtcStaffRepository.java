package com.eventsphere.backend.repository;

import com.eventsphere.backend.entity.BtcStaff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BtcStaffRepository extends JpaRepository<BtcStaff, Long> {

    Optional<BtcStaff> findByEmail(String email);

}
