package net.bestcompany.foliowatch.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.crazzyghost.alphavantage.AlphaVantage;
import com.crazzyghost.alphavantage.Config;

@Configuration
public class AlphaVantageConfig {
    @Value("${foliowatch.app.alphavantageApiKey}")
    private String apiKey;

    @Bean
    public AlphaVantage apiProvider() {
        Config config = Config.builder().key(apiKey).timeOut(9).build();
        AlphaVantage instance = AlphaVantage.api();
        instance.init(config);
        return instance;
    }
}
