package ma.codeben.ecom_spring_angular.dao;

import ma.codeben.ecom_spring_angular.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
