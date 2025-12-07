import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/components/header/header";
import { AuthService } from './core/services/auth';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header , CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EmployeeManagment');
    isAuthenticated = false;
      constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
  }
}
