package com.forge.billing_system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.forge.billing_system.entity.User;
import com.forge.billing_system.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // CREATE USER
    public User createUser(User user) {

        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser != null) {
            throw new RuntimeException("Username already exists");
        }

        // encrypt password
        user.setPassword(encoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // LOGIN USER
    public User login(String username, String password) {

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("Invalid username");
        }

        System.out.println("Entered Username: " + username);
        System.out.println("Entered Password: " + password);
        System.out.println("Stored Password: " + user.getPassword());

        boolean matched = encoder.matches(password, user.getPassword());

        System.out.println("Password Matched: " + matched);

        if (!matched) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET BY ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // UPDATE USER
    public User updateUser(Long id, User user) {

        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setFullName(user.getFullName());
        existing.setRole(user.getRole());
        existing.setActive(user.getActive());

        // update password only if provided
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existing.setPassword(encoder.encode(user.getPassword()));
        }

        return userRepository.save(existing);
    }

    // DELETE USER
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}