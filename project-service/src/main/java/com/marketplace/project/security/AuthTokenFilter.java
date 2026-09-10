package com.marketplace.project.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {
    public static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        logger.debug(
                "AuthTokenFilter called for URI: {}",
                request.getRequestURI()
        );
        try{
            // Get Jwt From Authorization Header
            String jwt = jwtUtils.getJwtFromHeader(request);
            // Check JWT exists and is valid
            if (jwt != null && jwtUtils.validateJwtToken(jwt)){
                // Extract user ID and role
                Long userId = jwtUtils.getUserIdFromJwtToken(jwt);
                String role = jwtUtils.getRoleFromJwtToken(jwt);

                // Create authority
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("Role_" + role);

                // Create Authentication object
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        List.of(authority)
                );
                // Add request details
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Store authentication in SecurityContext
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

                logger.debug("Authenticated userId={}, role={}",
                        userId,
                        role);
            }
        } catch (Exception e){
            logger.error("Cannot set user authentication :{}",
                    e.getMessage());
        }
        filterChain.doFilter(request,response);
    }
}
