package com.vem.taxportal.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String financialYear = "2025-2026";

    @Convert(converter = CalculationBreakdownConverter.class)
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private CalculationBreakdown calculationBreakdown;

    @Column(nullable = false)
    private String status = "Pending"; // 'Pending', 'Paid', 'Disputed'

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate paidDate;

    @ManyToOne
    @JoinColumn(name = "payment_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"assessment"})
    private Payment payment;

    @Column(nullable = false, unique = true)
    private String assessmentNumber;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Assessment() {}

    @PrePersist
    public void onPrePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @JsonProperty("_id")
    public Long get_id() { return id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFinancialYear() { return financialYear; }
    public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }

    public CalculationBreakdown getCalculationBreakdown() { return calculationBreakdown; }
    public void setCalculationBreakdown(CalculationBreakdown calculationBreakdown) { this.calculationBreakdown = calculationBreakdown; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }

    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }

    public String getAssessmentNumber() { return assessmentNumber; }
    public void setAssessmentNumber(String assessmentNumber) { this.assessmentNumber = assessmentNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
