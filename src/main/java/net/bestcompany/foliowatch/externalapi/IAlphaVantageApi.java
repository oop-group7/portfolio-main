package net.bestcompany.foliowatch.externalapi;

import net.bestcompany.foliowatch.externalapi.responses.SearchTickerResponse;
import net.bestcompany.foliowatch.externalapi.responses.TimeSeriesResponse;

public interface IAlphaVantageApi {
    SearchTickerResponse searchTicker(String keyword);

    TimeSeriesResponse getTimeSeries(String ticker);

    boolean tickerExists(String ticker);
}
