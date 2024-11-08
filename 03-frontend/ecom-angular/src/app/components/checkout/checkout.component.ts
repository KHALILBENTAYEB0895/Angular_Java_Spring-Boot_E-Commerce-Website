import { Order } from './../../common/order';
import { CheckoutService } from './../../services/checkout.service';
import { CheckoutValidators } from './../../validators/checkout-validators';
import { ShopFromService } from './../../services/shop-from.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  
  constructor(private formBuilder: FormBuilder,
              private shopFromServices: ShopFromService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) {}
  
  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.shopFromServices.getCreditCardMonths().subscribe(
      data => {
        this.creditCardMonths = data;
        console.log("Retrieved credit card months: " + JSON.stringify(data));
      }
    );

    // populate credit card years

    this.shopFromServices.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
        console.log("Retrieved credit card months: " + JSON.stringify(data));
      }
    );

    // populate countries
    this.shopFromServices.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );

  }
  
  
  onSubmit() {
  console.log("Handling the submit button");

  if (this.checkoutFormGroup.invalid) {
    this.checkoutFormGroup.markAllAsTouched();
    return;
  }

  // set up order
  let order = new Order();
  order.totalQuantity = this.totalQuantity;
  console.log(`total quntitity: ${order.totalQuantity}`);
  order.totalPrice = this.totalPrice;
  console.log(`total price: ${order.totalQuantity}`);


  // get cart items
  const cartItems = this.cartService.cartItems;

  // Create orderItems from cartItems
  const orderItems: OrderItem[] = cartItems.map( item => {const orderItem = new OrderItem(item); return orderItem; });


  // set up purchase
  let purchase = new Purchase();

  // populate purchase - customer
  purchase.customer = this.checkoutFormGroup.controls['customer'].value; // Corrigé ici

  // populate purchase - shipping address
  purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
  const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
  const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
  purchase.shippingAddress.state = shippingState.name;
  purchase.shippingAddress.country = shippingCountry.name;

  // populate purchase - billing address
  purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
  const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
  const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
  purchase.billingAddress.state = billingState.name;
  purchase.billingAddress.country = billingCountry.name;

  // populate purchase - order and orderItems
  purchase.order = order;
  purchase.orderItems = orderItems;

  console.log('Purchase object before sending:', JSON.stringify(purchase, null, 2));

  // call REST API via the CheckoutService
  this.checkoutService.placeOrder(purchase).subscribe(
    response => {
      alert(`Your order has been received. \n Order tracking Number: ${response.orderTrackingNumber} , total price: ${order.totalPrice} , total quantity: ${order.totalQuantity}`);
      this.resetCart();
    },
    err => {
      alert(`There was an error: ${err.message}`);
    }
  );
}

  

  copyAddress(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if(checkbox.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  getStates(formGroupName: string) {
    
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`{formeGroupeName} country code: ${countryCode}` );
    console.log(`{formeGroupeName} country name: ${countryName}` );

    this.shopFromServices.getStates(countryCode).subscribe(
      data =>{
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }

        // select first item by default

        formGroup?.get('state')?.setValue(data[0]);
      }
    );


  }

  reviewCartDetails() {
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data 
    );
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back ti products page
    this.router.navigateByUrl("/products");
    
  }

  get firstName() {return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() {return this.checkoutFormGroup.get('customer.lastName'); }
  get email() {return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() {return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() {return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() {return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() {return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() {return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() {return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() {return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() {return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() {return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() {return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() {return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() {return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() {return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() {return this.checkoutFormGroup.get('creditCard.securityCode'); }
  
  

}
