package ma.codeben.ecom_spring_angular.controller;

import ma.codeben.ecom_spring_angular.dao.UserRepository;
import ma.codeben.ecom_spring_angular.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}
