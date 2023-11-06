package net.bestcompany.foliowatch.exceptions;

public class RetryException extends RuntimeException {
    public RetryException() {
        super("Service unavailable");
    }
}
