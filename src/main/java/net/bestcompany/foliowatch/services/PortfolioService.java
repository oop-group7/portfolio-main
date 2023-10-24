package net.bestcompany.foliowatch.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.bestcompany.foliowatch.models.Portfolio;
import net.bestcompany.foliowatch.repository.PortfolioRepository;
import net.bestcompany.foliowatch.models.User;

@Service
@Transactional
public class PortfolioService implements IportfolioService {
    @Autowired
    private PortfolioRepository portfolioRepository;

    @Override
    public void createPortfolio(Portfolio portfolio) throws Exception {
        if (portfolioRepository.findByName(portfolio.getName()).isPresent()) {
            throw new Exception("Portfolio already exists, name must be unique.");
        }
        portfolioRepository.save(portfolio);
    }

    @Override
    public List<Portfolio> getAllPortfoliosByUser(User user){
        return portfolioRepository.findByUser(user);
    }
}
