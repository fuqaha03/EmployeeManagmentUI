import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';


export const EmployeeGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isEmployee()) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
