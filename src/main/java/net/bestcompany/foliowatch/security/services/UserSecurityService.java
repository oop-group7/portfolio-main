package net.bestcompany.foliowatch.security.services;

import java.util.Calendar;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.bestcompany.foliowatch.models.PasswordResetToken;
import net.bestcompany.foliowatch.repository.PasswordTokenRepository;

@Service
@Transactional
public class UserSecurityService implements ISecurityUserService {
    @Autowired
    private PasswordTokenRepository passwordTokenRepository;

    public TokenState validatePasswordResetToken(String token) {
        Optional<PasswordResetToken> rawPassToken = passwordTokenRepository.findByToken(token);
        if (rawPassToken.isEmpty()) {
            // Token not found
            return TokenState.TokenInvalid;
        }
        PasswordResetToken passToken = rawPassToken.get();
        if (isTokenExpired(passToken)) {
            return TokenState.TokenExpired;
        }
        return TokenState.TokenValid;
    }

    public void deletePasswordResetToken(String token) throws NoSuchElementException {
        PasswordResetToken passToken = passwordTokenRepository.findByToken(token).orElseThrow();
        passwordTokenRepository.delete(passToken);
    }

    private boolean isTokenExpired(PasswordResetToken passToken) {
        Calendar cal = Calendar.getInstance();
        return passToken.getExpiryDate().before(cal.getTime());
    }
}
