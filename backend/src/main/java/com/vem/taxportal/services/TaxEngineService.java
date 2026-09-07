package com.vem.taxportal.services;

import com.vem.taxportal.models.CalculationBreakdown;
import com.vem.taxportal.models.ExemptionItem;
import com.vem.taxportal.models.Property;
import com.vem.taxportal.models.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Service
public class TaxEngineService {

    public CalculationBreakdown calculatePropertyTax(Property property, User user, boolean isOverdue) {
        int currentYear = Year.now().getValue();
        String propertyType = property.getPropertyType() != null ? property.getPropertyType() : "Residential";
        String buildingType = property.getBuildingType() != null ? property.getBuildingType() : "Pucca/RCC";
        String occupancyStatus = property.getOccupancyStatus() != null ? property.getOccupancyStatus() : "Owner Occupied";

        // Determine area to assess
        double landArea = property.getLandAreaSqFt() != null ? property.getLandAreaSqFt() : 1000.0;
        double builtArea = property.getBuiltUpAreaSqFt() != null ? property.getBuiltUpAreaSqFt() : 1000.0;
        double areaEvaluated = "Vacant Land".equalsIgnoreCase(propertyType) ? landArea : (builtArea > 0 ? builtArea : landArea);

        // 1. Base Zone Rate per Sq. Ft.
        int zoneBaseRate = 12; // default residential
        if ("Commercial".equalsIgnoreCase(propertyType)) zoneBaseRate = 28;
        else if ("Industrial".equalsIgnoreCase(propertyType)) zoneBaseRate = 35;
        else if ("Agricultural".equalsIgnoreCase(propertyType)) zoneBaseRate = 6;
        else if ("Vacant Land".equalsIgnoreCase(propertyType)) zoneBaseRate = 8;

        int baseTax = (int) Math.round(areaEvaluated * zoneBaseRate);

        // 2. Usage Multiplier
        double usageMultiplier = 1.0;
        if ("Commercial".equalsIgnoreCase(propertyType)) usageMultiplier = 1.8;
        else if ("Industrial".equalsIgnoreCase(propertyType)) usageMultiplier = 2.2;
        else if ("Agricultural".equalsIgnoreCase(propertyType)) usageMultiplier = 0.6;
        else if ("Vacant Land".equalsIgnoreCase(propertyType)) usageMultiplier = 0.8;

        // 3. Building Type Factor
        double buildingTypeFactor = 1.2; // Pucca/RCC
        if ("Semi-Pucca".equalsIgnoreCase(buildingType)) buildingTypeFactor = 1.0;
        else if ("Kutcha".equalsIgnoreCase(buildingType)) buildingTypeFactor = 0.7;
        else if ("Vacant Plot".equalsIgnoreCase(buildingType)) buildingTypeFactor = 0.5;

        // Subtotal before depreciation
        double subtotalBeforeDepreciation = baseTax * usageMultiplier * buildingTypeFactor;

        // 4. Depreciation based on building age
        int constructionYear = property.getConstructionYear() != null ? property.getConstructionYear() : (currentYear - 10);
        int buildingAge = Math.max(0, currentYear - constructionYear);
        double rawDepreciationRate = Math.min(0.40, buildingAge * 0.015);
        int depreciationAmount = (int) Math.round(subtotalBeforeDepreciation * rawDepreciationRate);
        double depreciatedTax = subtotalBeforeDepreciation - depreciationAmount;

        // 5. Occupancy Factor
        double occupancyFactor = 1.0; // Owner Occupied
        if ("Rented".equalsIgnoreCase(occupancyStatus)) occupancyFactor = 1.35;
        else if ("Vacant".equalsIgnoreCase(occupancyStatus)) occupancyFactor = 1.1;

        int grossTaxAmount = (int) Math.round(depreciatedTax * occupancyFactor);

        // 6. Auto-Applied Profile Exemptions & Rebates
        List<ExemptionItem> exemptions = new ArrayList<>();

        // A. Senior Citizen Exemption (Age >= 60)
        boolean isSeniorCitizen = false;
        if (user != null && user.getDateOfBirth() != null) {
            int age = Period.between(user.getDateOfBirth(), LocalDate.now()).getYears();
            if (age >= 60) isSeniorCitizen = true;
        }
        if (isSeniorCitizen && "Residential".equalsIgnoreCase(propertyType)) {
            int rebateAmount = (int) Math.round(grossTaxAmount * 0.15);
            exemptions.add(new ExemptionItem("Senior Citizen Rebate (15%)", 15, rebateAmount));
        }

        // B. Homestead / Owner-Occupied Exemption
        if ("Owner Occupied".equalsIgnoreCase(occupancyStatus) && "Residential".equalsIgnoreCase(propertyType)) {
            int rebateAmount = (int) Math.round(grossTaxAmount * 0.10);
            exemptions.add(new ExemptionItem("Homestead Owner-Occupied Rebate (10%)", 10, rebateAmount));
        }

        // C. Differently Abled Owner Exemption
        if (user != null && Boolean.TRUE.equals(user.getIsDifferentlyAbled())) {
            int rebateAmount = (int) Math.round(grossTaxAmount * 0.20);
            exemptions.add(new ExemptionItem("Differently Abled Owner Rebate (20%)", 20, rebateAmount));
        }

        // D. Agricultural Green Land Rebate
        if ("Agricultural".equalsIgnoreCase(propertyType)) {
            int rebateAmount = (int) Math.round(grossTaxAmount * 0.25);
            exemptions.add(new ExemptionItem("Agricultural Land Support Rebate (25%)", 25, rebateAmount));
        }

        int totalExemptionAmount = exemptions.stream().mapToInt(ExemptionItem::getAmount).sum();

        // 7. Overdue Penalty
        int latePenalty = isOverdue ? (int) Math.round(grossTaxAmount * 0.05) : 0;

        // Final Net Payable
        int netPayableAmount = Math.max(100, grossTaxAmount - totalExemptionAmount + latePenalty);

        CalculationBreakdown breakdown = new CalculationBreakdown();
        breakdown.setAreaEvaluated(areaEvaluated);
        breakdown.setAreaType("Vacant Land".equalsIgnoreCase(propertyType) ? "Land Area" : "Built-up Area");
        breakdown.setZoneBaseRate(zoneBaseRate);
        breakdown.setBaseTax(baseTax);
        breakdown.setUsageMultiplier(usageMultiplier);
        breakdown.setBuildingTypeFactor(buildingTypeFactor);
        breakdown.setBuildingAge(buildingAge);
        breakdown.setDepreciationRate((int) Math.round(rawDepreciationRate * 100));
        breakdown.setDepreciationAmount(depreciationAmount);
        breakdown.setOccupancyFactor(occupancyFactor);
        breakdown.setGrossTaxAmount(grossTaxAmount);
        breakdown.setExemptions(exemptions);
        breakdown.setTotalExemptionAmount(totalExemptionAmount);
        breakdown.setLatePenalty(latePenalty);
        breakdown.setNetPayableAmount(netPayableAmount);

        return breakdown;
    }

    public CalculationBreakdown calculatePropertyTax(Property property, User user) {
        return calculatePropertyTax(property, user, false);
    }
}
