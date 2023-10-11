package net.bestcompany.foliowatch.externalapi.services;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import net.bestcompany.foliowatch.externalapi.responses.CatFact;

@Service
public class CatFactService {
    protected static final String FACT_SERVICE_URL = "https://catfact.ninja/fact";

    private final RestTemplate factServiceTemplate = new RestTemplate();

    /**
     * Requests a random fact.
     *
     * @return a random {@link CatFact}.
     */
    @Cacheable("facts")
    public CatFact requestRandomFact() {
        return this.factServiceTemplate.getForObject(FACT_SERVICE_URL, CatFact.class);
    }
}
