import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-frontend-modifica-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './modifica-password.component.html',
  styleUrl: './modifica-password.component.css',
})
export class ModificaPasswordComponent {

  private http = inject(HttpClient);

  passwordAttuale = '';
  nuovaPassword = '';
  confermaPassword = '';

  messaggio = '';
  errore = '';

  modificaPassword(): void {

    this.messaggio = '';
    this.errore = '';


    // controllo campi vuoti
    if (
      !this.passwordAttuale ||
      !this.nuovaPassword ||
      !this.confermaPassword
    ) {
      this.errore = 'Compila tutti i campi.';
      return;
    }


    // controllo conferma password
    if (this.nuovaPassword !== this.confermaPassword) {
      this.errore = 'La conferma password non coincide.';
      return;
    }


    const token = localStorage.getItem('token');


    if (!token) {
      this.errore = 'Token non presente. Effettua il login.';
      return;
    }


    const body = {
      passwordAttuale: this.passwordAttuale,
      nuovaPassword: this.nuovaPassword,
      confermaPassword: this.confermaPassword
    };


    this.http.put(
      'http://localhost:3000/api/modifica-password',
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .subscribe({

      next: () => {

        this.messaggio =
          'Password modificata con successo.';


        this.passwordAttuale = '';
        this.nuovaPassword = '';
        this.confermaPassword = '';

      },


      error: (err) => {

        this.errore =
          err.error?.message ||
          'Errore durante la modifica della password.';

      }

    });

  }

}