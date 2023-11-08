package net.bestcompany.foliowatch.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.bestcompany.foliowatch.models.Portfolio;
import net.bestcompany.foliowatch.repository.PortfolioRepository;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.payload.response.AllPortfoliosResponse;
import net.bestcompany.foliowatch.payload.response.PortfolioResponse;

@Service
@Transactional
public class PortfolioService implements IPortfolioService {
    @Autowired
    private PortfolioRepository portfolioRepository;

    @Override
    public void createPortfolio(Portfolio portfolio) throws Exception {
        User user = portfolio.getUser();
        AllPortfoliosResponse allPreviousPortfolios = getAllPortfoliosByUser(user);
        PortfolioResponse moreCurrentPortfolioInfo = mapPortfolioToPortfolioResponse(portfolio);
        double utilisedCapitalAmount = allPreviousPortfolios.getTotalUtilisedCapitalAmount() + moreCurrentPortfolioInfo.getUtilisedCapitalAmount();
        double totalCapitalAmount = allPreviousPortfolios.getTotalCapitalAmount() + moreCurrentPortfolioInfo.getCapitalAmount();
        if (utilisedCapitalAmount > totalCapitalAmount) {
            throw new Exception("Total utilised capital amount cannot be more than the total capital amount.");
        }
        portfolioRepository.save(portfolio);
    }

    @Override
    public Optional<PortfolioResponse> findPortfolio(String id) {
        return portfolioRepository.findById(id).map(PortfolioService::mapPortfolioToPortfolioResponse);
    }

    @Override
    public Optional<Portfolio> findPortfolioRaw(String id) {
        return portfolioRepository.findById(id);
    }

    @Override
    public AllPortfoliosResponse getAllPortfoliosByUser(User user) {
        // utilised > capital then fail
        List<Portfolio> portfolios =  portfolioRepository.findByUser(user);
        List<PortfolioResponse> portfolioResponse = portfolios.stream().map(PortfolioService::mapPortfolioToPortfolioResponse).toList();
        double totalUtilisedCapitalAmount = portfolioResponse.stream().mapToDouble(p -> p.getUtilisedCapitalAmount()).sum();
        double totalCapitalAmount = portfolioResponse.stream().mapToDouble(p -> p.getCapitalAmount()).sum();
        return new AllPortfoliosResponse(portfolioResponse, totalUtilisedCapitalAmount, totalCapitalAmount);
    }

    private static PortfolioResponse mapPortfolioToPortfolioResponse(Portfolio portfolio) {
        double utilisedCapitalAmount = portfolio.getDesiredStocks().stream().mapToDouble(ds -> ds.getQuantity() * ds.getPrice()).sum();
        return new PortfolioResponse(portfolio.getId(), portfolio.getName(), portfolio.getStrategy(), portfolio.getCapitalAmount(), portfolio.getDesiredStocks(), utilisedCapitalAmount, portfolio.getCreatedAt());
    }

    @Override
    public void deletePortfolio(String id) {
        portfolioRepository.deleteById(id);
    }

    @Override
    public void updatePortfolio(Portfolio portfolio) throws Exception {
        deletePortfolio(portfolio.getId());
        createPortfolio(portfolio);
    }

    @Override
    public void getAllCapitalStocks(User user) {
        getAllPortfoliosByUser(user);
    }
}
