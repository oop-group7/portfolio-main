package net.bestcompany.foliowatch.externalapi;

import net.bestcompany.foliowatch.externalapi.responses.SearchTickerResponse;
import net.bestcompany.foliowatch.externalapi.responses.TimeSeriesResponse;

public interface IAlphaVantageApi {
    SearchTickerResponse searchSymbol(String keyword);

    TimeSeriesResponse getTimeSeries(String ticker);
}
