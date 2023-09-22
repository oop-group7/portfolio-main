package net.bestcompany.foliowatch.listeners;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import net.bestcompany.foliowatch.events.OnRegistrationCompleteEvent;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.models.VerificationToken;
import net.bestcompany.foliowatch.repository.VerificationTokenRepository;

@Component
public class RegistrationListener implements ApplicationListener<OnRegistrationCompleteEvent> {
    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Override
    public void onApplicationEvent(OnRegistrationCompleteEvent event) {
        confirmRegistration(event);
    }

    private void confirmRegistration(OnRegistrationCompleteEvent event) {
        User user = event.getUser();
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, user);
        tokenRepository.save(verificationToken);
        String recipientAddress = user.getEmail();
        String subject = "Registration confirmation";
        // TODO: Send email
    }
}
