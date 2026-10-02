package com.marketplace.contract.exception;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String resource, String field, Object value) {
        super(resource + " NotFound With " + field + " : " + value);
    }
}
