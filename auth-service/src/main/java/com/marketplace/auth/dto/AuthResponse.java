package com.marketplace.auth.dto;

import com.marketplace.auth.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String token;
}
