import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ricarica',
  imports: [FormsModule],
  templateUrl: './ricarica.component.html',
  styleUrl: './ricarica.component.css',
})
export class RicaricaComponent {
  private http = inject(HttpClient);

  numeroTelefonico = '';
  operatore = '';
  taglio: number | null = null;

  messaggioEsito = '';
  erroreEsito = '';

  inviaRicarica() {
    this.messaggioEsito = '';
    this.erroreEsito = '';

    const body = {
      numeroTelefonico: this.numeroTelefonico.replace(/\s+/g, ''),
      operatore: this.operatore,
      taglio: Number(this.taglio)
    };

    this.http.post('/api/operazioni/ricarica', body).subscribe({
      next: () => {
        this.messaggioEsito = 'Ricarica eseguita con successo';
      },
      error: (err) => {
        this.erroreEsito = err.error?.message || 'Impossibile collegarsi al backend';
      }
    });
  }
}