package com.qalara.buyerprofiling.service;

import org.springframework.stereotype.Service;

@Service
public class OpenAIService {
    public ParsedWebsiteData extractStructuredData(String markdown) {
        return new ParsedWebsiteData(null, new String[0], new String[0]);
    }

    public record ParsedWebsiteData(String brandDescription, String[] materialsDealt, String[] websiteCategories) {
    }
}
