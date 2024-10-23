import { ShopFromService } from './../../services/shop-from.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from '../../common/country';
import { State } from '../../common/state';

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
              private shopFromServices: ShopFromService) {}
  
  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
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
        this.countries =data;
      }
    );

  }

  
  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('billingAddress')?.value);
  }

  copyAddress(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if(checkbox.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
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

}
