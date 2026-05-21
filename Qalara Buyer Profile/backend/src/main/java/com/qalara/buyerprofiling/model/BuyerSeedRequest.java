package com.qalara.buyerprofiling.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record BuyerSeedRequest(
        String firstName,
        String lastName,
        @NotBlank @Email String email,
        String linkedinUrl,
        String companyName,
        String websiteUrl
) {
}
