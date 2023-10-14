package net.bestcompany.foliowatch.configs;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@Configuration
@SecurityScheme(type = SecuritySchemeType.HTTP, name = "bearerAuth", scheme = "bearer", bearerFormat = "JWT")
public class SpringDocConfig {
}
