package net.bestcompany.foliowatch.externalapi;

import com.crazzyghost.alphavantage.timeseries.response.TimeSeriesResponse;

public interface IAlphaVantageApi {
    TimeSeriesResponse timeSeriesDaily();
}
