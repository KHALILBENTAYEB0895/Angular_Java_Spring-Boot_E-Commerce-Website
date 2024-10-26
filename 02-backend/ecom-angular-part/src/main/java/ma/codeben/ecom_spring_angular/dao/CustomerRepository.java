package ma.codeben.ecom_spring_angular.dao;

import ma.codeben.ecom_spring_angular.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}
