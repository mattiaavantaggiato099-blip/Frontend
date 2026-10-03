import { Component, inject, signal, viewChild, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { debounceTime, merge } from 'rxjs';
import { ListaMovimentiComponent } from '../../components/lista-movimenti/lista-movimenti.component';
import { Categoria, MovimentiService } from '../../services/movimenti.service';

@Component({
  selector: 'app-movimenti',
  imports: [ReactiveFormsModule, ListaMovimentiComponent, DecimalPipe],
  templateUrl: './movimenti.component.html',
  styleUrl: './movimenti.component.css',
})
export class MovimentiComponent implements OnInit {
  private fb = inject(FormBuilder);
  private movimentiSrv = inject(MovimentiService);
  listaMov = viewChild<ListaMovimentiComponent>(ListaMovimentiComponent);

  saldoConto: number | null = null;

  movimentiForm = this.fb.group({
    numMov: [5],
    categoria: [''],
    dataDa: [null as string | null],
    dataA: [null as string | null],
  });

  // Filtri effettivi passati a lista-movimenti (cambiano solo quando serve)
  numMov = signal(5);
  categoria = signal('');
  dataDa = signal<Date | undefined>(undefined);
  dataA = signal<Date | undefined>(undefined);
  avvisoDate = signal('');

  categorie = signal<Categoria[]>([]);
  categorieFormattate = signal<Categoria[]>([]);

  constructor() {
    const c = this.movimentiForm.controls;

    // Categoria scelta -> svuota le date
    c.categoria.valueChanges.pipe(takeUntilDestroyed()).subscribe((cat) => {
      if (cat) {
        c.dataDa.setValue(null, { emitEvent: false });
        c.dataA.setValue(null, { emitEvent: false });
      }
      this.aggiornaFiltri();
    });

    // Data inserita -> riporta la categoria su "Tutte"
    merge(c.dataDa.valueChanges, c.dataA.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (c.dataDa.value || c.dataA.value) {
          c.categoria.setValue('', { emitEvent: false });
        }
        this.aggiornaFiltri();
      });

    // Numero di movimenti: piccolo ritardo mentre si digita
    c.numMov.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe(() => this.aggiornaFiltri());
  }

  ngOnInit() {
    this.movimentiSrv.cercaNomeCat().subscribe({
      next: (cats) => {
        this.categorie.set(cats);
        this.categorieFormattate.set(
          cats.map((c) => ({
            ...c,
            nomeCategoria: this.formattaNomeCategoria(c.nomeCategoria),
          }))
        );
      },
      error: (err) => {
        console.error('Errore nel caricamento categorie:', err);
        this.categorie.set([]);
        this.categorieFormattate.set([]);
      },
    });
  }

  private formattaNomeCategoria(nome: string): string {
    return nome
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private aggiornaFiltri() {
    const { numMov, categoria, dataDa, dataA } = this.movimentiForm.getRawValue();

    // numero valido: altrimenti resta l'ultimo valore buono
    const n = Number(numMov);
    if (Number.isInteger(n) && n >= 1) {
      this.numMov.set(n);
    }

    this.categoria.set(categoria ?? '');

    // le date valgono solo in coppia (come richiede il backend)
    this.avvisoDate.set('');

    if (dataDa && dataA) {
      if (dataDa > dataA) {
        // le stringhe YYYY-MM-DD si confrontano correttamente
        this.avvisoDate.set('La data iniziale è successiva a quella finale');
        this.dataDa.set(undefined);
        this.dataA.set(undefined);
      } else {
        this.dataDa.set(new Date(dataDa));
        this.dataA.set(new Date(dataA));
      }
    } else {
      if (dataDa || dataA) {
        this.avvisoDate.set('Inserisci entrambe le date per filtrare');
      }
      this.dataDa.set(undefined);
      this.dataA.set(undefined);
    }
  }

  azzeraFiltri() {
    this.movimentiForm.patchValue(
      { categoria: '', dataDa: null, dataA: null },
      { emitEvent: false }
    );
    this.aggiornaFiltri();
  }

  esportaCsv() {
    this.listaMov()?.esportaCsv();
  }
}