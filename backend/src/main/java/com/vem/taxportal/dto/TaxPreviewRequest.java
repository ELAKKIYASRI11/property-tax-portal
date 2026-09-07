package com.vem.taxportal.dto;

import com.vem.taxportal.models.Property;

public class TaxPreviewRequest {
    private Long propertyId;
    private Property propertyData;

    public TaxPreviewRequest() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public Property getPropertyData() { return propertyData; }
    public void setPropertyData(Property propertyData) { this.propertyData = propertyData; }
}
