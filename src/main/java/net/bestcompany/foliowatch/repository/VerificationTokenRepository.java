package net.bestcompany.foliowatch.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import net.bestcompany.foliowatch.models.VerificationToken;

public interface VerificationTokenRepository extends MongoRepository<VerificationToken, String> {
    Optional<VerificationToken> findByToken(String token);
}
