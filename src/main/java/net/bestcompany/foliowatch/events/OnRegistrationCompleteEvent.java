package net.bestcompany.foliowatch.events;

import org.springframework.context.ApplicationEvent;

import net.bestcompany.foliowatch.models.User;

public class OnRegistrationCompleteEvent extends ApplicationEvent {
    private User user;

    public OnRegistrationCompleteEvent(User user) {
        super(user);
        this.user = user;
    }

    public User getUser() {
        return user;
    }
}
