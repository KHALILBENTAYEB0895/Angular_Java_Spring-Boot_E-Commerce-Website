package ma.codeben.ecom_spring_angular.controller;

import ma.codeben.ecom_spring_angular.dto.Purchase;
import ma.codeben.ecom_spring_angular.dto.PurchaseResponse;
import ma.codeben.ecom_spring_angular.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
    private CheckoutService checkoutService;
    public CheckoutController(CheckoutService checkoutService){
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){
        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
        return purchaseResponse;
    }
}
