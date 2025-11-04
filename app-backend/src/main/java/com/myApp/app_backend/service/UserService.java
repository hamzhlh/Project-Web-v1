package com.myApp.app_backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.myApp.app_backend.model.User;
import com.myApp.app_backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final Cloudinary cloudinary;

    public UserService(UserRepository userRepository, Cloudinary cloudinary) {
        this.userRepository = userRepository;
        this.cloudinary = cloudinary;
    }

    // 🔍 Cari user berdasarkan username
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    // 🧩 REGISTER
    public User register(String username, String name, String email, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username sudah dipakai");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email sudah dipakai");
        }

        User user = new User();
        user.setUsername(username);
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        return userRepository.save(user);
    }

    // 🧩 LOGIN VALIDATION
    public boolean authenticate(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> encoder.matches(password, user.getPassword()))
                .orElse(false);
    }

    // 🧩 UPDATE PROFILE (pakai Cloudinary)
    public User updateUser(Long id, String name, String email, String phone, MultipartFile profileFile) throws IOException {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        existingUser.setName(name);
        existingUser.setEmail(email);
        existingUser.setPhone(phone);

        // ✅ Upload ke Cloudinary hanya jika file ada
        if (profileFile != null && !profileFile.isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(
                        profileFile.getBytes(),
                        ObjectUtils.asMap(
                                "folder", "user_profiles",
                                "resource_type", "auto" // ⬅️ penting agar Cloudinary handle otomatis
                        )
                );

                String imageUrl = (String) uploadResult.get("secure_url");
                existingUser.setProfile(imageUrl);
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Gagal upload gambar ke Cloudinary: " + e.getMessage());
            }
        }

        return userRepository.save(existingUser);
    }
}
