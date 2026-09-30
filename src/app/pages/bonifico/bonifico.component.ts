import { Component, inject, OnInit, signal } from '@angular/core';
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
export class BonificoComponent implements OnInit {
  private http = inject(HttpClient);

  datiBonifico = {
    iban: '',
    importo: null as number | null,
    causale: ''
  };

  saldo = signal<number | null>(null);
  messaggioEsito = signal('');
  erroreEsito = signal('');

  ngOnInit() {
    this.caricaSaldo();
  }

  caricaSaldo() {
    this.http
      .get<{ movimenti: unknown[]; saldo?: number }>('/api/movimenti', { params: { n: 1 } })
      .subscribe({
        next: (res) => this.saldo.set(res.saldo ?? 0),
        error: (err) => console.error('Errore caricamento saldo:', err),
      });
  }

  inviaBonifico() {
    this.messaggioEsito.set('');
    this.erroreEsito.set('');

    const body = {
      ibanDestinatario: this.datiBonifico.iban,
      importo: this.datiBonifico.importo
    };

    this.http.post('/api/operazioni/bonifico', body).subscribe({
      next: () => {
        this.messaggioEsito.set('Bonifico eseguito con successo');
        this.caricaSaldo(); // aggiorna il saldo dopo il bonifico
      },
      error: (err) => {
        this.erroreEsito.set(err.error?.message || 'Impossibile collegarsi al backend');
      }
    });
  }
}