package com.qalara.buyerprofiling.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
        String corsAllowedOrigins,
        String apolloApiKey,
        String firecrawlApiKey,
        String apifyApiToken,
        String apifyImportyetiActorId,
        String openaiApiKey,
        String hubspotApiKey
) {
}
