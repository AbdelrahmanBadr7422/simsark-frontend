import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('authToken');
  const router = inject(Router)
  if (token) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
