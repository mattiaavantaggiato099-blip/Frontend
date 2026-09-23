import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  picture: string;
  fullName: string;
}

interface RegisterResponse {
  message: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected http = inject(HttpClient);
  protected jwtSrv = inject(JwtService);
  protected router = inject(Router);

  protected _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  isAuthenticated = computed(() => {
    return !!this.currentUser();
  });

  constructor() {
    this.fetchUser().subscribe();
  }

  fetchUser() {
    return this.http.get<User>('/api/users/me')
      .pipe(
        catchError(() => {
          this.jwtSrv.removeToken();
          return of(null)
        }),
        tap(user => this._currentUser.set(user))
      )
  }

  login(email: string, password: string) {
    return this.http.post<{ user: User, token: string }>('/api/login', { email, password })
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token)),
        map(res => res.user),
        tap(user => this._currentUser.set(user))
      );
  }

  register(email: string, password: string, nome: string, cognome: string) {
    return this.http.post<RegisterResponse>('/api/register', {
      email,
      password,
      nomeTitolare: nome,
      cognomeTitolare: cognome
    });
  }

  logout() {
    this.jwtSrv.removeToken();
    this.router.navigate(['/login']);
  }
}
