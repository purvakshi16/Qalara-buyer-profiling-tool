package com.qalara.buyerprofiling.service;

import com.qalara.buyerprofiling.model.BuyerEnrichmentDTO;
import com.qalara.buyerprofiling.model.BuyerSeedRequest;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import org.springframework.stereotype.Service;

@Service
public class EnrichmentService {
    private final ApolloService apolloService;
    private final FirecrawlService firecrawlService;
    private final ImportYetiService importYetiService;
    private final OpenAIService openAIService;

    public EnrichmentService(ApolloService apolloService, FirecrawlService firecrawlService,
                             ImportYetiService importYetiService, OpenAIService openAIService) {
        this.apolloService = apolloService;
        this.firecrawlService = firecrawlService;
        this.importYetiService = importYetiService;
        this.openAIService = openAIService;
    }

    public BuyerEnrichmentDTO enrich(BuyerSeedRequest seed) {
        Map<String, String> errors = new HashMap<>();

        CompletableFuture<ApolloService.ApolloResult> apollo = CompletableFuture.supplyAsync(() -> apolloService.enrich(seed))
                .exceptionally(error -> {
                    errors.put("apollo", rootMessage(error));
                    return null;
                });

        CompletableFuture<OpenAIService.ParsedWebsiteData> website = CompletableFuture.supplyAsync(() -> {
            String markdown = firecrawlService.scrapeMarkdown(seed.websiteUrl());
            return openAIService.extractStructuredData(markdown);
        }).exceptionally(error -> {
            errors.put("website", rootMessage(error));
            return new OpenAIService.ParsedWebsiteData(null, new String[0], new String[0]);
        });

        CompletableFuture<ImportYetiService.ImportYetiResult> imports = CompletableFuture.supplyAsync(() -> importYetiService.lookup(seed.companyName()))
                .exceptionally(error -> {
                    errors.put("importYeti", rootMessage(error));
                    return new ImportYetiService.ImportYetiResult(null, new String[0], new String[0]);
                });

        CompletableFuture.allOf(apollo, website, imports).join();

        ApolloService.ApolloResult apolloResult = apollo.join();
        OpenAIService.ParsedWebsiteData websiteResult = website.join();
        ImportYetiService.ImportYetiResult importResult = imports.join();
        String status = errors.isEmpty() ? "complete" : apolloResult == null ? "failed" : "partial";

        return new BuyerEnrichmentDTO(
                seed.firstName(),
                seed.lastName(),
                seed.email(),
                seed.linkedinUrl(),
                firstNonBlank(seed.companyName(), apolloResult == null ? null : apolloResult.companyName()),
                seed.websiteUrl(),
                apolloResult == null ? null : apolloResult.phone(),
                apolloResult == null ? null : apolloResult.jobTitle(),
                apolloResult == null ? null : apolloResult.seniority(),
                apolloResult == null ? null : apolloResult.employeeSize(),
                apolloResult == null ? null : apolloResult.revenueEstimate(),
                apolloResult == null ? null : apolloResult.hqCountry(),
                apolloResult == null ? null : apolloResult.foundedYear(),
                apolloResult == null ? null : apolloResult.industry(),
                websiteResult.brandDescription(),
                websiteResult.materialsDealt(),
                websiteResult.websiteCategories(),
                importResult.importsFromIndia(),
                importResult.supplierNames(),
                importResult.hsCodes(),
                null,
                new String[0],
                null,
                status,
                null,
                Instant.now(),
                null,
                errors
        );
    }

    private String firstNonBlank(String first, String second) {
        return first == null || first.isBlank() ? second : first;
    }

    private String rootMessage(Throwable error) {
        Throwable cause = error;
        while (cause.getCause() != null) {
            cause = cause.getCause();
        }
        return cause.getMessage();
    }
}
