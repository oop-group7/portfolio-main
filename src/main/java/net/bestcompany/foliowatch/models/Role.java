package net.bestcompany.foliowatch.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "roles")
@Getter
@Setter
@NoArgsConstructor
public class Role {
    private @Id @Setter(AccessLevel.PROTECTED) String id;

    @NotBlank
    private ERole name;

    public Role(ERole name) {
        this.name = name;
    }
}
