package net.bestcompany.foliowatch.services;

import java.util.List;
import java.util.Optional;

import net.bestcompany.foliowatch.models.Portfolio;
import net.bestcompany.foliowatch.models.User;

public interface IportfolioService {
    void createPortfolio(Portfolio portfolio) throws Exception;
    Optional<Portfolio> findPortfolio(Portfolio portfolio);
    List<Portfolio> getAllPortfoliosByUser(User user);
    void deletePortfolio(Portfolio portfolio);
}
