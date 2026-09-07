package com.vem.taxportal.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, unique = true)
    private String propertyIdentifier;

    @Column(nullable = false)
    private String ownerName;

    @Column(nullable = false)
    private String propertyType = "Residential"; // Residential, Commercial, Industrial, Agricultural, Vacant Land

    @Column(nullable = false)
    private String buildingType = "Pucca/RCC"; // Pucca/RCC, Semi-Pucca, Kutcha, Vacant Plot

    private Integer constructionYear = 2018;

    @Embedded
    private Location location = new Location();

    @Embedded
    private GisCoordinates gisCoordinates = new GisCoordinates();

    @Column(nullable = false)
    private Double landAreaSqFt = 1200.0;

    @Column(nullable = false)
    private Double builtUpAreaSqFt = 950.0;

    @Column(nullable = false)
    private String occupancyStatus = "Owner Occupied"; // Owner Occupied, Rented, Vacant

    @Embedded
    private ComplianceScore complianceScore = new ComplianceScore();

    private Boolean isVerified = true;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Property() {}

    @PrePersist
    public void onPrePersist() {
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

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public String getPropertyIdentifier() { return propertyIdentifier; }
    public void setPropertyIdentifier(String propertyIdentifier) { this.propertyIdentifier = propertyIdentifier; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

    public String getBuildingType() { return buildingType; }
    public void setBuildingType(String buildingType) { this.buildingType = buildingType; }

    public Integer getConstructionYear() { return constructionYear; }
    public void setConstructionYear(Integer constructionYear) { this.constructionYear = constructionYear; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    public GisCoordinates getGisCoordinates() { return gisCoordinates; }
    public void setGisCoordinates(GisCoordinates gisCoordinates) { this.gisCoordinates = gisCoordinates; }

    public Double getLandAreaSqFt() { return landAreaSqFt; }
    public void setLandAreaSqFt(Double landAreaSqFt) { this.landAreaSqFt = landAreaSqFt; }

    public Double getBuiltUpAreaSqFt() { return builtUpAreaSqFt; }
    public void setBuiltUpAreaSqFt(Double builtUpAreaSqFt) { this.builtUpAreaSqFt = builtUpAreaSqFt; }

    public String getOccupancyStatus() { return occupancyStatus; }
    public void setOccupancyStatus(String occupancyStatus) { this.occupancyStatus = occupancyStatus; }

    public ComplianceScore getComplianceScore() { return complianceScore; }
    public void setComplianceScore(ComplianceScore complianceScore) { this.complianceScore = complianceScore; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean verified) { isVerified = verified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
