package com.qalara.buyerprofiling.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.Map;

public record BuyerEnrichmentDTO(
        String firstName,
        String lastName,
        @NotBlank @Email String email,
        String linkedinUrl,
        String companyName,
        String websiteUrl,
        String phone,
        String jobTitle,
        String seniority,
        String employeeSize,
        String revenueEstimate,
        String hqCountry,
        Integer foundedYear,
        String industry,
        String brandDescription,
        String[] materialsDealt,
        String[] websiteCategories,
        Boolean importsFromIndia,
        String[] importSupplierNames,
        String[] importHsCodes,
        String buyerType,
        String[] categoryInterest,
        String customerType,
        String enrichmentStatus,
        String hubspotContactId,
        Instant lastEnrichedAt,
        String notes,
        Map<String, String> sourceErrors
) {
}
