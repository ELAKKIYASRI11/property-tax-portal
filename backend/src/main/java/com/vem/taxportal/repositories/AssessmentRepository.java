package com.vem.taxportal.repositories;

import com.vem.taxportal.models.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Assessment> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
    Optional<Assessment> findByPropertyIdAndFinancialYear(Long propertyId, String financialYear);
    Optional<Assessment> findByAssessmentNumber(String assessmentNumber);
    long countByStatus(String status);
}
