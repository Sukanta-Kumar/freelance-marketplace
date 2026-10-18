package com.marketplace.project.exception;

public class ApiException extends RuntimeException{
    public ApiException(String message) {
        super(message);
    }
}
