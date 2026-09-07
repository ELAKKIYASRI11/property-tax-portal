package com.vem.taxportal.controllers;

import com.vem.taxportal.dto.AssessmentRequest;
import com.vem.taxportal.dto.TaxPreviewRequest;
import com.vem.taxportal.models.*;
import com.vem.taxportal.repositories.AssessmentRepository;
import com.vem.taxportal.repositories.NotificationRepository;
import com.vem.taxportal.repositories.PropertyRepository;
import com.vem.taxportal.repositories.UserRepository;
import com.vem.taxportal.services.TaxEngineService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/tax")
public class TaxController {

    private final AssessmentRepository assessmentRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final TaxEngineService taxEngineService;

    public TaxController(AssessmentRepository assessmentRepository,
                         PropertyRepository propertyRepository,
                         UserRepository userRepository,
                         NotificationRepository notificationRepository,
                         TaxEngineService taxEngineService) {
        this.assessmentRepository = assessmentRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.taxEngineService = taxEngineService;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return userRepository.findById(user.getId()).orElse(user);
        }
        return null;
    }

    @PostMapping("/preview")
    public ResponseEntity<?> previewTax(@RequestBody TaxPreviewRequest req) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Property property = req.getPropertyData();
        if (req.getPropertyId() != null) {
            Optional<Property> propOpt = propertyRepository.findById(req.getPropertyId());
            if (propOpt.isPresent()) {
                property = propOpt.get();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Property not found"));
            }
        }

        if (property == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Please provide property details or property ID"));
        }

        CalculationBreakdown calculation = taxEngineService.calculatePropertyTax(property, user);
        return ResponseEntity.ok(Map.of("calculation", calculation, "property", property, "user", user));
    }

    @PostMapping("/assess")
    public ResponseEntity<?> createAssessment(@RequestBody AssessmentRequest req) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        if (req.getPropertyId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Property ID is required"));
        }

        Optional<Property> propOpt = propertyRepository.findById(req.getPropertyId());
        if (propOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Property not found"));
        }

        Property property = propOpt.get();
        boolean isAdmin = "admin".equalsIgnoreCase(user.getRole());
        if (!Objects.equals(property.getOwner().getId(), user.getId()) && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Unauthorized for this property"));
        }

        String year = req.getFinancialYear() != null && !req.getFinancialYear().isBlank() ?
                req.getFinancialYear() : "2025-2026";

        Optional<Assessment> existingOpt = assessmentRepository.findByPropertyIdAndFinancialYear(property.getId(), year);
        if (existingOpt.isPresent() && !"Disputed".equalsIgnoreCase(existingOpt.get().getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message", String.format("An assessment for financial year %s already exists with status: %s",
                            year, existingOpt.get().getStatus()),
                    "assessment", existingOpt.get()
            ));
        }

        CalculationBreakdown calculation = taxEngineService.calculatePropertyTax(property, user);

        long count = assessmentRepository.count();
        String startYear = year.split("-")[0];
        String assessmentNumber = String.format("ASM-%s-%05d", startYear, count + 1);

        LocalDate dueDate = LocalDate.now().plusDays(30);

        Assessment assessment = new Assessment();
        assessment.setProperty(property);
        assessment.setUser(user);
        assessment.setFinancialYear(year);
        assessment.setCalculationBreakdown(calculation);
        assessment.setStatus("Pending");
        assessment.setDueDate(dueDate);
        assessment.setAssessmentNumber(assessmentNumber);

        Assessment saved = assessmentRepository.save(assessment);

        // Auto notification
        Notification notification = new Notification(
                user,
                "Tax Assessment Generated",
                String.format("Tax assessment %s for %s has been calculated: ₹%d. Due date: %s.",
                        assessmentNumber, property.getPropertyIdentifier(), calculation.getNetPayableAmount(), dueDate),
                "assessment_due",
                property.getId()
        );
        notificationRepository.save(notification);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/my-assessments")
    public ResponseEntity<?> getMyAssessments() {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<Assessment> assessments = assessmentRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(assessments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssessmentById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Assessment> asmOpt = assessmentRepository.findById(id);
        if (asmOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Assessment not found"));
        }

        Assessment assessment = asmOpt.get();
        boolean isAdmin = "admin".equalsIgnoreCase(user.getRole());
        if (!Objects.equals(assessment.getUser().getId(), user.getId()) && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Unauthorized"));
        }

        return ResponseEntity.ok(assessment);
    }
}
