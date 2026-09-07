package com.vem.taxportal.controllers;

import com.vem.taxportal.dto.AdminStatsResponse;
import com.vem.taxportal.dto.GrievanceReviewRequest;
import com.vem.taxportal.dto.NoticeRequest;
import com.vem.taxportal.dto.RevenueForecastResponse;
import com.vem.taxportal.models.*;
import com.vem.taxportal.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PropertyRepository propertyRepository;
    private final AssessmentRepository assessmentRepository;
    private final PaymentRepository paymentRepository;
    private final GrievanceRepository grievanceRepository;
    private final UnassessedParcelRepository unassessedParcelRepository;
    private final NotificationRepository notificationRepository;

    public AdminController(PropertyRepository propertyRepository,
                           AssessmentRepository assessmentRepository,
                           PaymentRepository paymentRepository,
                           GrievanceRepository grievanceRepository,
                           UnassessedParcelRepository unassessedParcelRepository,
                           NotificationRepository notificationRepository) {
        this.propertyRepository = propertyRepository;
        this.assessmentRepository = assessmentRepository;
        this.paymentRepository = paymentRepository;
        this.grievanceRepository = grievanceRepository;
        this.unassessedParcelRepository = unassessedParcelRepository;
        this.notificationRepository = notificationRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user;
        }
        return null;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        long totalProperties = propertyRepository.count();
        List<Payment> payments = paymentRepository.findAll();
        long totalRevenue = payments.stream().mapToLong(Payment::getAmountPaid).sum();

        List<Assessment> assessments = assessmentRepository.findAll();
        long pendingRevenue = 0;
        long overdueCount = 0;
        LocalDate now = LocalDate.now();

        for (Assessment a : assessments) {
            if ("Pending".equalsIgnoreCase(a.getStatus())) {
                if (a.getCalculationBreakdown() != null && a.getCalculationBreakdown().getNetPayableAmount() != null) {
                    pendingRevenue += a.getCalculationBreakdown().getNetPayableAmount();
                }
                if (a.getDueDate() != null && a.getDueDate().isBefore(now)) {
                    overdueCount++;
                }
            }
        }

        long unassessedCount = unassessedParcelRepository.countByStatusNot("Assessed");
        long pendingGrievances = grievanceRepository.countByStatus("Under Review");

        long goodCompliance = propertyRepository.countByComplianceScoreRating("Good");
        long atRiskCompliance = propertyRepository.countByComplianceScoreRating("At Risk");
        long defaulterCompliance = propertyRepository.countByComplianceScoreRating("Defaulter");

        Map<String, Long> compliance = new HashMap<>();
        compliance.put("good", goodCompliance);
        compliance.put("atRisk", atRiskCompliance);
        compliance.put("defaulter", defaulterCompliance);

        AdminStatsResponse response = new AdminStatsResponse(
                totalProperties, totalRevenue, pendingRevenue,
                unassessedCount, pendingGrievances, overdueCount,
                compliance
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/gis-layer")
    public ResponseEntity<?> getGisLayer() {
        List<Property> verifiedProperties = propertyRepository.findAll();
        List<UnassessedParcel> unassessedParcels = unassessedParcelRepository.findAllByOrderByCreatedAtDesc();

        return ResponseEntity.ok(Map.of(
                "verifiedProperties", verifiedProperties,
                "unassessedParcels", unassessedParcels
        ));
    }

    @PostMapping("/unassessed/{id}/notice")
    public ResponseEntity<?> issueComplianceNotice(@PathVariable Long id, @RequestBody(required = false) NoticeRequest req) {
        Optional<UnassessedParcel> parcelOpt = unassessedParcelRepository.findById(id);
        if (parcelOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Unassessed parcel not found"));
        }

        UnassessedParcel parcel = parcelOpt.get();
        parcel.setStatus("Notice Issued");
        parcel.setAdminActionRemarks(req != null && req.getRemarks() != null && !req.getRemarks().isBlank() ?
                req.getRemarks() : "Statutory GIS survey notice issued under Section 112 Municipal Act.");

        UnassessedParcel saved = unassessedParcelRepository.save(parcel);

        return ResponseEntity.ok(Map.of(
                "message", "Compliance notice issued successfully",
                "parcel", saved
        ));
    }

    @GetMapping("/revenue-forecast")
    public ResponseEntity<?> getRevenueForecast() {
        List<Payment> payments = paymentRepository.findAll();
        long totalCollected = payments.stream().mapToLong(Payment::getAmountPaid).sum();

        List<Map<String, Object>> quarters = new ArrayList<>();
        quarters.add(Map.of("quarter", "Q1 2025", "actual", 480000, "projected", 460000, "target", 500000));
        quarters.add(Map.of("quarter", "Q2 2025", "actual", 520000, "projected", 510000, "target", 550000));
        quarters.add(Map.of("quarter", "Q3 2025", "actual", 610000, "projected", 590000, "target", 600000));
        quarters.add(Map.of("quarter", "Q4 2025", "actual", 750000, "projected", 720000, "target", 700000));

        Map<String, Object> q1_2026 = new HashMap<>();
        q1_2026.put("quarter", "Q1 2026");
        q1_2026.put("actual", Math.round(totalCollected * 0.45) + 380000);
        q1_2026.put("projected", 640000);
        q1_2026.put("target", 680000);
        quarters.add(q1_2026);

        Map<String, Object> q2 = new HashMap<>();
        q2.put("quarter", "Q2 2026 (Est)");
        q2.put("actual", null);
        q2.put("projected", 810000);
        q2.put("target", 800000);
        quarters.add(q2);

        Map<String, Object> q3 = new HashMap<>();
        q3.put("quarter", "Q3 2026 (Est)");
        q3.put("actual", null);
        q3.put("projected", 890000);
        q3.put("target", 880000);
        quarters.add(q3);

        Map<String, Object> q4 = new HashMap<>();
        q4.put("quarter", "Q4 2026 (Est)");
        q4.put("actual", null);
        q4.put("projected", 1050000);
        q4.put("target", 1000000);
        quarters.add(q4);

        List<Map<String, Object>> wardBreakdown = new ArrayList<>();
        wardBreakdown.add(Map.of("ward", "Ward 01 - Bus Stand Zone", "collected", 245000, "potential", 310000, "complianceRate", 79));
        wardBreakdown.add(Map.of("ward", "Ward 04 - Main Bazaar", "collected", 490000, "potential", 540000, "complianceRate", 91));
        wardBreakdown.add(Map.of("ward", "Ward 10 - Kamaraj Colony", "collected", 380000, "potential", 470000, "complianceRate", 81));
        wardBreakdown.add(Map.of("ward", "Ward 15 - Housing Board", "collected", 180000, "potential", 260000, "complianceRate", 69));
        wardBreakdown.add(Map.of("ward", "Ward 23 - Bhavani Road", "collected", 165000, "potential", 290000, "complianceRate", 57));

        RevenueForecastResponse forecast = new RevenueForecastResponse(
                quarters,
                wardBreakdown,
                "94.2%",
                "+14.8%"
        );

        return ResponseEntity.ok(forecast);
    }

    @GetMapping("/grievances")
    public ResponseEntity<?> getAllGrievances() {
        List<Grievance> grievances = grievanceRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(grievances);
    }

    @PutMapping("/grievances/{id}")
    public ResponseEntity<?> reviewGrievance(@PathVariable Long id, @RequestBody GrievanceReviewRequest req) {
        User adminUser = getAuthenticatedUser();
        if (adminUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Grievance> grievanceOpt = grievanceRepository.findById(id);
        if (grievanceOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Grievance not found"));
        }

        Grievance grievance = grievanceOpt.get();
        String newStatus = req.getStatus() != null ? req.getStatus() : "Under Review";
        grievance.setStatus(newStatus);
        grievance.setAdminRemarks(req.getAdminRemarks() != null ? req.getAdminRemarks() : "");
        grievance.setResolvedBy(adminUser);
        grievance.setResolvedAt(LocalDateTime.now());

        if ("Approved".equalsIgnoreCase(newStatus) && req.getAdjustedTaxAmount() != null) {
            grievance.setAdjustedTaxAmount(req.getAdjustedTaxAmount());
            if (grievance.getAssessment() != null) {
                Assessment assessment = grievance.getAssessment();
                if (assessment.getCalculationBreakdown() != null) {
                    assessment.getCalculationBreakdown().setNetPayableAmount(req.getAdjustedTaxAmount());
                }
                assessment.setStatus("Pending");
                assessmentRepository.save(assessment);
            }
        } else if ("Rejected".equalsIgnoreCase(newStatus)) {
            if (grievance.getAssessment() != null) {
                Assessment assessment = grievance.getAssessment();
                assessment.setStatus("Pending");
                assessmentRepository.save(assessment);
            }
        }

        Grievance saved = grievanceRepository.save(grievance);

        // Notify citizen
        int finalAmount = saved.getAdjustedTaxAmount() != null ? saved.getAdjustedTaxAmount() : saved.getOriginalTaxAmount();
        Notification notification = new Notification(
                saved.getUser(),
                String.format("Grievance %s %s", saved.getGrievanceNumber(), newStatus),
                String.format("Your assessment dispute has been %s. Remarks: %s. Final Payable Tax: ₹%,d.",
                        newStatus, saved.getAdminRemarks().isBlank() ? "N/A" : saved.getAdminRemarks(), finalAmount),
                "grievance_status",
                saved.getProperty() != null ? saved.getProperty().getId() : null
        );
        notificationRepository.save(notification);

        return ResponseEntity.ok(Map.of(
                "message", "Grievance has been " + newStatus,
                "grievance", saved
        ));
    }
}
