package com.myApp.app_backend.service;

import com.myApp.app_backend.model.User;
import com.myApp.app_backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private static final String UPLOAD_DIR = "uploads/";

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 🔍 Cari user berdasarkan username
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    // 🧩 REGISTER
    public User register(String username, String name, String email, String password) {
        // Cek duplikat username
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username sudah dipakai");
        }

        // Cek duplikat email
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

    // 🧩 UPDATE PROFILE
    // ✅ Update user + handle file upload
    public User updateUser(Long id, String name, String email, String phone, MultipartFile profileFile) throws IOException {
        Optional<User> existingUserOpt = userRepository.findById(id);

        if (existingUserOpt.isEmpty()) {
            throw new RuntimeException("User tidak ditemukan");
        }

        User existingUser = existingUserOpt.get();

        existingUser.setName(name);
        existingUser.setEmail(email);
        existingUser.setPhone(phone);

        // ✅ Kalau user upload foto baru
        if (profileFile != null && !profileFile.isEmpty()) {
            // 🗑️ Hapus foto lama kalau ada dan bukan default
            if (existingUser.getProfile() != null && !existingUser.getProfile().contains("default.png")) {
                String oldFilePath = existingUser.getProfile().replace("/uploads/", "uploads/");
                File oldFile = new File(oldFilePath);
                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }

            // 💾 Simpan foto baru
            String newFileName = "user-" + id + "-" + System.currentTimeMillis() + ".png";
            Path filePath = Paths.get(UPLOAD_DIR + newFileName);
            Files.copy(profileFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Simpan URL ke database (untuk diakses frontend)
            existingUser.setProfile("/uploads/" + newFileName);
        }

        return userRepository.save(existingUser);
    }
}
