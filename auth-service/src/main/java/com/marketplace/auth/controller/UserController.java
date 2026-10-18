package com.marketplace.auth.controller;

import com.marketplace.auth.dto.AuthResponse;
import com.marketplace.auth.dto.UpdateUserRequest;
import com.marketplace.auth.dto.UserResponse;
import com.marketplace.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // http://localhost:8081/api/users/1
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id){
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    // http://localhost:8081/api/users/1
//    @PutMapping("/users/{id}")
//    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request){
//        UserResponse response = userService.updateUser(id,request);
//        return ResponseEntity.ok(response);
//    }

    @PutMapping("/users/{id}")
    public ResponseEntity<AuthResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request){
        AuthResponse response = userService.updateUser(id,request);
        return ResponseEntity.ok(response);
    }

    // http://localhost:8081/api/users/freelancers
    @GetMapping("/users/freelancers")
    public ResponseEntity<List<UserResponse>> getFreelancers(){
        List<UserResponse> freelancers = userService.getAllFreelancers();
        return ResponseEntity.ok(freelancers);
    }

}
