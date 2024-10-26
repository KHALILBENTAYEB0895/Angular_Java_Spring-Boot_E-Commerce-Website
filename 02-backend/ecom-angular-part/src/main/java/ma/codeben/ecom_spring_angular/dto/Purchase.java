package ma.codeben.ecom_spring_angular.dto;

import lombok.Data;
import ma.codeben.ecom_spring_angular.entity.Address;
import ma.codeben.ecom_spring_angular.entity.Customer;
import ma.codeben.ecom_spring_angular.entity.Order;
import ma.codeben.ecom_spring_angular.entity.OrderItem;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
