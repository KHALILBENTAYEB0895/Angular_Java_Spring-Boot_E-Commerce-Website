import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity:Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem:CartItem){

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCarItem: CartItem | undefined = undefined; 
    
    // find item in the cart based on item id 
    if(this.cartItems.length > 0){
      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === theCartItem.id){
          existingCarItem = tempCartItem;
          break;
        }
      }
      // check if we found it 
      alreadyExistsInCart = (existingCarItem != undefined);
    }
    if(alreadyExistsInCart){
      existingCarItem!.quantity++;
    }
    else{
    // just add the item to the array
    this.cartItems.push(theCartItem);
    }
  }
}
