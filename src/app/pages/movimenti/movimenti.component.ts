import { Component, inject, signal, viewChild, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ListaMovimentiComponent } from '../../components/lista-movimenti/lista-movimenti.component';
import { Categoria, MovimentiService } from '../../services/movimenti.service';

export type Modalita = 'nessuno' | 'categoria' | 'date';

@Component({
  selector: 'app-movimenti',
  imports: [ReactiveFormsModule, ListaMovimentiComponent, DecimalPipe],
  templateUrl: './movimenti.component.html',
  styleUrl: './movimenti.component.css',
})
export class MovimentiComponent implements OnInit {
  private fb = inject(FormBuilder);
  listaMov = viewChild<ListaMovimentiComponent>(ListaMovimentiComponent);
  private movimentiSrv = inject(MovimentiService);

  modalita: Modalita = 'nessuno';

  saldoConto: number | null = null;

  movimentiForm = this.fb.group({
    numMov: [5],
    categoria: [''],
    dataDa: [null as Date | null],
    dataA: [null as Date | null],
  });

  categorie = signal<Categoria[]>([]);
  categorieFormattate = signal<Categoria[]>([]);

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

  get numMov() {
    return this.movimentiForm.get('numMov')?.value ?? 5;
  }

  get categoria() {
    return this.movimentiForm.get('categoria')?.value ?? '';
  }

  get dataDa() {
    const val = this.movimentiForm.get('dataDa')?.value as Date | null;
    return val ?? undefined;
  }

  get dataA() {
    const val = this.movimentiForm.get('dataA')?.value as Date | null;
    return val ?? undefined;
  }

  cambiaModalita(m: Modalita) {
    this.modalita = m;

    this.movimentiForm.patchValue({
      numMov: m === 'nessuno' ? 5 : this.movimentiForm.get('numMov')?.value,
      categoria: m === 'categoria' ? this.movimentiForm.get('categoria')?.value : '',
      dataDa: m === 'date' ? this.movimentiForm.get('dataDa')?.value : null,
      dataA: m === 'date' ? this.movimentiForm.get('dataA')?.value : null,
    });
  }

  cerca() {
    this.listaMov()?.cerca();
  }

  esportaCsv() {
    this.listaMov()?.esportaCsv();
  }
}