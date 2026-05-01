package com.bookstore.api.controller;

import com.bookstore.api.dto.AuthResponse;
import com.bookstore.api.dto.LoginRequest;
import com.bookstore.api.dto.RegisterRequest;
import com.bookstore.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody com.bookstore.api.dto.GoogleLoginRequest request) {
        return ResponseEntity.ok(authService.googleLogin(request));
    }
}
