import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth/auth-service';
import { tap, map } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isValidTokens$().pipe(
    tap(valid => {
      if (!valid) router.navigate(['/login']);
    }),
    map(valid => valid) 
  );
};
