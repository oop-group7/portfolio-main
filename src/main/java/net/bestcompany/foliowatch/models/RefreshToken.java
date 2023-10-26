package net.bestcompany.foliowatch.models;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "refreshtoken")
@Getter
@Setter
@NoArgsConstructor
public class RefreshToken {
    private @Id @Setter(AccessLevel.PROTECTED) String id;

    @DBRef
    @NotNull
    private User user;

    @NotBlank
    private String token;

    @NotNull
    private Instant expiryDate;
}
