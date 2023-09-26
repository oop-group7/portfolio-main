package net.bestcompany.foliowatch.security.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.ServletRequest;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.models.VerificationToken;
import net.bestcompany.foliowatch.repository.VerificationTokenRepository;
import net.bestcompany.foliowatch.utils.Utils;

@Service
@Transactional
public class RegistrationUserService implements IRegistrationUserService {
    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public VerificationToken sendRegistrationVerificationEmail(User user, ServletRequest request) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, user);
        tokenRepository.save(verificationToken);
        String recipientAddress = user.getEmail();
        String subject = "Registration confirmation";
        String confirmationUrl = Utils.constructBaseUrl(request) + "/api/auth/registrationconfirm?token=" + token;
        String message = "You registered successfully. We will send you a confirmation message to your email account.";
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText(message + "\r\n" + confirmationUrl);
        mailSender.send(email);
        return verificationToken;
    }
}
