package com.marketplace.project.exception;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String resource, String field, Object value) {
        super(resource + " Not Found with " + field + " : " + value);
    }
}
