import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-frontend-modifica-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modifica-password.component.html',
  styleUrl: './modifica-password.component.css',
})

export class ModificaPasswordComponent {
  private http = inject(HttpClient);

  passwordAttuale = '';
  nuovaPassword = '';
  confermaPassword = '';

  showPasswordAttuale = false;
  showPasswordNuova = false;
  showPasswordConferma = false;

  messaggio = signal<string | null>(null);
  errore = signal<string | null>(null);
  loading = signal<boolean>(false);

  modificaPassword(): void {
    this.messaggio.set(null);
    this.errore.set(null);

    // controllo campi vuoti
    if (!this.passwordAttuale || !this.nuovaPassword || !this.confermaPassword) {
      this.errore.set('Compila tutti i campi.');
      return;
    }

    // controllo conferma password
    if (this.nuovaPassword !== this.confermaPassword) {
      this.errore.set('La conferma password non coincide.');
      return;
    }

    const token = localStorage.getItem('authToken');

    if (!token) {
      this.errore.set('Token non presente. Effettua il login.');
      return;
    }

    const body = {
      passwordAttuale: this.passwordAttuale,
      nuovaPassword: this.nuovaPassword,
      confermaPassword: this.confermaPassword,
    };

    this.loading.set(true);

    this.http
      .put('http://localhost:3000/api/modifica-password', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe({
        next: () => {
          this.messaggio.set('Password modificata con successo.');
          this.passwordAttuale = '';
          this.nuovaPassword = '';
          this.confermaPassword = '';
          this.loading.set(false);
        },
        error: (err) => {
          this.errore.set(
            err?.error?.message || 'Errore durante la modifica della password.'
          );
          this.loading.set(false);
        },
      });
  }
  
}