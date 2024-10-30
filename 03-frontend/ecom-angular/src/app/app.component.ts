import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn: boolean = false;
  title = 'ecom-angular';
  constructor(private authService: AuthService){
    this.authService.isLoggedIn$.subscribe(
      loggedIn => {
        this.isLoggedIn = loggedIn;
      }
    )
  }

  logout(){
    this.authService.logout();
    this.isLoggedIn = false;
  }
}
