package com.vem.taxportal.controllers;

import com.vem.taxportal.models.*;
import com.vem.taxportal.repositories.AssessmentRepository;
import com.vem.taxportal.repositories.GrievanceRepository;
import com.vem.taxportal.repositories.NotificationRepository;
import com.vem.taxportal.services.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/grievances")
public class GrievanceController {

    private final GrievanceRepository grievanceRepository;
    private final AssessmentRepository assessmentRepository;
    private final NotificationRepository notificationRepository;
    private final FileStorageService fileStorageService;

    public GrievanceController(GrievanceRepository grievanceRepository,
                               AssessmentRepository assessmentRepository,
                               NotificationRepository notificationRepository,
                               FileStorageService fileStorageService) {
        this.grievanceRepository = grievanceRepository;
        this.assessmentRepository = assessmentRepository;
        this.notificationRepository = notificationRepository;
        this.fileStorageService = fileStorageService;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user;
        }
        return null;
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> fileGrievance(
            @RequestParam(value = "assessmentId", required = false) Long paramAssessmentId,
            @RequestParam(value = "disputeType", required = false) String paramDisputeType,
            @RequestParam(value = "description", required = false) String paramDescription,
            @RequestParam(value = "proofDocument", required = false) MultipartFile file,
            @RequestBody(required = false) Map<String, Object> body) {

        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Long assessmentId = paramAssessmentId;
        String disputeType = paramDisputeType;
        String description = paramDescription;

        if (body != null) {
            if (assessmentId == null && body.containsKey("assessmentId")) {
                assessmentId = Long.parseLong(String.valueOf(body.get("assessmentId")));
            }
            if (disputeType == null && body.containsKey("disputeType")) {
                disputeType = (String) body.get("disputeType");
            }
            if (description == null && body.containsKey("description")) {
                description = (String) body.get("description");
            }
        }

        if (assessmentId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Assessment ID is required"));
        }

        Optional<Assessment> asmOpt = assessmentRepository.findById(assessmentId);
        if (asmOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Assessment not found"));
        }

        Assessment assessment = asmOpt.get();
        if ("Paid".equalsIgnoreCase(assessment.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Cannot dispute an already paid assessment without visiting municipal office"));
        }

        String proofDocumentUrl = "";
        if (file != null && !file.isEmpty()) {
            proofDocumentUrl = fileStorageService.storeFile(file);
        }

        long count = grievanceRepository.count();
        int year = Year.now().getValue();
        String grievanceNumber = String.format("GRV-%d-%04d", year, count + 1);

        Grievance grievance = new Grievance();
        grievance.setGrievanceNumber(grievanceNumber);
        grievance.setUser(user);
        grievance.setProperty(assessment.getProperty());
        grievance.setAssessment(assessment);
        grievance.setDisputeType(disputeType != null ? disputeType : "Incorrect Built-up Area");
        grievance.setDescription(description != null ? description : "");
        grievance.setProofDocumentUrl(proofDocumentUrl);
        grievance.setOriginalTaxAmount(assessment.getCalculationBreakdown().getNetPayableAmount());
        grievance.setStatus("Under Review");

        Grievance saved = grievanceRepository.save(grievance);

        // Update assessment status
        assessment.setStatus("Disputed");
        assessmentRepository.save(assessment);

        // Notification
        Notification notification = new Notification(
                user,
                "Dispute Registered",
                String.format("Your grievance %s for %s is Under Review by Municipal Revenue Assessors.",
                        grievanceNumber, assessment.getProperty().getPropertyIdentifier()),
                "grievance_status",
                assessment.getProperty().getId()
        );
        notificationRepository.save(notification);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyGrievances() {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<Grievance> grievances = grievanceRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(grievances);
    }
}
