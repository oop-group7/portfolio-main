package net.bestcompany.foliowatch.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<Password, String> {
    @Override
    public void initialize(Password password) {

    }

    @Override
    public boolean isValid(String passwordField, ConstraintValidatorContext ctx) {
        return passwordField.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,25}$");
    }
}
