package net.bestcompany.foliowatch.security.services;

import java.util.Optional;

import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.models.VerificationToken;

import org.springframework.data.mongodb.core.query.Query;


public interface IUserService {
    TokenState validateVerificationToken(String token);

    VerificationToken generateNewVerificationToken(String existingVerificationToken);

    Optional<User> getUserByVerificationToken(String verificationToken);

    Optional<User> findUserByEmail(String email);

    void createPasswordResetTokenForUser(User user, String token);

    Optional<User> getUserByPasswordResetToken(String token);

    void changeUserPassword(User user, String password);

    boolean checkIfValidOldPassword(User user, String oldPassword);

    void deleteUser(User user);
}
