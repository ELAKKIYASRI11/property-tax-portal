package com.vem.taxportal.controllers;

import com.vem.taxportal.dto.PaymentRequest;
import com.vem.taxportal.models.*;
import com.vem.taxportal.repositories.AssessmentRepository;
import com.vem.taxportal.repositories.NotificationRepository;
import com.vem.taxportal.repositories.PaymentRepository;
import com.vem.taxportal.repositories.PropertyRepository;
import com.vem.taxportal.services.ComplianceScoreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final AssessmentRepository assessmentRepository;
    private final PropertyRepository propertyRepository;
    private final NotificationRepository notificationRepository;
    private final ComplianceScoreService complianceScoreService;

    public PaymentController(PaymentRepository paymentRepository,
                             AssessmentRepository assessmentRepository,
                             PropertyRepository propertyRepository,
                             NotificationRepository notificationRepository,
                             ComplianceScoreService complianceScoreService) {
        this.paymentRepository = paymentRepository;
        this.assessmentRepository = assessmentRepository;
        this.propertyRepository = propertyRepository;
        this.notificationRepository = notificationRepository;
        this.complianceScoreService = complianceScoreService;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user;
        }
        return null;
    }

    @PostMapping("/pay")
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest req) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        if (req.getAssessmentId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Assessment ID is required"));
        }

        Optional<Assessment> asmOpt = assessmentRepository.findById(req.getAssessmentId());
        if (asmOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Assessment record not found"));
        }

        Assessment assessment = asmOpt.get();
        if ("Paid".equalsIgnoreCase(assessment.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "This assessment has already been paid in full"));
        }

        long timestamp = System.currentTimeMillis();
        int randTxn = 1000 + new Random().nextInt(9000);
        int randRcpt = 100000 + new Random().nextInt(900000);
        int currentYear = Year.now().getValue();

        String transactionId = String.format("TXN-%d-%d", timestamp, randTxn);
        String receiptNumber = String.format("RCPT-%d-%d", currentYear, randRcpt);

        int amountPaid = assessment.getCalculationBreakdown().getNetPayableAmount();

        BreakdownSnapshot snapshot = new BreakdownSnapshot(
                assessment.getCalculationBreakdown().getGrossTaxAmount(),
                assessment.getCalculationBreakdown().getTotalExemptionAmount(),
                assessment.getCalculationBreakdown().getLatePenalty(),
                amountPaid
        );

        Payment payment = new Payment();
        payment.setAssessment(assessment);
        payment.setProperty(assessment.getProperty());
        payment.setUser(user);
        payment.setReceiptNumber(receiptNumber);
        payment.setTransactionId(transactionId);
        payment.setAmountPaid(amountPaid);
        payment.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "UPI");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus("Success");
        payment.setBreakdownSnapshot(snapshot);

        Payment savedPayment = paymentRepository.save(payment);

        // Update assessment
        assessment.setStatus("Paid");
        assessment.setPaidDate(LocalDate.now());
        assessment.setPayment(savedPayment);
        assessmentRepository.save(assessment);

        // Recompute compliance score
        ComplianceScore compliance = complianceScoreService.computeComplianceScore(assessment.getProperty().getId());
        Property property = assessment.getProperty();
        property.setComplianceScore(compliance);
        propertyRepository.save(property);

        // Notification
        Notification notification = new Notification(
                user,
                "Payment Successful",
                String.format("Tax payment of ₹%,d for %s received. Receipt No: %s. Compliance Rating: %s.",
                        amountPaid, property.getPropertyIdentifier(), receiptNumber, compliance.getRating()),
                "general",
                property.getId()
        );
        notificationRepository.save(notification);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Payment completed successfully");
        response.put("payment", savedPayment);
        response.put("receiptNumber", receiptNumber);
        response.put("complianceRating", compliance.getRating());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory() {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<Payment> payments = paymentRepository.findByUserIdOrderByPaymentDateDesc(user.getId());
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/receipt/{id}")
    public ResponseEntity<?> getPaymentReceipt(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Payment> paymentOpt = paymentRepository.findById(id);
        if (paymentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Receipt not found"));
        }

        Payment payment = paymentOpt.get();
        boolean isAdmin = "admin".equalsIgnoreCase(user.getRole());
        if (!Objects.equals(payment.getUser().getId(), user.getId()) && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Unauthorized"));
        }

        return ResponseEntity.ok(payment);
    }
}
