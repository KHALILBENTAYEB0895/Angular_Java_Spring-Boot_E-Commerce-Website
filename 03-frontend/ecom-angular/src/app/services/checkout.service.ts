import { Purchase } from './../common/purchase';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = 'http://localhost:8080/api/checkout/purchase';

  constructor(private httpClient: HttpClient) { }

  // placeOrder(purchase: Purchase): Observable<any> {
  //   return this.httpClient.post<Purchase>(this.purchaseUrl, purchase)
  // }

  placeOrder(purchase: Purchase): Observable<any> {
    console.log('Sending order:', purchase); // Ajoutez ceci pour voir les données
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
  
}
