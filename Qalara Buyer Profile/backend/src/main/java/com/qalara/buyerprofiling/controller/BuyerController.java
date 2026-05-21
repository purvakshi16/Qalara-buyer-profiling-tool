package com.qalara.buyerprofiling.controller;

import com.qalara.buyerprofiling.model.Buyer;
import com.qalara.buyerprofiling.model.BuyerEnrichmentDTO;
import com.qalara.buyerprofiling.model.BuyerSeedRequest;
import com.qalara.buyerprofiling.service.BuyerService;
import com.qalara.buyerprofiling.service.EnrichmentService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/buyers")
public class BuyerController {
    private final EnrichmentService enrichmentService;
    private final BuyerService buyerService;

    public BuyerController(EnrichmentService enrichmentService, BuyerService buyerService) {
        this.enrichmentService = enrichmentService;
        this.buyerService = buyerService;
    }

    @PostMapping("/enrich")
    public BuyerEnrichmentDTO enrich(@Valid @RequestBody BuyerSeedRequest request) {
        return enrichmentService.enrich(request);
    }

    @PostMapping
    public Buyer create(@Valid @RequestBody BuyerEnrichmentDTO request, @AuthenticationPrincipal Jwt jwt) {
        return buyerService.create(request, userId(jwt));
    }

    @GetMapping
    public List<Buyer> list(@AuthenticationPrincipal Jwt jwt) {
        return buyerService.list(userId(jwt));
    }

    @GetMapping("/{id}")
    public Buyer get(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        return buyerService.get(id, userId(jwt));
    }

    @PutMapping("/{id}")
    public Buyer update(@PathVariable UUID id, @Valid @RequestBody BuyerEnrichmentDTO request, @AuthenticationPrincipal Jwt jwt) {
        return buyerService.update(id, request, userId(jwt));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        buyerService.softDelete(id, userId(jwt));
    }

    @PostMapping("/{id}/sync-hubspot")
    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
    public Map<String, String> syncHubSpot() {
        return Map.of("message", "HubSpot sync is planned for Phase 3.");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> duplicate(DataIntegrityViolationException exception) {
        return Map.of("message", exception.getMessage());
    }

    private UUID userId(Jwt jwt) {
        return UUID.fromString(jwt.getSubject());
    }
}
