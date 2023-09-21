package net.bestcompany.foliowatch.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import net.bestcompany.foliowatch.models.VerificationToken;

public interface VerificationTokenRepository extends MongoRepository<VerificationToken, String> {
    VerificationToken findByToken(String token);
}
