package net.bestcompany.foliowatch.security.services;

import jakarta.servlet.ServletRequest;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.models.VerificationToken;

public interface IRegistrationUserService {
    VerificationToken sendRegistrationVerificationEmail(User user, ServletRequest request);
}
