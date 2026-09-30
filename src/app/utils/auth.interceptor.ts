import { HttpInterceptorFn } from '@angular/common/http';
import { JwtService } from '../services/jwt.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtSrv = inject(JwtService);
  const authToken = jwtSrv.getToken();

  // Non allegare il token a rotte pubbliche (adatta il percorso se necessario)
  const publicRoutes = ['/api/login', '/api/register'];
  if (publicRoutes.some(route => req.url.startsWith(route))) {
    return next(req);
  }

  if (authToken) {
    // Se il token è scaduto, fai logout
    if (jwtSrv.isTokenExpired(authToken)) {
      jwtSrv.removeToken();
      window.location.href = '/login';
      return next(req);
    }

    const newReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
    return next(newReq);
  }

  return next(req);
};