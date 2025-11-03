package com.myApp.app_backend.controller;

import com.myApp.app_backend.model.User;
import com.myApp.app_backend.security.JwtUtil;
import com.myApp.app_backend.service.UserService;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
// @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
// @CrossOrigin(origins = "https://project-web-v1.vercel.app", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // 🧩 REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User saved = userService.register(user.getUsername(), user.getName(), user.getEmail(), user.getPassword());

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

    // 🧩 LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        boolean success = userService.authenticate(user.getUsername(), user.getPassword());
        User foundUser = userService.findByUsername(user.getUsername());

        if (!success || foundUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Username atau password salah"));
        }

        // ✅ Generate Access dan Refresh Token
        String accessToken = jwtUtil.generateAccessToken(foundUser.getUsername(), Map.of());
        String refreshToken = jwtUtil.generateRefreshToken(foundUser.getUsername());

        // 🍪 Simpan Refresh Token di HttpOnly Cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // ganti ke true kalau sudah HTTPS
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 hari
                .build();

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", foundUser.getId());
        userData.put("username", foundUser.getUsername());
        userData.put("name", foundUser.getName());
        userData.put("email", foundUser.getEmail());
        userData.put("phone", foundUser.getPhone());
        userData.put("profile",
                (foundUser.getProfile() == null || foundUser.getProfile().isEmpty())
                        ? "https://i.pravatar.cc/150?img=12"
                        : foundUser.getProfile()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of(
                        "message", "Login berhasil!",
                        "accessToken", accessToken,
                        "user", userData
                ));
    }

    // 🧩 REFRESH TOKEN (dipanggil otomatis ketika access token expired)
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Refresh token tidak ditemukan"));
        }

        try {
            String username = jwtUtil.getUsername(refreshToken);
            String newAccessToken = jwtUtil.generateAccessToken(username, Map.of());
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        } catch (JwtException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Refresh token tidak valid atau sudah expired"));
        }
    }

    // 🧩 LOGOUT (hapus cookie refresh token)
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Logout berhasil"));
    }

    // Optional: Root test endpoint
    @GetMapping("/")
    public String home() {
        return "✅ Backend API is running!";
    }
}
