package com.qalara.buyerprofiling.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "buyers")
public class Buyer {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_by")
    private UUID updatedBy;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    private String firstName;
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String linkedinUrl;
    private String companyName;
    private String websiteUrl;
    private String phone;
    private String jobTitle;
    private String seniority;
    private String employeeSize;
    private String revenueEstimate;
    private String hqCountry;
    private Integer foundedYear;
    private String industry;
    @Column(columnDefinition = "text")
    private String brandDescription;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private String[] materialsDealt = new String[0];

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private String[] websiteCategories = new String[0];

    private Boolean importsFromIndia;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private String[] importSupplierNames = new String[0];

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private String[] importHsCodes = new String[0];

    private String buyerType;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private String[] categoryInterest = new String[0];

    private String customerType;
    private String enrichmentStatus = "pending";
    private String hubspotContactId;
    private Instant lastEnrichedAt;

    @Column(columnDefinition = "text")
    private String notes;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getSeniority() { return seniority; }
    public void setSeniority(String seniority) { this.seniority = seniority; }
    public String getEmployeeSize() { return employeeSize; }
    public void setEmployeeSize(String employeeSize) { this.employeeSize = employeeSize; }
    public String getRevenueEstimate() { return revenueEstimate; }
    public void setRevenueEstimate(String revenueEstimate) { this.revenueEstimate = revenueEstimate; }
    public String getHqCountry() { return hqCountry; }
    public void setHqCountry(String hqCountry) { this.hqCountry = hqCountry; }
    public Integer getFoundedYear() { return foundedYear; }
    public void setFoundedYear(Integer foundedYear) { this.foundedYear = foundedYear; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getBrandDescription() { return brandDescription; }
    public void setBrandDescription(String brandDescription) { this.brandDescription = brandDescription; }
    public String[] getMaterialsDealt() { return materialsDealt; }
    public void setMaterialsDealt(String[] materialsDealt) { this.materialsDealt = materialsDealt; }
    public String[] getWebsiteCategories() { return websiteCategories; }
    public void setWebsiteCategories(String[] websiteCategories) { this.websiteCategories = websiteCategories; }
    public Boolean getImportsFromIndia() { return importsFromIndia; }
    public void setImportsFromIndia(Boolean importsFromIndia) { this.importsFromIndia = importsFromIndia; }
    public String[] getImportSupplierNames() { return importSupplierNames; }
    public void setImportSupplierNames(String[] importSupplierNames) { this.importSupplierNames = importSupplierNames; }
    public String[] getImportHsCodes() { return importHsCodes; }
    public void setImportHsCodes(String[] importHsCodes) { this.importHsCodes = importHsCodes; }
    public String getBuyerType() { return buyerType; }
    public void setBuyerType(String buyerType) { this.buyerType = buyerType; }
    public String[] getCategoryInterest() { return categoryInterest; }
    public void setCategoryInterest(String[] categoryInterest) { this.categoryInterest = categoryInterest; }
    public String getCustomerType() { return customerType; }
    public void setCustomerType(String customerType) { this.customerType = customerType; }
    public String getEnrichmentStatus() { return enrichmentStatus; }
    public void setEnrichmentStatus(String enrichmentStatus) { this.enrichmentStatus = enrichmentStatus; }
    public String getHubspotContactId() { return hubspotContactId; }
    public void setHubspotContactId(String hubspotContactId) { this.hubspotContactId = hubspotContactId; }
    public Instant getLastEnrichedAt() { return lastEnrichedAt; }
    public void setLastEnrichedAt(Instant lastEnrichedAt) { this.lastEnrichedAt = lastEnrichedAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
