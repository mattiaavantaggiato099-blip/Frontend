import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bonifico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bonifico.component.html',
  styleUrl: './bonifico.component.css',
})
export class BonificoComponent {
  private http = inject(HttpClient);

  datiBonifico = {
    iban: '',
    importo: null as number | null,
    causale: ''
  };

  messaggioEsito = '';
  erroreEsito = '';

  inviaBonifico() {
    this.messaggioEsito = '';
    this.erroreEsito = '';

    const body = {
      ibanDestinatario: this.datiBonifico.iban,
      importo: this.datiBonifico.importo
    };

    this.http.post('/api/operazioni/bonifico', body).subscribe({
      next: () => {
        this.messaggioEsito = 'Bonifico eseguito con successo';
      },
      error: (err) => {
        this.erroreEsito = err.error?.message || 'Impossibile collegarsi al backend';
      }
    });
  }
}