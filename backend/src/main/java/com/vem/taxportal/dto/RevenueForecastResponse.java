package com.vem.taxportal.dto;

import java.util.List;
import java.util.Map;

public class RevenueForecastResponse {
    private List<Map<String, Object>> quarters;
    private List<Map<String, Object>> wardCollectionBreakdown;
    private String modelAccuracy;
    private String estimatedQuarterlyGrowth;

    public RevenueForecastResponse() {}

    public RevenueForecastResponse(List<Map<String, Object>> quarters,
                                   List<Map<String, Object>> wardCollectionBreakdown,
                                   String modelAccuracy, String estimatedQuarterlyGrowth) {
        this.quarters = quarters;
        this.wardCollectionBreakdown = wardCollectionBreakdown;
        this.modelAccuracy = modelAccuracy;
        this.estimatedQuarterlyGrowth = estimatedQuarterlyGrowth;
    }

    public List<Map<String, Object>> getQuarters() { return quarters; }
    public void setQuarters(List<Map<String, Object>> quarters) { this.quarters = quarters; }

    public List<Map<String, Object>> getWardCollectionBreakdown() { return wardCollectionBreakdown; }
    public void setWardCollectionBreakdown(List<Map<String, Object>> wardCollectionBreakdown) { this.wardCollectionBreakdown = wardCollectionBreakdown; }

    public String getModelAccuracy() { return modelAccuracy; }
    public void setModelAccuracy(String modelAccuracy) { this.modelAccuracy = modelAccuracy; }

    public String getEstimatedQuarterlyGrowth() { return estimatedQuarterlyGrowth; }
    public void setEstimatedQuarterlyGrowth(String estimatedQuarterlyGrowth) { this.estimatedQuarterlyGrowth = estimatedQuarterlyGrowth; }
}
