import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const sellerGuard: CanActivateFn = (route, state) => {
  const role = localStorage.getItem('userRole');
const router= inject(Router);
  if(role === 'seller'){
    return true;
  }
  router.navigate(['/home']);
  return false;
};
