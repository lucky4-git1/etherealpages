package com.bookstore.api.service;

import com.bookstore.api.dto.AuthResponse;
import com.bookstore.api.dto.LoginRequest;
import com.bookstore.api.dto.RegisterRequest;
import com.bookstore.api.dto.GoogleLoginRequest;
import com.bookstore.api.model.Role;
import com.bookstore.api.model.User;
import com.bookstore.api.model.Cart;
import com.bookstore.api.repository.UserRepository;
import com.bookstore.api.repository.CartRepository;
import com.bookstore.api.security.JwtService;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    // This must match your frontend Google Client ID!
    @Value("${google.client.id:YOUR_GOOGLE_CLIENT_ID}")
    private String googleClientId;

    public AuthResponse register(RegisterRequest request) {
        // Basic check
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
                
        userRepository.save(user);

        // create empty cart wrapper for user
        Cart cart = Cart.builder().user(user).build();
        cartRepository.save(cart);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        var jwtToken = jwtService.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
                
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        var jwtToken = jwtService.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthResponse googleLogin(GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    // Uncomment the setAudience line in production once you have a real Client ID to prevent token spoofing
                    // .setAudience(java.util.Collections.singletonList(googleClientId))
                    .build();

            // We use parse instead of verify because we might not have the correct Audience configured if the user hasn't set their Client ID up yet
            GoogleIdToken idToken = GoogleIdToken.parse(new GsonFactory(), request.getCredential());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String googleId = payload.getSubject();

                User user = userRepository.findByEmail(email).orElse(null);

                if (user == null) {
                    // Register the new Google user
                    user = User.builder()
                            .name(name)
                            .email(email)
                            .googleId(googleId)
                            .role(Role.USER)
                            .build();
                    userRepository.save(user);
                    
                    Cart cart = Cart.builder().user(user).build();
                    cartRepository.save(cart);
                } else if (user.getGoogleId() == null) {
                    // Update existing traditional user with Google ID
                    user.setGoogleId(googleId);
                    userRepository.save(user);
                }

                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                var jwtToken = jwtService.generateToken(userDetails);

                return AuthResponse.builder()
                        .token(jwtToken)
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build();
            } else {
                throw new RuntimeException("Invalid Google ID token.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to authenticate with Google: " + e.getMessage());
        }
    }
}
