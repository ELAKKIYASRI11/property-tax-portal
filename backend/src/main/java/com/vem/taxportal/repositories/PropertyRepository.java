package com.vem.taxportal.repositories;

import com.vem.taxportal.models.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    Optional<Property> findByPropertyIdentifier(String propertyIdentifier);
    long countByComplianceScoreRating(String rating);
}
