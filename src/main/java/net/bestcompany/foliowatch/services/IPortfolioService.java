package net.bestcompany.foliowatch.services;

import java.util.List;
import java.util.Optional;

import net.bestcompany.foliowatch.models.Portfolio;
import net.bestcompany.foliowatch.models.User;

public interface IPortfolioService {
    void createPortfolio(Portfolio portfolio);

    Optional<Portfolio> findPortfolio(String id);

    List<Portfolio> getAllPortfoliosByUser(User user);

    void deletePortfolio(String name);

    void updatePortfolio(Portfolio portfolio);

    void getAllCapitalStocks(User user);
}
