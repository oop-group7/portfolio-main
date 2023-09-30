package net.bestcompany.foliowatch.validators;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Target({ ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface Password {
    String message() default "Please ensure that your password is between 8-25 characters, has at least a symbol, a numeric character, and an upper and lowercase letter.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
