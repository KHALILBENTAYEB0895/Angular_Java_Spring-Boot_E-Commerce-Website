import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username!: string;
  password!: string;
  loginFailed: boolean = false;
  isLoggedIn = false;

  private loginUrl = 'http://localhost:8080/api/auth/login';

  constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService){}

  onLogin() {
    this.httpClient.post<boolean>(this.loginUrl,{
      username: this.username,
      password: this.password
    }).subscribe(
      response => {
        if(response) {
          this.authService.login();
          this.router.navigate(['/products'])
        }else{
          this.loginFailed = true;
        }
      }, 
      error => {
        this.loginFailed = true;
      }
    );
  }
}
