package ma.codeben.ecom_spring_angular.controller;

import ma.codeben.ecom_spring_angular.dao.UserRepository;
import ma.codeben.ecom_spring_angular.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public boolean login(@RequestBody User user){
        return userRepository.findByUsername(user.getUsername())
                .map(u -> u.getPassword().equals(user.getPassword()))
                .orElse(false);
    }
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user){

        Map<String, String> response = new HashMap<>();

        if(userRepository.findByUsername(user.getUsername()).isPresent()){
            response.put("error", "Username already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        userRepository.save(user);
        response.put("message", "User registered successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
