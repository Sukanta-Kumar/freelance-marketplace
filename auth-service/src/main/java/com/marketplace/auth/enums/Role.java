package com.marketplace.auth.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
    CLIENT,
    FREELANCER,
    ADMIN;

    @JsonCreator
    public static Role fromString(String value) {
        if (value == null) {
            return null;
        }
        return Role.valueOf(value.trim().toUpperCase());
    }
}
