import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity:Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem:CartItem){

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCarItem: CartItem | undefined = undefined; 
    
    // find item in the cart based on item id 
    if(this.cartItems.length > 0){

      existingCarItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      
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
    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if(cartItem.quantity === 0){
      this.cartRemove(cartItem);
    }
    else{
      this.computeCartTotals();
    }
  }

  cartRemove(cartItem: CartItem) {
    
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);

    // if found ,remove the item from the array at the given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitprice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitprice;
      console.log(`name: ${tempCartItem.name} , quantity:${tempCartItem.quantity} , subTotalPrice = ${subTotalPrice}`);
    }
    console.log(`totalePrice = ${totalPriceValue.toFixed(2)}, totalQuantity:${totalQuantityValue}`);
    console.log('-----')
  }
}
