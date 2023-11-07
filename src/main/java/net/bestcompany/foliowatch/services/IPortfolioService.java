package net.bestcompany.foliowatch.services;

import java.util.Optional;

import net.bestcompany.foliowatch.models.Portfolio;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.payload.response.AllPortfoliosResponse;
import net.bestcompany.foliowatch.payload.response.PortfolioResponse;

public interface IPortfolioService {
    void createPortfolio(Portfolio portfolio);

    Optional<PortfolioResponse> findPortfolio(String id);

    AllPortfoliosResponse getAllPortfoliosByUser(User user);

    void deletePortfolio(String name);

    void updatePortfolio(Portfolio portfolio);

    void getAllCapitalStocks(User user);

    Optional<Portfolio> findPortfolioRaw(String id);
}
