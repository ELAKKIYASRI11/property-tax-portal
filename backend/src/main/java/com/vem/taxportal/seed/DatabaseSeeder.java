package com.vem.taxportal.seed;

import com.vem.taxportal.models.*;
import com.vem.taxportal.repositories.*;
import com.vem.taxportal.services.TaxEngineService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final AssessmentRepository assessmentRepository;
    private final PaymentRepository paymentRepository;
    private final GrievanceRepository grievanceRepository;
    private final UnassessedParcelRepository unassessedParcelRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final TaxEngineService taxEngineService;

    public DatabaseSeeder(UserRepository userRepository,
                          PropertyRepository propertyRepository,
                          AssessmentRepository assessmentRepository,
                          PaymentRepository paymentRepository,
                          GrievanceRepository grievanceRepository,
                          UnassessedParcelRepository unassessedParcelRepository,
                          NotificationRepository notificationRepository,
                          PasswordEncoder passwordEncoder,
                          TaxEngineService taxEngineService) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.assessmentRepository = assessmentRepository;
        this.paymentRepository = paymentRepository;
        this.grievanceRepository = grievanceRepository;
        this.unassessedParcelRepository = unassessedParcelRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.taxEngineService = taxEngineService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            System.out.println("Sathyamangalam database already contains data. Skipping seeder.");
            return;
        }

        System.out.println("Seeding Sathyamangalam Municipal Tax Portal Demo Data...");

        // 1. Users
        User admin = new User(
                "Dr. K. Sundaram (Municipal Commissioner)",
                "admin@vem.gov.in",
                passwordEncoder.encode("admin123"),
                "admin",
                "+91 94432 10001",
                LocalDate.of(1975, 6, 15),
                false,
                "Sathyamangalam Municipality Office, Municipal Road, Sathyamangalam — 638401"
        );
        userRepository.save(admin);

        User citizen1 = new User(
                "Ramanathan S",
                "raman@vem.gov.in",
                passwordEncoder.encode("citizen123"),
                "citizen",
                "+91 98421 55678",
                LocalDate.of(1956, 3, 22), // Age 70 → Senior Citizen 15% discount
                false,
                "42, Kamaraj Colony Main Road, Ward 10, Sathyamangalam — 638401"
        );
        userRepository.save(citizen1);

        User citizen2 = new User(
                "Ananya Roy",
                "ananya@vem.gov.in",
                passwordEncoder.encode("citizen123"),
                "citizen",
                "+91 97890 23456",
                LocalDate.of(1990, 8, 14),
                true, // Differently Abled 20% discount
                "Flat 3B, Housing Board Colony, Ward 15, Sathyamangalam — 638401"
        );
        userRepository.save(citizen2);

        System.out.println("Users seeded: admin@vem.gov.in, raman@vem.gov.in, ananya@vem.gov.in");

        // 2. Properties
        Property prop1 = new Property();
        prop1.setOwner(citizen1);
        prop1.setPropertyIdentifier("PID-2026-1001");
        prop1.setOwnerName(citizen1.getName());
        prop1.setPropertyType("Residential");
        prop1.setBuildingType("Pucca/RCC");
        prop1.setConstructionYear(2012);
        prop1.setLocation(new Location("Erode", "Sathyamangalam Municipality", "Ward 10",
                "Kamaraj Colony, Kamaraj Colony Main Road", "42/1", "638401"));
        prop1.setGisCoordinates(new GisCoordinates(11.5032, 77.2344));
        prop1.setLandAreaSqFt(2400.0);
        prop1.setBuiltUpAreaSqFt(1850.0);
        prop1.setOccupancyStatus("Owner Occupied");
        prop1.setComplianceScore(new ComplianceScore(92, "Good", LocalDateTime.now()));
        prop1.setIsVerified(true);
        propertyRepository.save(prop1);

        Property prop2 = new Property();
        prop2.setOwner(citizen1);
        prop2.setPropertyIdentifier("PID-2026-1002");
        prop2.setOwnerName(citizen1.getName());
        prop2.setPropertyType("Commercial");
        prop2.setBuildingType("Pucca/RCC");
        prop2.setConstructionYear(2017);
        prop2.setLocation(new Location("Erode", "Sathyamangalam Municipality", "Ward 04",
                "Main Bazaar, Main Bazaar Street", "108", "638401"));
        prop2.setGisCoordinates(new GisCoordinates(11.5104, 77.2356));
        prop2.setLandAreaSqFt(1200.0);
        prop2.setBuiltUpAreaSqFt(1100.0);
        prop2.setOccupancyStatus("Rented");
        prop2.setComplianceScore(new ComplianceScore(72, "At Risk", LocalDateTime.now()));
        prop2.setIsVerified(true);
        propertyRepository.save(prop2);

        Property prop3 = new Property();
        prop3.setOwner(citizen2);
        prop3.setPropertyIdentifier("PID-2026-1003");
        prop3.setOwnerName(citizen2.getName());
        prop3.setPropertyType("Residential");
        prop3.setBuildingType("Pucca/RCC");
        prop3.setConstructionYear(2020);
        prop3.setLocation(new Location("Erode", "Sathyamangalam Municipality", "Ward 15",
                "Housing Board Colony, HB Colony Main Road", "3B", "638401"));
        prop3.setGisCoordinates(new GisCoordinates(11.5090, 77.2261));
        prop3.setLandAreaSqFt(1500.0);
        prop3.setBuiltUpAreaSqFt(1350.0);
        prop3.setOccupancyStatus("Owner Occupied");
        prop3.setComplianceScore(new ComplianceScore(96, "Good", LocalDateTime.now()));
        prop3.setIsVerified(true);
        propertyRepository.save(prop3);

        Property prop4 = new Property();
        prop4.setOwner(citizen1);
        prop4.setPropertyIdentifier("PID-2026-1004");
        prop4.setOwnerName(citizen1.getName());
        prop4.setPropertyType("Agricultural");
        prop4.setBuildingType("Vacant Plot");
        prop4.setConstructionYear(2000);
        prop4.setLocation(new Location("Erode", "Sathyamangalam Municipality", "Ward 23",
                "Bhavani Road, Sathy–Bhavani National Highway", "Survey 88/4A", "638401"));
        prop4.setGisCoordinates(new GisCoordinates(11.4997, 77.2332));
        prop4.setLandAreaSqFt(10890.0);
        prop4.setBuiltUpAreaSqFt(0.0);
        prop4.setOccupancyStatus("Owner Occupied");
        prop4.setComplianceScore(new ComplianceScore(88, "Good", LocalDateTime.now()));
        prop4.setIsVerified(true);
        propertyRepository.save(prop4);

        System.out.println("Properties seeded with Sathyamangalam GIS coordinates.");

        // 3. Assessments & Payments
        // Assessment 1: Prop 1 (2024-2025) — Paid in full with receipt
        CalculationBreakdown calc1 = taxEngineService.calculatePropertyTax(prop1, citizen1);
        Assessment asm1 = new Assessment();
        asm1.setProperty(prop1);
        asm1.setUser(citizen1);
        asm1.setFinancialYear("2024-2025");
        asm1.setCalculationBreakdown(calc1);
        asm1.setStatus("Paid");
        asm1.setDueDate(LocalDate.of(2025, 3, 31));
        asm1.setPaidDate(LocalDate.of(2025, 2, 15));
        asm1.setAssessmentNumber("ASM-2024-00101");
        Assessment savedAsm1 = assessmentRepository.save(asm1);

        Payment payment1 = new Payment();
        payment1.setAssessment(savedAsm1);
        payment1.setProperty(prop1);
        payment1.setUser(citizen1);
        payment1.setReceiptNumber("RCPT-2025-884210");
        payment1.setTransactionId("TXN-1710500123-4512");
        payment1.setAmountPaid(calc1.getNetPayableAmount());
        payment1.setPaymentMethod("UPI");
        payment1.setPaymentDate(LocalDateTime.of(2025, 2, 15, 14, 30));
        payment1.setStatus("Success");
        payment1.setBreakdownSnapshot(new BreakdownSnapshot(
                calc1.getGrossTaxAmount(),
                calc1.getTotalExemptionAmount(),
                0,
                calc1.getNetPayableAmount()
        ));
        Payment savedPayment1 = paymentRepository.save(payment1);
        savedAsm1.setPayment(savedPayment1);
        assessmentRepository.save(savedAsm1);

        // Assessment 2: Prop 1 (2025-2026) — Pending
        CalculationBreakdown calc2 = taxEngineService.calculatePropertyTax(prop1, citizen1);
        Assessment asm2 = new Assessment();
        asm2.setProperty(prop1);
        asm2.setUser(citizen1);
        asm2.setFinancialYear("2025-2026");
        asm2.setCalculationBreakdown(calc2);
        asm2.setStatus("Pending");
        asm2.setDueDate(LocalDate.now().plusDays(25));
        asm2.setAssessmentNumber("ASM-2025-00102");
        assessmentRepository.save(asm2);

        // Assessment 3: Prop 2 (Commercial) — Disputed
        CalculationBreakdown calc3 = taxEngineService.calculatePropertyTax(prop2, citizen1);
        Assessment asm3 = new Assessment();
        asm3.setProperty(prop2);
        asm3.setUser(citizen1);
        asm3.setFinancialYear("2025-2026");
        asm3.setCalculationBreakdown(calc3);
        asm3.setStatus("Disputed");
        asm3.setDueDate(LocalDate.now().plusDays(25));
        asm3.setAssessmentNumber("ASM-2025-00103");
        Assessment savedAsm3 = assessmentRepository.save(asm3);

        // Grievance for Assessment 3
        Grievance grv = new Grievance();
        grv.setGrievanceNumber("GRV-2026-0001");
        grv.setUser(citizen1);
        grv.setProperty(prop2);
        grv.setAssessment(savedAsm3);
        grv.setDisputeType("Incorrect Built-up Area");
        grv.setDescription("The property record lists 1100 sq ft, but actual approved municipal blueprint area is only 850 sq ft due to mezzanine demolition last year. Requesting re-measurement by Sathyamangalam Municipality surveyor.");
        grv.setProofDocumentUrl("");
        grv.setStatus("Under Review");
        grv.setOriginalTaxAmount(calc3.getNetPayableAmount());
        grv.setAdminRemarks("");
        grievanceRepository.save(grv);

        // Assessment 4: Ananya's Property (2025-2026) — Pending with Differently Abled Concession
        CalculationBreakdown calc4 = taxEngineService.calculatePropertyTax(prop3, citizen2);
        Assessment asm4 = new Assessment();
        asm4.setProperty(prop3);
        asm4.setUser(citizen2);
        asm4.setFinancialYear("2025-2026");
        asm4.setCalculationBreakdown(calc4);
        asm4.setStatus("Pending");
        asm4.setDueDate(LocalDate.now().plusDays(25));
        asm4.setAssessmentNumber("ASM-2025-00104");
        assessmentRepository.save(asm4);

        System.out.println("Assessments, payment, and grievance seeded.");

        // 4. GIS Unassessed Parcels (Satellite Anomaly Detections)
        UnassessedParcel parcel1 = new UnassessedParcel();
        parcel1.setParcelId("GIS-PARCEL-2026-081");
        parcel1.setSurveyNumber("44/2A");
        parcel1.setLocationName("Near Bus Stand, Dharapuram Road Junction, Ward 01");
        parcel1.setWard("Ward 01");
        parcel1.setGisCoordinates(new GisCoordinates(11.5148, 77.2279));
        parcel1.setEstimatedLandAreaSqFt(4200.0);
        parcel1.setEstimatedBuiltUpAreaSqFt(3500.0);
        parcel1.setDetectedBuildingType("Commercial Complex / Showroom");
        parcel1.setEstimatedAnnualTaxLoss(112000);
        parcel1.setStatus("Uninspected");
        parcel1.setAdminActionRemarks("Identified via high-resolution satellite imagery overlay. New commercial shed construction with no tax registration on Sathyamangalam municipal record.");

        UnassessedParcel parcel2 = new UnassessedParcel();
        parcel2.setParcelId("GIS-PARCEL-2026-094");
        parcel2.setSurveyNumber("119/1B");
        parcel2.setLocationName("Bhavani Road Industrial Zone, Ward 23");
        parcel2.setWard("Ward 23");
        parcel2.setGisCoordinates(new GisCoordinates(11.4992, 77.2328));
        parcel2.setEstimatedLandAreaSqFt(3600.0);
        parcel2.setEstimatedBuiltUpAreaSqFt(3100.0);
        parcel2.setDetectedBuildingType("Warehouse / Storage Facility");
        parcel2.setEstimatedAnnualTaxLoss(87000);
        parcel2.setStatus("Notice Issued");
        parcel2.setAdminActionRemarks("Survey notice dispatched to occupant. Physical measurement by Sathyamangalam Town Survey team scheduled for next month.");

        UnassessedParcel parcel3 = new UnassessedParcel();
        parcel3.setParcelId("GIS-PARCEL-2026-105");
        parcel3.setSurveyNumber("201/3");
        parcel3.setLocationName("Ooty Road Bypass Expansion Zone, Ward 21");
        parcel3.setWard("Ward 21");
        parcel3.setGisCoordinates(new GisCoordinates(11.5074, 77.2442));
        parcel3.setEstimatedLandAreaSqFt(5800.0);
        parcel3.setEstimatedBuiltUpAreaSqFt(4000.0);
        parcel3.setDetectedBuildingType("Industrial Workshop / Manufacturing Unit");
        parcel3.setEstimatedAnnualTaxLoss(163000);
        parcel3.setStatus("Uninspected");
        parcel3.setAdminActionRemarks("Unregistered construction detected in late 2025 satellite scan. Structure erected on former agricultural land near Sathy–Mettur Road.");

        unassessedParcelRepository.saveAll(Arrays.asList(parcel1, parcel2, parcel3));
        System.out.println("GIS Unassessed Parcels seeded.");

        // 5. Notifications
        Notification notif1 = new Notification(
                citizen1,
                "Tax Assessment Ready for Self-Assessment",
                "Your property PID-2026-1001 (Kamaraj Colony, Sathyamangalam) assessment for FY 2025-2026 is due in 25 days. Senior citizen rebate auto-applied.",
                "assessment_due",
                prop1.getId()
        );

        Notification notif2 = new Notification(
                citizen1,
                "Dispute Status Update",
                "Grievance GRV-2026-0001 for PID-2026-1002 (Main Bazaar, Sathyamangalam) is currently Under Review by Sathyamangalam Municipal Revenue Assessors.",
                "grievance_status",
                prop2.getId()
        );

        Notification notif3 = new Notification(
                citizen2,
                "Differently Abled Concession Applied",
                "Your 20% differently-abled municipal tax exemption has been verified and applied to PID-2026-1003 (Housing Board Colony, Sathyamangalam).",
                "general",
                prop3.getId()
        );

        notificationRepository.saveAll(Arrays.asList(notif1, notif2, notif3));
        System.out.println("Notifications seeded.");
        System.out.println("✅ Sathyamangalam Database Seeding Completed Successfully!");
    }
}
