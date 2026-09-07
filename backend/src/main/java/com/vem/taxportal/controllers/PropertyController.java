package com.vem.taxportal.controllers;

import com.vem.taxportal.models.*;
import com.vem.taxportal.repositories.AssessmentRepository;
import com.vem.taxportal.repositories.NotificationRepository;
import com.vem.taxportal.repositories.PropertyRepository;
import com.vem.taxportal.services.ComplianceScoreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.*;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyRepository propertyRepository;
    private final AssessmentRepository assessmentRepository;
    private final NotificationRepository notificationRepository;
    private final ComplianceScoreService complianceScoreService;

    public PropertyController(PropertyRepository propertyRepository,
                              AssessmentRepository assessmentRepository,
                              NotificationRepository notificationRepository,
                              ComplianceScoreService complianceScoreService) {
        this.propertyRepository = propertyRepository;
        this.assessmentRepository = assessmentRepository;
        this.notificationRepository = notificationRepository;
        this.complianceScoreService = complianceScoreService;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user;
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getMyProperties() {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<Property> properties = propertyRepository.findByOwnerIdOrderByCreatedAtDesc(user.getId());
        for (Property prop : properties) {
            ComplianceScore fresh = complianceScoreService.computeComplianceScore(prop.getId());
            if (!Objects.equals(prop.getComplianceScore().getScore(), fresh.getScore()) ||
                    !Objects.equals(prop.getComplianceScore().getRating(), fresh.getRating())) {
                prop.setComplianceScore(fresh);
                propertyRepository.save(prop);
            }
        }

        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPropertyById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Property> propOpt = propertyRepository.findById(id);
        if (propOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Property not found"));
        }

        Property property = propOpt.get();
        boolean isAdmin = "admin".equalsIgnoreCase(user.getRole());
        if (!Objects.equals(property.getOwner().getId(), user.getId()) && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not authorized to view this property"));
        }

        List<Assessment> assessments = assessmentRepository.findByPropertyIdOrderByCreatedAtDesc(property.getId());
        return ResponseEntity.ok(Map.of("property", property, "assessments", assessments));
    }

    @PostMapping
    public ResponseEntity<?> createProperty(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        long count = propertyRepository.count();
        int year = Year.now().getValue();
        String identifier = String.format("PID-%d-%04d", year, count + 1);

        Property property = new Property();
        property.setOwner(user);
        property.setPropertyIdentifier(identifier);
        property.setOwnerName(body.containsKey("ownerName") && body.get("ownerName") != null ?
                (String) body.get("ownerName") : user.getName());
        property.setPropertyType((String) body.getOrDefault("propertyType", "Residential"));
        property.setBuildingType((String) body.getOrDefault("buildingType", "Pucca/RCC"));

        if (body.containsKey("constructionYear") && body.get("constructionYear") != null) {
            property.setConstructionYear(Integer.parseInt(String.valueOf(body.get("constructionYear"))));
        } else {
            property.setConstructionYear(2018);
        }

        // Location
        if (body.get("location") instanceof Map<?, ?> rawLocMap) {
            @SuppressWarnings("unchecked")
            Map<String, Object> locMap = (Map<String, Object>) rawLocMap;
            Location loc = new Location(
                    (String) locMap.getOrDefault("district", "Erode"),
                    (String) locMap.getOrDefault("municipality", "Sathyamangalam Municipality"),
                    (String) locMap.getOrDefault("ward", "Ward 01"),
                    (String) locMap.getOrDefault("street", "Main Bazaar"),
                    (String) locMap.getOrDefault("doorNo", "1"),
                    (String) locMap.getOrDefault("pincode", "638401")
            );
            property.setLocation(loc);
        }

        // GIS Coordinates
        double lat = 11.5092 + (Math.random() - 0.5) * 0.01;
        double lng = 77.2347 + (Math.random() - 0.5) * 0.01;
        if (body.get("gisCoordinates") instanceof Map<?, ?> coordsMap) {
            if (coordsMap.containsKey("lat") && coordsMap.get("lat") != null) {
                lat = Double.parseDouble(String.valueOf(coordsMap.get("lat")));
            }
            if (coordsMap.containsKey("lng") && coordsMap.get("lng") != null) {
                lng = Double.parseDouble(String.valueOf(coordsMap.get("lng")));
            }
        }
        property.setGisCoordinates(new GisCoordinates(lat, lng));

        // Areas
        if (body.containsKey("landAreaSqFt") && body.get("landAreaSqFt") != null) {
            property.setLandAreaSqFt(Double.parseDouble(String.valueOf(body.get("landAreaSqFt"))));
        }
        if (body.containsKey("builtUpAreaSqFt") && body.get("builtUpAreaSqFt") != null) {
            property.setBuiltUpAreaSqFt(Double.parseDouble(String.valueOf(body.get("builtUpAreaSqFt"))));
        }

        property.setOccupancyStatus((String) body.getOrDefault("occupancyStatus", "Owner Occupied"));
        property.setComplianceScore(new ComplianceScore(95, "Good", LocalDateTime.now()));
        property.setIsVerified(true);

        Property saved = propertyRepository.save(property);

        // System notification
        Notification notification = new Notification(
                user,
                "Property Successfully Registered",
                String.format("Property %s at %s has been verified and registered for tax assessment.",
                        saved.getPropertyIdentifier(), saved.getLocation().getWard()),
                "general",
                saved.getId()
        );
        notificationRepository.save(notification);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProperty(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Property> propOpt = propertyRepository.findById(id);
        if (propOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Property not found"));
        }

        Property property = propOpt.get();
        boolean isAdmin = "admin".equalsIgnoreCase(user.getRole());
        if (!Objects.equals(property.getOwner().getId(), user.getId()) && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not authorized to edit this property"));
        }

        if (body.containsKey("ownerName")) property.setOwnerName((String) body.get("ownerName"));
        if (body.containsKey("propertyType")) property.setPropertyType((String) body.get("propertyType"));
        if (body.containsKey("buildingType")) property.setBuildingType((String) body.get("buildingType"));
        if (body.containsKey("occupancyStatus")) property.setOccupancyStatus((String) body.get("occupancyStatus"));
        if (body.containsKey("landAreaSqFt")) property.setLandAreaSqFt(Double.parseDouble(String.valueOf(body.get("landAreaSqFt"))));
        if (body.containsKey("builtUpAreaSqFt")) property.setBuiltUpAreaSqFt(Double.parseDouble(String.valueOf(body.get("builtUpAreaSqFt"))));

        Property updated = propertyRepository.save(property);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProperty(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Property> propOpt = propertyRepository.findById(id);
        if (propOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Property not found"));
        }

        Property property = propOpt.get();
        boolean isAdmin = "admin".equalsIgnoreCase(user.getRole());
        if (!Objects.equals(property.getOwner().getId(), user.getId()) && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not authorized to delete this property"));
        }

        propertyRepository.delete(property);
        return ResponseEntity.ok(Map.of("message", "Property removed successfully"));
    }
}
