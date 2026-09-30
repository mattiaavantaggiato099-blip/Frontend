import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';


export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const jwtSrv = inject(JwtService);

  if (jwtSrv.hasToken()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};