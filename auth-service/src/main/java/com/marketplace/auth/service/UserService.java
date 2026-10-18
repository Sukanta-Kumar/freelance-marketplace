package com.marketplace.auth.service;

import com.marketplace.auth.dto.AuthResponse;
import com.marketplace.auth.dto.UpdateUserRequest;
import com.marketplace.auth.dto.UserResponse;
import jakarta.validation.Valid;

import java.util.List;

public interface UserService {
    UserResponse getUserById(Long id);
//    UserResponse updateUser(Long id, @Valid UpdateUserRequest request);
    AuthResponse updateUser(Long id, @Valid UpdateUserRequest request);
    List<UserResponse> getAllFreelancers();
}
