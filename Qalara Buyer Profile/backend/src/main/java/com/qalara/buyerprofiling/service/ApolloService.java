package com.qalara.buyerprofiling.service;

import com.qalara.buyerprofiling.config.AppProperties;
import com.qalara.buyerprofiling.model.BuyerSeedRequest;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ApolloService {
    private final AppProperties properties;
    private final RestClient restClient;

    public ApolloService(AppProperties properties, RestClient restClient) {
        this.properties = properties;
        this.restClient = restClient;
    }

    public ApolloResult enrich(BuyerSeedRequest seed) {
        if (properties.apolloApiKey() == null || properties.apolloApiKey().isBlank()) {
            throw new IllegalStateException("APOLLO_API_KEY is not configured.");
        }

        Map<String, Object> peopleBody = new HashMap<>();
        peopleBody.put("email", seed.email());
        peopleBody.put("first_name", seed.firstName());
        peopleBody.put("last_name", seed.lastName());

        Map<?, ?> person = restClient.post()
                .uri("https://api.apollo.io/v1/people/match")
                .header("X-Api-Key", properties.apolloApiKey())
                .body(peopleBody)
                .retrieve()
                .body(Map.class);

        Map<?, ?> org = null;
        String domain = domainFrom(seed.websiteUrl());
        if (domain != null) {
            org = restClient.post()
                    .uri("https://api.apollo.io/v1/organizations/enrich")
                    .header("X-Api-Key", properties.apolloApiKey())
                    .body(Map.of("domain", domain))
                    .retrieve()
                    .body(Map.class);
        }

        return ApolloResult.from(person, org);
    }

    private String domainFrom(String websiteUrl) {
        if (websiteUrl == null || websiteUrl.isBlank()) {
            return null;
        }
        URI uri = URI.create(websiteUrl.startsWith("http") ? websiteUrl : "https://" + websiteUrl);
        String host = uri.getHost();
        return host == null ? null : host.replaceFirst("^www\\.", "");
    }

    public record ApolloResult(
            String phone,
            String jobTitle,
            String seniority,
            String employeeSize,
            String revenueEstimate,
            String hqCountry,
            Integer foundedYear,
            String industry,
            String companyName
    ) {
        static ApolloResult from(Map<?, ?> personResponse, Map<?, ?> orgResponse) {
            Map<?, ?> person = asMap(personResponse == null ? null : personResponse.get("person"));
            Map<?, ?> organization = asMap(orgResponse == null ? null : orgResponse.get("organization"));
            if (organization == null) {
                organization = asMap(person == null ? null : person.get("organization"));
            }
            return new ApolloResult(
                    text(first(person, "phone_numbers", "sanitized_number")),
                    text(person == null ? null : person.get("title")),
                    text(person == null ? null : person.get("seniority")),
                    text(organization == null ? null : organization.get("estimated_num_employees")),
                    text(organization == null ? null : organization.get("estimated_annual_revenue")),
                    text(organization == null ? null : organization.get("country")),
                    integer(organization == null ? null : organization.get("founded_year")),
                    text(organization == null ? null : organization.get("industry")),
                    text(organization == null ? null : organization.get("name"))
            );
        }

        private static Object first(Map<?, ?> map, String listKey, String valueKey) {
            Object value = map == null ? null : map.get(listKey);
            if (value instanceof java.util.List<?> list && !list.isEmpty() && list.getFirst() instanceof Map<?, ?> first) {
                return first.get(valueKey);
            }
            return null;
        }

        private static Map<?, ?> asMap(Object value) {
            return value instanceof Map<?, ?> map ? map : null;
        }

        private static String text(Object value) {
            return value == null ? null : String.valueOf(value);
        }

        private static Integer integer(Object value) {
            if (value instanceof Number number) {
                return number.intValue();
            }
            try {
                return value == null ? null : Integer.parseInt(String.valueOf(value));
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
    }
}
