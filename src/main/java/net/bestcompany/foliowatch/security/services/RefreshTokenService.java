package net.bestcompany.foliowatch.security.services;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.bestcompany.foliowatch.exceptions.TokenRefreshException;
import net.bestcompany.foliowatch.models.RefreshToken;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.repository.RefreshTokenRepository;
import net.bestcompany.foliowatch.repository.UserRepository;

@Service
@Transactional
public class RefreshTokenService implements IRefreshTokenService {
    @Value("${foliowatch.app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    public RefreshToken createRefreshToken(String userId) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(),
                    "Refresh token was expired. Please make a new sign in request");
        }
        return token;
    }

    @Override
    public void deleteTokenByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
