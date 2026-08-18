package com.stocksense.service;

import com.stocksense.dto.AuthResponse;
import com.stocksense.dto.LoginRequest;
import com.stocksense.dto.RegisterRequest;
import com.stocksense.entity.User;
import com.stocksense.entity.UserRole;
import com.stocksense.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[A-Za-z0-9_]{3,50}$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^.{8,100}$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        validateRegistration(request);

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            user.setRole(UserRole.ADMIN);
        } else {
            user.setRole(UserRole.STAFF);
        }

        User savedUser = userRepository.save(user);
        return new AuthResponse(null, savedUser.getUsername(), savedUser.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (Exception exception) {
            throw new BadCredentialsException("Invalid credentials");
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

    private void validateRegistration(RegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Invalid request");
        }
        if (request.getUsername() == null || !USERNAME_PATTERN.matcher(request.getUsername().trim()).matches()) {
            throw new IllegalArgumentException("Invalid username");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty() || !request.getEmail().contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
        if (request.getPassword() == null || !PASSWORD_PATTERN.matcher(request.getPassword()).matches()) {
            throw new IllegalArgumentException("Invalid password");
        }
    }
}
