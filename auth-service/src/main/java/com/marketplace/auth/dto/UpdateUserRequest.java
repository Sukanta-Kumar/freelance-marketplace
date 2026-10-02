package com.marketplace.auth.dto;

import com.marketplace.auth.enums.Role;
import com.marketplace.auth.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    public Role role;
    public UserStatus status;
}
