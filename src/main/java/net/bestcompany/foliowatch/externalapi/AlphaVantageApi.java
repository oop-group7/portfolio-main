package net.bestcompany.foliowatch.externalapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.crazzyghost.alphavantage.AlphaVantage;
import com.crazzyghost.alphavantage.timeseries.response.TimeSeriesResponse;

@Service
public class AlphaVantageApi implements IAlphaVantageApi {
    @Autowired
    private AlphaVantage apiService;

    @Override
    @Cacheable("timeSeriesDaily")
    public TimeSeriesResponse timeSeriesDaily() {
        return apiService.timeSeries().daily().fetchSync();
    }
}
