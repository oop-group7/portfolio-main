package net.bestcompany.foliowatch.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.bestcompany.foliowatch.models.Portfolio;
import net.bestcompany.foliowatch.repository.PortfolioRepository;
import net.bestcompany.foliowatch.models.User;

@Service
@Transactional
public class PortfolioService implements IPortfolioService {
    @Autowired
    private PortfolioRepository portfolioRepository;

    @Override
    public void createPortfolio(Portfolio portfolio) {
        portfolioRepository.save(portfolio);
    }

    @Override
    public Optional<Portfolio> findPortfolio(String id) {
        return portfolioRepository.findById(id);
    }

    @Override
    public List<Portfolio> getAllPortfoliosByUser(User user) {
        return portfolioRepository.findByUser(user);
    }

    @Override
    public void deletePortfolio(String id) {
        portfolioRepository.deleteById(id);
    }

    @Override
    public void updatePortfolio(Portfolio portfolio) {
        createPortfolio(portfolio);
    }
}
