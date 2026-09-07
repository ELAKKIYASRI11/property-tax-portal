package com.vem.taxportal.dto;

public class AssessmentRequest {
    private Long propertyId;
    private String financialYear;

    public AssessmentRequest() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getFinancialYear() { return financialYear; }
    public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }
}
