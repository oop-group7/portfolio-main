package net.bestcompany.foliowatch.events;

import org.springframework.context.ApplicationEvent;

import jakarta.servlet.http.HttpServletRequest;
import net.bestcompany.foliowatch.models.User;

public class OnRegistrationCompleteEvent extends ApplicationEvent {
    private User user;
    private String baseUrl;

    public OnRegistrationCompleteEvent(User user, HttpServletRequest request) {
        super(user);
        this.user = user;
        this.baseUrl = Utils.constructBaseUrl(request);
    }

    public User getUser() {
        return user;
    }

    public String getBaseUrl() {
        return baseUrl;
    }
}