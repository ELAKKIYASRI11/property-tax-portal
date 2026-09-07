package com.vem.taxportal.repositories;

import com.vem.taxportal.models.UnassessedParcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UnassessedParcelRepository extends JpaRepository<UnassessedParcel, Long> {
    Optional<UnassessedParcel> findByParcelId(String parcelId);
    long countByStatusNot(String status);
    List<UnassessedParcel> findAllByOrderByCreatedAtDesc();
}
