package net.bestcompany.foliowatch.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import net.bestcompany.foliowatch.models.RefreshToken;
import net.bestcompany.foliowatch.models.User;

public interface RefreshTokenRepository extends MongoRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);

    int deleteByUser(User user);
}
