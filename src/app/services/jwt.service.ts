import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private readonly TOKEN_KEY = 'authToken';

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Decodifica il payload di un token JWT (senza verificarne la firma)
   */
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  /**
   * Controlla se un token è scaduto in base al claim `exp`
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  /**
   * Verifica se esiste un token valido (presente e non scaduto)
   */
  hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }
}