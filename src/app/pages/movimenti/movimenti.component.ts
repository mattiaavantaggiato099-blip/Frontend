import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MovimentiService } from '../../services/movimenti.service';

export interface Movimento {
  data: string | Date;
  importo: number;
  nomeCategoria: string;
  descrizioneEstesa: string;
}

export interface MovimentoRicercaResult {
  movimenti: Movimento[];
  saldo?: number;
}

export interface Categoria {
  categoriaMovimentoId: string;
  nomeCategoria: string;
  tipologia: string;
}

type Modalita = 'nessuno' | 'categoria' | 'date';

@Component({
  selector: 'app-movimenti',
  imports: [ReactiveFormsModule, DecimalPipe, DatePipe],
  templateUrl: './movimenti.component.html',
  styleUrl: './movimenti.component.css',
})
export class MovimentiComponent {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private movSrv = inject(MovimentiService);

  movimenti = signal<Movimento[]>([]);
  saldo = signal<number | null>(null);
  categorie = signal<Categoria[]>([]);
  errore = signal<string | null>(null);
  modalita: Modalita = 'nessuno';

  movimentiForm = this.fb.group({
    numMov: [5],
    categoria: [''],
    dataDa: [''],
    dataA: [''],
  });

  cambiaModalita(m: Modalita) {
    this.modalita = m;

    this.movimentiForm.patchValue({
      categoria: '',
      dataDa: '',
      dataA: '',
    });
  }

  cerca() {
    const { numMov, categoria, dataDa, dataA } =
      this.movimentiForm.getRawValue();

    this.errore.set(null);

    this.movSrv
      .cerca(
        numMov ?? 5,
        this.modalita === 'date' ? dataDa || undefined : undefined,
        this.modalita === 'date' ? dataA || undefined : undefined,
        this.modalita === 'categoria' ? categoria || undefined : undefined
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.movimenti.set(res.movimenti);

          this.saldo.set(
            this.modalita === 'nessuno' ? (res.saldo ?? 0) : null
          );
        },
        error: (err) => {
          this.errore.set(
            err?.error?.message ?? 'Errore nella ricerca'
          );
          this.movimenti.set([]);
          this.saldo.set(null);
        },
      });
  }

  esportaCsv() {
    const righe = this.movimenti().map((m) => {
      const data = new Date(m.data).toLocaleDateString('it-IT');

      return `${data};${m.importo};${m.nomeCategoria}`;
    });

    const csv = ['Data;Importo;Categoria', ...righe].join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'movimenti.csv';
    a.click();

    URL.revokeObjectURL(url);
  }

  ngOnInit() {
    this.movSrv
      .cercaNomeCat()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cat) => this.categorie.set(cat),
        error: () =>
          this.errore.set('Impossibile caricare le categorie'),
      });

    this.cerca();
  }
}