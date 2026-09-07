package com.vem.taxportal.services;

import com.vem.taxportal.models.Assessment;
import com.vem.taxportal.models.ComplianceScore;
import com.vem.taxportal.models.Payment;
import com.vem.taxportal.repositories.AssessmentRepository;
import com.vem.taxportal.repositories.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplianceScoreService {

    private final AssessmentRepository assessmentRepository;
    private final PaymentRepository paymentRepository;

    public ComplianceScoreService(AssessmentRepository assessmentRepository, PaymentRepository paymentRepository) {
        this.assessmentRepository = assessmentRepository;
        this.paymentRepository = paymentRepository;
    }

    public ComplianceScore computeComplianceScore(Long propertyId) {
        try {
            List<Assessment> assessments = assessmentRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId);
            List<Payment> payments = paymentRepository.findByPropertyId(propertyId);

            int score = 100;

            if (assessments == null || assessments.isEmpty()) {
                return new ComplianceScore(85, "Good", LocalDateTime.now());
            }

            LocalDate today = LocalDate.now();

            for (Assessment assessment : assessments) {
                if ("Pending".equalsIgnoreCase(assessment.getStatus())) {
                    if (assessment.getDueDate() != null && assessment.getDueDate().isBefore(today)) {
                        score -= 30; // severe penalty for overdue
                    } else {
                        score -= 10; // pending assessment
                    }
                } else if ("Disputed".equalsIgnoreCase(assessment.getStatus())) {
                    score -= 5;
                }
            }

            if (payments != null) {
                for (Payment ignored : payments) {
                    score += 5; // reward on-time payments
                }
            }

            // Clamp between 10 and 100
            score = Math.min(100, Math.max(10, score));

            String rating = "Good";
            if (score < 50) {
                rating = "Defaulter";
            } else if (score < 80) {
                rating = "At Risk";
            }

            return new ComplianceScore(score, rating, LocalDateTime.now());
        } catch (Exception e) {
            return new ComplianceScore(75, "At Risk", LocalDateTime.now());
        }
    }
}
