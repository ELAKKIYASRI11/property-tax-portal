package com.vem.taxportal.dto;

import java.util.Map;

public class AdminStatsResponse {
    private long totalProperties;
    private long totalRevenue;
    private long pendingRevenue;
    private long unassessedCount;
    private long pendingGrievances;
    private long overdueCount;
    private Map<String, Long> complianceBreakdown;

    public AdminStatsResponse() {}

    public AdminStatsResponse(long totalProperties, long totalRevenue, long pendingRevenue,
                              long unassessedCount, long pendingGrievances, long overdueCount,
                              Map<String, Long> complianceBreakdown) {
        this.totalProperties = totalProperties;
        this.totalRevenue = totalRevenue;
        this.pendingRevenue = pendingRevenue;
        this.unassessedCount = unassessedCount;
        this.pendingGrievances = pendingGrievances;
        this.overdueCount = overdueCount;
        this.complianceBreakdown = complianceBreakdown;
    }

    public long getTotalProperties() { return totalProperties; }
    public void setTotalProperties(long totalProperties) { this.totalProperties = totalProperties; }

    public long getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(long totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getPendingRevenue() { return pendingRevenue; }
    public void setPendingRevenue(long pendingRevenue) { this.pendingRevenue = pendingRevenue; }

    public long getUnassessedCount() { return unassessedCount; }
    public void setUnassessedCount(long unassessedCount) { this.unassessedCount = unassessedCount; }

    public long getPendingGrievances() { return pendingGrievances; }
    public void setPendingGrievances(long pendingGrievances) { this.pendingGrievances = pendingGrievances; }

    public long getOverdueCount() { return overdueCount; }
    public void setOverdueCount(long overdueCount) { this.overdueCount = overdueCount; }

    public Map<String, Long> getComplianceBreakdown() { return complianceBreakdown; }
    public void setComplianceBreakdown(Map<String, Long> complianceBreakdown) { this.complianceBreakdown = complianceBreakdown; }
}
