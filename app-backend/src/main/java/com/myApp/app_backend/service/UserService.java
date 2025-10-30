package com.myApp.app_backend.service;

import com.myApp.app_backend.model.User;
import com.myApp.app_backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }



    public User register(String username, String email, String password) {
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
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        return userRepository.save(user);
    }

    public boolean authenticate(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> encoder.matches(password, user.getPassword()))
                .orElse(false);
    }
}
