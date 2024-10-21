import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopFromService {

  constructor() { }

  getCreditCardMonths(): Observable<number[]>{

    let data: number[] = [];
    // build a array for "Month" dropdown list
    // start at current month and loop until
    //TODO : the month should be dependent to year

    for(let theMonth = 1; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]>{

    let data: number[] = [];
    // build an array for "Year" downlist list
    // start at current year and loop for next 10 years

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }
}
