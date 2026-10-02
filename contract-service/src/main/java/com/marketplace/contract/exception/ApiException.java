package com.marketplace.contract.exception;

import lombok.Getter;

public class ApiException extends RuntimeException{
    public ApiException(String message) {
        super(message);
    }
}
