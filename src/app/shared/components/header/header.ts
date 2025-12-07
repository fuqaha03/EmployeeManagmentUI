import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
    constructor(public authService: AuthService, private router :Router) {}
    isLoginedIn(): boolean {
        return this.authService.isLoggedIn();
    }
      logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
