package com.marketplace.project.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler{

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException)
            throws IOException, ServletException {

        LocalDateTime timestamp = LocalDateTime.now();

        String message = "You are not allowed to perform this action";

        String path = request.getRequestURI();

        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        String jsonResponse = String.format("""
                {
                    "timestamp": "%s",
                    "status": 403,
                    "error": "Forbidden",
                    "message": "%s",
                    "path": "%s"
                }
                """,
                timestamp,
                message,
                path
        );

        response.getWriter().write(jsonResponse);
    }
}
