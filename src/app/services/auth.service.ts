import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

export interface User {
  contoCorrenteId: string;
  email: string;
  password: string;
  cognomeTitolare: string;
  nomeTitolare: string;
  dataApertura: Date;
  IBAN: string;
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
    // Al caricamento dell'app, prova a decodificare il token e ripristinare l'utente
    this.restoreSession();
  }

  /**
   * Ripristina la sessione se esiste un token valido
   */
  restoreSession() {
    const token = this.jwtSrv.getToken();
    if (token) {
      const decoded = this.jwtSrv.decodeToken(token);
      if (decoded && !this.jwtSrv.isTokenExpired(token)) {
        // Ricostruisci l'utente dal payload del token
        this._currentUser.set({
          contoCorrenteId: decoded.contoCorrenteId,
          email: decoded.email,
          password: '', // non salvare mai la password
          cognomeTitolare: decoded.cognomeTitolare,
          nomeTitolare: decoded.nomeTitolare,
          dataApertura: decoded.dataApertura,
          IBAN: decoded.IBAN,
        });
      } else {
        // Token scaduto o non valido → pulisci
        this.jwtSrv.removeToken();
      }
    }
  }

  login(email: string, password: string) {
    return this.http.post<{ user: User; token: string }>('/api/login', { email, password }).pipe(
      tap(res => {
        this.jwtSrv.setToken(res.token);
      }),
      map(res => res.user),
      tap(user => this._currentUser.set(user))
    );
  }

  register(email: string, password: string, nome: string, cognome: string) {
    return this.http.post<RegisterResponse>('/api/register', {
      email,
      password,
      nomeTitolare: nome,
      cognomeTitolare: cognome,
    });
  }

  logout() {
    this.jwtSrv.removeToken();
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }
}