package net.bestcompany.foliowatch.payload.response;

import java.util.List;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class JwtResponse {
    private final String token;
    private final String type = "Bearer";
    private final String id;
    private final String firstName;
    private final String email;
    private final List<String> roles;
}
