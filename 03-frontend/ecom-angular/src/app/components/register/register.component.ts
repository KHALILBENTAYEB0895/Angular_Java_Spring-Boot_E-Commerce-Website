import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  username: string ='';
  password: string ='';
  registerSuccess: string = '';
  registerError: string = '';
  registerUrl = 'http://localhost:8080/api/auth/register'

  constructor(private httpClient: HttpClient){}

  onRegister(){
    this.httpClient.post<{ message?: string; error?: string }>(this.registerUrl,{
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        if (response.message) {
          this.registerSuccess = response.message;
        }
      },
      error: (error) => {
        console.error('Error during registration', error);
        this.registerError = error.error?.error || 'Registration failed'; 
      }
    });
  }
}
