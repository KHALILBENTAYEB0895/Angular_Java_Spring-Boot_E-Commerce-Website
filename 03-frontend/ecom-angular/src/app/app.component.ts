import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn: boolean = false;
  title = 'ecom-angular';
  constructor(){
    // this.isLoggedIn = localStorage.getItem('loggedIn') === 'false';
  }
}
