package net.bestcompany.foliowatch.utils;

import org.springframework.mail.SimpleMailMessage;

import jakarta.servlet.ServletRequest;
import jakarta.servlet.http.HttpServletRequest;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.models.VerificationToken;

public class Utils {
    public static String constructBaseUrl(ServletRequest request) {
        String HTTP = "http";
        String HTTPS = "https";
        String scheme = request.getScheme();
        String server = request.getServerName();
        int port = request.getServerPort();
        StringBuffer url = new StringBuffer(scheme).append("://").append(server);
        if (port > 0 && ((HTTP.equalsIgnoreCase(scheme) && port != 80) ||
                (HTTPS.equalsIgnoreCase(scheme) && port != 443))) {
            url.append(':').append(port);
        }
        return url.toString();
    }

    public static SimpleMailMessage constructResendVerificationTokenEmail(HttpServletRequest request,
            VerificationToken newToken, User user) {
        String confirmationUrl = Utils.constructBaseUrl(request) + "/api/auth/registrationconfirm?token="
                + newToken.getToken();
        String message = "We will send an email with a new registration token to your email account.";
        return constructEmail("Resend registration token", message + "\r\n" + confirmationUrl, user);
    }

    public static SimpleMailMessage constructResetTokenEmail(HttpServletRequest request, String newToken,
            User user) {
        String confirmationUrl = Utils.constructBaseUrl(request) + "/api/auth/changeforgottenpassword?token="
                + newToken;
        String message = "Reset password";
        return constructEmail(message, message + "\r\n" + confirmationUrl, user);
    }

    private static SimpleMailMessage constructEmail(String subject, String body, User user) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setSubject(subject);
        email.setText(body);
        email.setTo(user.getEmail());
        return email;
    }
}
