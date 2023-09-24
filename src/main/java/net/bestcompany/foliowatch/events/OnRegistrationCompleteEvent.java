package net.bestcompany.foliowatch.events;

import org.springframework.context.ApplicationEvent;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.utils.Utils;

@Getter
public class OnRegistrationCompleteEvent extends ApplicationEvent {
    private User user;
    private String baseUrl;

    public OnRegistrationCompleteEvent(User user, HttpServletRequest request) {
        super(user);
        this.user = user;
        this.baseUrl = Utils.constructBaseUrl(request);
    }
}
