package com.qalara.buyerprofiling.service;

import com.qalara.buyerprofiling.model.Buyer;
import com.qalara.buyerprofiling.model.BuyerEnrichmentDTO;
import com.qalara.buyerprofiling.repository.BuyerRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class BuyerService {
    private final BuyerRepository repository;

    public BuyerService(BuyerRepository repository) {
        this.repository = repository;
    }

    public List<Buyer> list(UUID userId) {
        return repository.findAllByCreatedByAndDeletedAtIsNullOrderByCreatedAtDesc(userId);
    }

    public Buyer get(UUID id, UUID userId) {
        return repository.findByIdAndCreatedByAndDeletedAtIsNull(id, userId)
                .orElseThrow(() -> new EntityNotFoundException("Buyer not found."));
    }

    public Buyer create(BuyerEnrichmentDTO dto, UUID userId) {
        if (repository.findByEmailIgnoreCaseAndDeletedAtIsNull(dto.email()).isPresent()) {
            throw new DataIntegrityViolationException("A buyer profile with this email already exists.");
        }
        Buyer buyer = new Buyer();
        buyer.setCreatedBy(userId);
        apply(dto, buyer);
        return repository.save(buyer);
    }

    public Buyer update(UUID id, BuyerEnrichmentDTO dto, UUID userId) {
        Buyer buyer = get(id, userId);
        apply(dto, buyer);
        buyer.setUpdatedBy(userId);
        buyer.setUpdatedAt(Instant.now());
        return repository.save(buyer);
    }

    public void softDelete(UUID id, UUID userId) {
        Buyer buyer = get(id, userId);
        buyer.setDeletedAt(Instant.now());
        buyer.setUpdatedBy(userId);
        buyer.setUpdatedAt(Instant.now());
        repository.save(buyer);
    }

    private void apply(BuyerEnrichmentDTO dto, Buyer buyer) {
        buyer.setFirstName(dto.firstName());
        buyer.setLastName(dto.lastName());
        buyer.setEmail(dto.email());
        buyer.setLinkedinUrl(dto.linkedinUrl());
        buyer.setCompanyName(dto.companyName());
        buyer.setWebsiteUrl(dto.websiteUrl());
        buyer.setPhone(dto.phone());
        buyer.setJobTitle(dto.jobTitle());
        buyer.setSeniority(dto.seniority());
        buyer.setEmployeeSize(dto.employeeSize());
        buyer.setRevenueEstimate(dto.revenueEstimate());
        buyer.setHqCountry(dto.hqCountry());
        buyer.setFoundedYear(dto.foundedYear());
        buyer.setIndustry(dto.industry());
        buyer.setBrandDescription(dto.brandDescription());
        buyer.setMaterialsDealt(orEmpty(dto.materialsDealt()));
        buyer.setWebsiteCategories(orEmpty(dto.websiteCategories()));
        buyer.setImportsFromIndia(dto.importsFromIndia());
        buyer.setImportSupplierNames(orEmpty(dto.importSupplierNames()));
        buyer.setImportHsCodes(orEmpty(dto.importHsCodes()));
        buyer.setBuyerType(dto.buyerType());
        buyer.setCategoryInterest(orEmpty(dto.categoryInterest()));
        buyer.setCustomerType(dto.customerType());
        buyer.setEnrichmentStatus(dto.enrichmentStatus());
        buyer.setHubspotContactId(dto.hubspotContactId());
        buyer.setLastEnrichedAt(dto.lastEnrichedAt());
        buyer.setNotes(dto.notes());
    }

    private String[] orEmpty(String[] values) {
        return values == null ? new String[0] : values;
    }
}
