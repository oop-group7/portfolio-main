package net.bestcompany.foliowatch.externalapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crazzyghost.alphavantage.AlphaVantage;

@Service
public class AlphaVantageApi implements IAlphaVantageApi {
    @Autowired
    private AlphaVantage apiService;
}
