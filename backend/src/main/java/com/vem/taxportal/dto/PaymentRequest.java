package com.vem.taxportal.dto;

public class PaymentRequest {
    private Long assessmentId;
    private String paymentMethod;

    public PaymentRequest() {}

    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
