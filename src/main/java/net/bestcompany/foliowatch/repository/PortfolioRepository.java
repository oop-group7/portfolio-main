package net.bestcompany.foliowatch.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import net.bestcompany.foliowatch.models.Portfolio;
import net.bestcompany.foliowatch.models.User;

public interface PortfolioRepository extends MongoRepository<Portfolio, String> {
    Optional<Portfolio> findById(String name);

    List<Portfolio> findByUser(User user);

    int deleteByName(String name);
}
