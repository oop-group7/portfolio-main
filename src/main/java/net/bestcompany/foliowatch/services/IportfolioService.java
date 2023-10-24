package net.bestcompany.foliowatch.services;

import java.util.List;

import net.bestcompany.foliowatch.models.Portfolio;
import net.bestcompany.foliowatch.models.User;

public interface IportfolioService {
    void createPortfolio(Portfolio portfolio) throws Exception;
    List<Portfolio> getAllPortfoliosByUser(User user);
}
