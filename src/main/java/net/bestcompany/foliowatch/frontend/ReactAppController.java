package net.bestcompany.foliowatch.frontend;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class ReactAppController {
    @GetMapping(value = { "/", "" })
    public String getIndex(HttpServletRequest request) {
        return "/index.html";
    }
}
