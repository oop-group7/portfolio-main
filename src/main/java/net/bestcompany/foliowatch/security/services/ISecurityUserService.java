package net.bestcompany.foliowatch.security.services;

public interface ISecurityUserService {
    TokenState validatePasswordResetToken(String token);

    void deletePasswordResetToken(String token);
}
