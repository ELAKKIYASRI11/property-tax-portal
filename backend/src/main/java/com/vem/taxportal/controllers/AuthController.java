package com.vem.taxportal.controllers;

import com.vem.taxportal.config.JwtUtils;
import com.vem.taxportal.dto.AuthResponse;
import com.vem.taxportal.dto.LoginRequest;
import com.vem.taxportal.dto.RegisterRequest;
import com.vem.taxportal.models.User;
import com.vem.taxportal.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "User already exists with this email"));
        }

        User user = new User(
                req.getName(),
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                req.getRole() != null ? req.getRole() : "citizen",
                req.getPhone(),
                req.getDateOfBirth(),
                req.getIsDifferentlyAbled(),
                req.getAddress()
        );

        User saved = userRepository.save(user);
        String token = jwtUtils.generateToken(saved.getId(), saved.getEmail(), saved.getRole());

        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(
                saved.getId(), saved.getName(), saved.getEmail(), saved.getRole(),
                saved.getPhone(), saved.getDateOfBirth(), saved.getIsDifferentlyAbled(),
                saved.getAddress(), token
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(req.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        User user = userOpt.get();
        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole());

        return ResponseEntity.ok(new AuthResponse(
                user.getId(), user.getName(), user.getEmail(), user.getRole(),
                user.getPhone(), user.getDateOfBirth(), user.getIsDifferentlyAbled(),
                user.getAddress(), token
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User principal)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }

        User user = userRepository.findById(principal.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        if (updates.containsKey("name")) user.setName((String) updates.get("name"));
        if (updates.containsKey("phone")) user.setPhone((String) updates.get("phone"));
        if (updates.containsKey("address")) user.setAddress((String) updates.get("address"));
        if (updates.containsKey("isDifferentlyAbled")) {
            user.setIsDifferentlyAbled(Boolean.parseBoolean(String.valueOf(updates.get("isDifferentlyAbled"))));
        }

        User saved = userRepository.save(user);
        String token = jwtUtils.generateToken(saved.getId(), saved.getEmail(), saved.getRole());

        return ResponseEntity.ok(new AuthResponse(
                saved.getId(), saved.getName(), saved.getEmail(), saved.getRole(),
                saved.getPhone(), saved.getDateOfBirth(), saved.getIsDifferentlyAbled(),
                saved.getAddress(), token
        ));
    }
}
