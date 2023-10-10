package net.bestcompany.foliowatch.security.services;

import java.util.Optional;

import net.bestcompany.foliowatch.models.RefreshToken;
import net.bestcompany.foliowatch.models.User;

public interface IRefreshTokenService {
    Optional<RefreshToken> findByToken(String token);

    RefreshToken createRefreshToken(String userId);

    RefreshToken verifyExpiration(RefreshToken token);

    void deleteTokenByUser(User user);
}
