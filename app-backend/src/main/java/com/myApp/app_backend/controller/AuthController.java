package com.myApp.app_backend.controller;

import com.myApp.app_backend.model.User;
import com.myApp.app_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User saved = userService.register(user.getUsername(), user.getEmail(), user.getPassword());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registrasi berhasil!");
            response.put("user", saved);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User foundUser = userService.findByUsername(user.getUsername());
    boolean success = userService.authenticate(user.getUsername(), user.getPassword());

    Map<String, Object> response = new HashMap<>();
    if (success && foundUser != null) {
            response.put("message", "Login berhasil!");
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("username", foundUser.getUsername());
            userData.put("email", foundUser.getEmail());
            userData.put("profile", 
                (foundUser.getProfile() == null || foundUser.getProfile().isEmpty())
                    ? "https://i.pravatar.cc/150?img=12"
                    : foundUser.getProfile()
            );

            response.put("user", userData);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Username atau password salah");
            return ResponseEntity.status(401).body(response);
        }
    }
}
