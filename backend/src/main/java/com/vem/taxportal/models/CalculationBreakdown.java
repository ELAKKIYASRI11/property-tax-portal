package com.vem.taxportal.models;

import java.util.ArrayList;
import java.util.List;

public class CalculationBreakdown {
    private Double areaEvaluated;
    private String areaType = "Built-up Area";
    private Integer zoneBaseRate;
    private Integer baseTax;
    private Double usageMultiplier;
    private Double buildingTypeFactor;
    private Integer buildingAge;
    private Integer depreciationRate;
    private Integer depreciationAmount;
    private Double occupancyFactor;
    private Integer grossTaxAmount;
    private List<ExemptionItem> exemptions = new ArrayList<>();
    private Integer totalExemptionAmount = 0;
    private Integer latePenalty = 0;
    private Integer netPayableAmount;

    public CalculationBreakdown() {}

    public Double getAreaEvaluated() { return areaEvaluated; }
    public void setAreaEvaluated(Double areaEvaluated) { this.areaEvaluated = areaEvaluated; }

    public String getAreaType() { return areaType; }
    public void setAreaType(String areaType) { this.areaType = areaType; }

    public Integer getZoneBaseRate() { return zoneBaseRate; }
    public void setZoneBaseRate(Integer zoneBaseRate) { this.zoneBaseRate = zoneBaseRate; }

    public Integer getBaseTax() { return baseTax; }
    public void setBaseTax(Integer baseTax) { this.baseTax = baseTax; }

    public Double getUsageMultiplier() { return usageMultiplier; }
    public void setUsageMultiplier(Double usageMultiplier) { this.usageMultiplier = usageMultiplier; }

    public Double getBuildingTypeFactor() { return buildingTypeFactor; }
    public void setBuildingTypeFactor(Double buildingTypeFactor) { this.buildingTypeFactor = buildingTypeFactor; }

    public Integer getBuildingAge() { return buildingAge; }
    public void setBuildingAge(Integer buildingAge) { this.buildingAge = buildingAge; }

    public Integer getDepreciationRate() { return depreciationRate; }
    public void setDepreciationRate(Integer depreciationRate) { this.depreciationRate = depreciationRate; }

    public Integer getDepreciationAmount() { return depreciationAmount; }
    public void setDepreciationAmount(Integer depreciationAmount) { this.depreciationAmount = depreciationAmount; }

    public Double getOccupancyFactor() { return occupancyFactor; }
    public void setOccupancyFactor(Double occupancyFactor) { this.occupancyFactor = occupancyFactor; }

    public Integer getGrossTaxAmount() { return grossTaxAmount; }
    public void setGrossTaxAmount(Integer grossTaxAmount) { this.grossTaxAmount = grossTaxAmount; }

    public List<ExemptionItem> getExemptions() { return exemptions; }
    public void setExemptions(List<ExemptionItem> exemptions) { this.exemptions = exemptions; }

    public Integer getTotalExemptionAmount() { return totalExemptionAmount; }
    public void setTotalExemptionAmount(Integer totalExemptionAmount) { this.totalExemptionAmount = totalExemptionAmount; }

    public Integer getLatePenalty() { return latePenalty; }
    public void setLatePenalty(Integer latePenalty) { this.latePenalty = latePenalty; }

    public Integer getNetPayableAmount() { return netPayableAmount; }
    public void setNetPayableAmount(Integer netPayableAmount) { this.netPayableAmount = netPayableAmount; }
}
