import { Component, inject, input, signal, effect } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MovimentiService, Movimento } from '../../services/movimenti.service';

@Component({
  selector: 'app-lista-movimenti',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './lista-movimenti.component.html',
  styleUrl: './lista-movimenti.component.css',
})
export class ListaMovimentiComponent {
  private movSrv = inject(MovimentiService);

  numMov = input<number>();
  categoria = input<string>();
  dataDa = input<Date | undefined>();
  dataA = input<Date | undefined>();

  movimenti = signal<Movimento[]>([]);
  saldo = signal<number | null>(null);
  errore = signal<string | null>(null);

  constructor() {
    // Quando cambiano gli input, richiama cerca()
    effect(() => {
      this.cerca();
    });
  }

  cerca() {
    this.errore.set(null);

    const num = this.numMov() ?? 5;
    const cat = this.categoria();
    const da = this.dataDa();
    const a = this.dataA();

    // Converte le date in stringa ISO solo se definite
    const dataDaStr = da ? da.toISOString() : undefined;
    const dataAStr = a ? a.toISOString() : undefined;

    this.movSrv.cerca(num, dataDaStr, dataAStr, cat).subscribe({
      next: (res) => {
        this.movimenti.set(res.movimenti);
        this.saldo.set(res.saldo ?? null);
      },
      error: (err) => {
        this.errore.set(err?.error?.message ?? 'Errore nella ricerca');
        this.movimenti.set([]);
        this.saldo.set(null);
      },
    });
  }

  esportaCsv() {
    this.movSrv.esportaCsv(this.movimenti());
  }
}