package com.qalara.buyerprofiling.repository;

import com.qalara.buyerprofiling.model.Buyer;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuyerRepository extends JpaRepository<Buyer, UUID> {
    Optional<Buyer> findByIdAndCreatedByAndDeletedAtIsNull(UUID id, UUID createdBy);
    Optional<Buyer> findByEmailIgnoreCaseAndDeletedAtIsNull(String email);
    List<Buyer> findAllByCreatedByAndDeletedAtIsNullOrderByCreatedAtDesc(UUID createdBy);
}
