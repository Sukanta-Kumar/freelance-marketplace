package com.marketplace.auth.service;

import com.marketplace.auth.dto.AuthResponse;
import com.marketplace.auth.dto.UpdateUserRequest;
import com.marketplace.auth.dto.UserResponse;
import com.marketplace.auth.entity.User;
import com.marketplace.auth.enums.Role;
import com.marketplace.auth.exception.UserAlreadyExistsException;
import com.marketplace.auth.exception.UserNotFoundException;
import com.marketplace.auth.mapper.UserMapper;
import com.marketplace.auth.repository.UserRepository;
import com.marketplace.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException("User not found with id: "+ id));
        return userMapper.toUserResponse(user);
    }

//    @Override
//    public UserResponse updateUser(Long id, UpdateUserRequest request) {
//        // 1. Find user by ID
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new UserNotFoundException( "User not found with id: " + id ) );
//        // 2. Check whether email is being changed
//        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
//            throw new UserAlreadyExistsException( "Email already exists: " + request.getEmail()
//            );
//        }
//        // 3. Update user fields
//        user.setFirstName(request.getFirstName());
//        user.setLastName(request.getLastName());
//        user.setEmail(request.getEmail());
//        // 4. Update role if provided
//        if (request.getRole() != null) {
//            user.setRole(request.getRole());
//        }
//        // 5. Update status if provided
//        if (request.getStatus() != null) {
//            user.setStatus(request.getStatus());
//        }
//        // 6. Save updated user
//        User updatedUser = userRepository.save(user);
//        // 7. Convert User entity → UserResponse
//        return userMapper.toUserResponse(updatedUser);
//    }

    @Override
    public AuthResponse updateUser(Long id, UpdateUserRequest request) {
        // 1. Find user by ID
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException( "User not found with id: " + id ) );
        // 2. Check whether email is being changed
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException( "Email already exists: " + request.getEmail()
            );
        }
        // 3. Update user fields
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        // 4. Update role if provided
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        // 5. Update status if provided
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }
        // 6. Save updated user
        User updatedUser = userRepository.save(user);
        // 7. Convert User entity → UserResponse

        UserDetails userDetails = new UserDetailsImpl(user);
        String token = jwtService.generateToken(userDetails);
        return userMapper.toAuthResponse(updatedUser,token);
    }

    @Override
    public List<UserResponse> getAllFreelancers() {
        List<User> freelancers = userRepository.findByRole(Role.FREELANCER);
        return freelancers.stream()
                .map(userMapper::toUserResponse)
                .toList();
    }
}
