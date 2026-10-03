import { Component, inject, input, signal, effect, output } from '@angular/core';
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

  // Output che emette il saldo ogni volta che viene aggiornato
  saldoChange = output<number | null>();

  constructor() {
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

    const dataDaStr = da ? da.toISOString() : undefined;
    const dataAStr = a ? a.toISOString() : undefined;

    this.movSrv.cerca(num, dataDaStr, dataAStr, cat).subscribe({
      next: (res) => {
        const nuovoSaldo = res.saldo ?? null;

        this.movimenti.set(res.movimenti);
        this.saldo.set(nuovoSaldo);

        // Emetti il saldo come output
        this.saldoChange.emit(nuovoSaldo);
      },
      error: (err) => {
        this.errore.set(err?.error?.message ?? 'Errore nella ricerca');
        this.movimenti.set([]);
        this.saldo.set(null);

        // Emetti null in caso di errore
        this.saldoChange.emit(null);
      },
    });
  }

  esportaCsv() {
    this.movSrv.esportaCsv(this.movimenti());
  }
}