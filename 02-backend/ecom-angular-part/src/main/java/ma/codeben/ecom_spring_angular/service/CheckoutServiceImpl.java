package ma.codeben.ecom_spring_angular.service;

import jakarta.transaction.Transactional;
import ma.codeben.ecom_spring_angular.dao.CustomerRepository;
import ma.codeben.ecom_spring_angular.dto.Purchase;
import ma.codeben.ecom_spring_angular.dto.PurchaseResponse;
import ma.codeben.ecom_spring_angular.entity.Customer;
import ma.codeben.ecom_spring_angular.entity.Order;
import ma.codeben.ecom_spring_angular.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{
    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        // retrieve the order info from dto
        Order order = purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        //populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate costumer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        // save to database
        customerRepository.save(customer);

        //return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
