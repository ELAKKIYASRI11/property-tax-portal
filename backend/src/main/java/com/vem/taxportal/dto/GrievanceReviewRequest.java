package com.vem.taxportal.dto;

public class GrievanceReviewRequest {
    private String status; // 'Approved', 'Rejected'
    private String adminRemarks;
    private Integer adjustedTaxAmount;

    public GrievanceReviewRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminRemarks() { return adminRemarks; }
    public void setAdminRemarks(String adminRemarks) { this.adminRemarks = adminRemarks; }

    public Integer getAdjustedTaxAmount() { return adjustedTaxAmount; }
    public void setAdjustedTaxAmount(Integer adjustedTaxAmount) { this.adjustedTaxAmount = adjustedTaxAmount; }
}
