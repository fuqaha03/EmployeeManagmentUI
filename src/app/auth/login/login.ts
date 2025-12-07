// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone:true,
  selector: 'app-login',
  imports:[CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(public authService: AuthService, private router: Router) {}

  login() {
  const credentials = { email: this.email, password: this.password };
  this.authService.login(credentials)
    .subscribe({
      next: res => {
        this.authService.setToken(res.result.token); 
        if (this.authService.getRole() === 'Admin') {
          this.router.navigate(['/admin/employees']);
        } else {
        this.router.navigate(['/employee/profile']);
        }
      },
      error: err => {

  if (err.error?.errors) {
    // Extract first validation message
    const firstKey = Object.keys(err.error.errors)[0];
    this.error = err.error.errors[firstKey][0];
  }
  else if (err.error?.title) {
    this.error = err.error.title; 
  }
  
  else {
    this.error =  err.error ||  'Login failed. Please try again.';
  }
}
    });
}

  
}
