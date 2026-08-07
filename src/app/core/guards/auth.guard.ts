import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const nonAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};

export const subscriptionGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  const tenant = authService.currentTenant();
  if (tenant) {
    if (tenant.subscriptionStatus === 'ACTIVE') {
      return true;
    } else {
      router.navigate(['/subscription']);
      return false;
    }
  }

  return authService.getTenantDetails().pipe(
    map((t) => {
      authService.currentTenant.set(t);
      if (t.subscriptionStatus === 'ACTIVE') {
        return true;
      }
      router.navigate(['/subscription']);
      return false;
    }),
    catchError(() => {
      return of(true);
    })
  );
};
