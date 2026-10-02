package com.marketplace.auth.mapper;

import com.marketplace.auth.dto.AuthResponse;
import com.marketplace.auth.dto.UserResponse;
import com.marketplace.auth.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // User -> UserResponse
    @Mapping(
            target = "fullName",
            expression = "java(user.getFirstName() + \" \" + user.getLastName())"
    )
    UserResponse toUserResponse(User user);

//    UserResponse toUserResponse(User user, String token);

    // User -> AuthResponse
    @Mapping(
            target = "fullName",
            expression = "java(user.getFirstName() + \" \" + user.getLastName())"
    )
    @Mapping(target = "token", source = "token")
    AuthResponse toAuthResponse(User user,String token);
}

