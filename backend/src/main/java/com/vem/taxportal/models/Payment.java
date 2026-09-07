package com.vem.taxportal.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "assessment_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"payment"})
    private Assessment assessment;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true)
    private String receiptNumber;

    @Column(nullable = false, unique = true)
    private String transactionId;

    @Column(nullable = false)
    private Integer amountPaid;

    @Column(nullable = false)
    private String paymentMethod = "UPI"; // UPI, Credit/Debit Card, Net Banking, Municipal Counter

    private LocalDateTime paymentDate = LocalDateTime.now();

    @Column(nullable = false)
    private String status = "Success"; // Success, Pending, Failed

    @Convert(converter = BreakdownSnapshotConverter.class)
    @Column(columnDefinition = "TEXT")
    private BreakdownSnapshot breakdownSnapshot;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Payment() {}

    @PrePersist
    public void onPrePersist() {
        if (paymentDate == null) paymentDate = LocalDateTime.now();
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

    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Integer getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Integer amountPaid) { this.amountPaid = amountPaid; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BreakdownSnapshot getBreakdownSnapshot() { return breakdownSnapshot; }
    public void setBreakdownSnapshot(BreakdownSnapshot breakdownSnapshot) { this.breakdownSnapshot = breakdownSnapshot; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
