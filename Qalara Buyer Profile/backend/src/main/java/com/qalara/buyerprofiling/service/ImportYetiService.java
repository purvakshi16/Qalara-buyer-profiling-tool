package com.qalara.buyerprofiling.service;

import org.springframework.stereotype.Service;

@Service
public class ImportYetiService {
    public ImportYetiResult lookup(String companyName) {
        return new ImportYetiResult(null, new String[0], new String[0]);
    }

    public record ImportYetiResult(Boolean importsFromIndia, String[] supplierNames, String[] hsCodes) {
    }
}
