package ma.codeben.ecom_spring_angular.service;

import ma.codeben.ecom_spring_angular.dto.Purchase;
import ma.codeben.ecom_spring_angular.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
