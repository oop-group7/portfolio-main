package net.bestcompany.foliowatch.security.services;

import java.util.Optional;

import net.bestcompany.foliowatch.models.RefreshToken;

public interface IRefreshTokenService {
    Optional<RefreshToken> findByToken(String token);

    RefreshToken createRefreshToken(String userId);

    RefreshToken verifyExpiration(RefreshToken token);

    int deleteByUserId(String userId);
}
