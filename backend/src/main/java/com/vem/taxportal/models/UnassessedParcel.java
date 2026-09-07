package com.vem.taxportal.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "unassessed_parcels")
public class UnassessedParcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String parcelId;

    @Column(nullable = false)
    private String surveyNumber;

    @Column(nullable = false)
    private String locationName;

    @Column(nullable = false)
    private String ward;

    @Embedded
    private GisCoordinates gisCoordinates = new GisCoordinates();

    @Column(nullable = false)
    private Double estimatedLandAreaSqFt;

    @Column(nullable = false)
    private Double estimatedBuiltUpAreaSqFt;

    private String detectedBuildingType = "Commercial/Residential Mix";

    @Column(nullable = false)
    private Integer estimatedAnnualTaxLoss;

    @Column(nullable = false)
    private String status = "Uninspected"; // 'Uninspected', 'Notice Issued', 'Assessed', 'False Positive'

    private LocalDate satelliteDetectionDate = LocalDate.now();

    @Column(columnDefinition = "TEXT")
    private String adminActionRemarks = "";

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UnassessedParcel() {}

    @PrePersist
    public void onPrePersist() {
        if (satelliteDetectionDate == null) satelliteDetectionDate = LocalDate.now();
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

    public String getParcelId() { return parcelId; }
    public void setParcelId(String parcelId) { this.parcelId = parcelId; }

    public String getSurveyNumber() { return surveyNumber; }
    public void setSurveyNumber(String surveyNumber) { this.surveyNumber = surveyNumber; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public GisCoordinates getGisCoordinates() { return gisCoordinates; }
    public void setGisCoordinates(GisCoordinates gisCoordinates) { this.gisCoordinates = gisCoordinates; }

    public Double getEstimatedLandAreaSqFt() { return estimatedLandAreaSqFt; }
    public void setEstimatedLandAreaSqFt(Double estimatedLandAreaSqFt) { this.estimatedLandAreaSqFt = estimatedLandAreaSqFt; }

    public Double getEstimatedBuiltUpAreaSqFt() { return estimatedBuiltUpAreaSqFt; }
    public void setEstimatedBuiltUpAreaSqFt(Double estimatedBuiltUpAreaSqFt) { this.estimatedBuiltUpAreaSqFt = estimatedBuiltUpAreaSqFt; }

    public String getDetectedBuildingType() { return detectedBuildingType; }
    public void setDetectedBuildingType(String detectedBuildingType) { this.detectedBuildingType = detectedBuildingType; }

    public Integer getEstimatedAnnualTaxLoss() { return estimatedAnnualTaxLoss; }
    public void setEstimatedAnnualTaxLoss(Integer estimatedAnnualTaxLoss) { this.estimatedAnnualTaxLoss = estimatedAnnualTaxLoss; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getSatelliteDetectionDate() { return satelliteDetectionDate; }
    public void setSatelliteDetectionDate(LocalDate satelliteDetectionDate) { this.satelliteDetectionDate = satelliteDetectionDate; }

    public String getAdminActionRemarks() { return adminActionRemarks; }
    public void setAdminActionRemarks(String adminActionRemarks) { this.adminActionRemarks = adminActionRemarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
