package com.marketplace.auth.service;

import com.marketplace.auth.dto.AuthResponse;
import com.marketplace.auth.dto.LoginRequest;
import com.marketplace.auth.dto.RegisterRequest;
import com.marketplace.auth.entity.User;
import com.marketplace.auth.enums.Role;
import com.marketplace.auth.enums.UserStatus;
import com.marketplace.auth.mapper.UserMapper;
import com.marketplace.auth.repository.UserRepository;
import com.marketplace.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Check whether email is already registered
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create new User
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null
                        ? request.getRole()
                        : Role.CLIENT)
                .status(UserStatus.ACTIVE)
                .build();

        // Save user in database
        User savedUser = userRepository.save(user);

        UserDetails userDetails = new UserDetailsImpl(savedUser);

        String token = jwtService.generateToken(userDetails);

        // Convert User entity to AuthResponse
        return userMapper.toAuthResponse(savedUser, token);
    }


    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        UserDetails userDetails = new UserDetailsImpl(user);
        String token = jwtService.generateToken(userDetails);

        return userMapper.toAuthResponse(user, token);
    }
}


/*
    // REGISTER
    @Override
    public AuthResponse register(RegisterRequest request) {

        // 1. Check whether email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // 2. Create User entity
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(request.getRole())
                .build();

        // 3. Save user
        User savedUser = userRepository.save(user);

        // 4. Generate JWT token
        String token =
                jwtService.generateJwtToken((Authentication) savedUser);


        // 5. Convert User → AuthResponse
        return userMapper.toAuthResponse(
                savedUser,
                token
        );
    }


    // LOGIN
    @Override
    public AuthResponse login(LoginRequest request) {

        // 1. Find user by email
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );


        // 2. Verify password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        // 3. Generate JWT token
        String token =
                jwtService.generateJwtToken((Authentication) user);


        // 4. Convert User → AuthResponse
        return userMapper.toAuthResponse(
                user,
                token
        );
    }
}


 */
