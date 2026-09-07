package com.vem.taxportal.repositories;

import com.vem.taxportal.models.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {
    List<Grievance> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Grievance> findAllByOrderByCreatedAtDesc();
    Optional<Grievance> findByGrievanceNumber(String grievanceNumber);
    long countByStatus(String status);
}
