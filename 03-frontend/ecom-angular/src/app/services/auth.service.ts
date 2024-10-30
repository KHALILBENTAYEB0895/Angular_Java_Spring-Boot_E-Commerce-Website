import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private router: Router){
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    this.loggedInSubject.next(isLoggedIn);
  }

  login() {
    localStorage.setItem('loggedIn', 'true');
    this.loggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('loggedIn');
    this.loggedInSubject.next(false);
    this.router.navigate(['/login'])
  }

  
}
