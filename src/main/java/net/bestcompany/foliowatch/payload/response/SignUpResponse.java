package net.bestcompany.foliowatch.payload.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class SignUpResponse {
    private final String token;
}
