import { GET } from "./apihelper"
import {components} from "./api"

export type Portfolio = {
    name: string,
    symbol: string,
    type: string
}

export const PORTFOLIO_LIST: Portfolio[] = [{
    name: "SPDR S&P 500 ETF Trust",
    symbol: "SPY",
    type: "ETF"
  }, {
    name: "Apple Inc, Equity",
    symbol: "AAPL",
    type: "Equity"
  }, {
    name: "JPMORGAN SMARTALLOCATION INCOME FUND CLASS C",
    symbol: "SAICX",
    type: "Mutual Fund"
  }]

export async function fetchPortfolioInformation(portfolios: Portfolio[]): Promise<components["schemas"]["TimeSeriesResponse"][]> {
    const results = await Promise.all(portfolios.map((portfolio) => GET("/api/alphaVantageApi/dailytimeseries/{ticker}", {
        params: {
            path: {
                ticker: portfolio.symbol
            }
        }
    })))
    return results.map((result) => result.data!)
}

