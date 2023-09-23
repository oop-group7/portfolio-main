package net.bestcompany.foliowatch.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import net.bestcompany.foliowatch.models.PasswordResetToken;

public interface PasswordTokenRepository extends MongoRepository<PasswordResetToken, String> {
    Optional<PasswordResetToken> findByToken(String token);
}
